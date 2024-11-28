import errors from '../src/errors.mjs';
import * as fapiData from '../data/fapi-teams-data.mjs';
import crypto from 'crypto';

let idNextUser = 0;
let idNextGroup = 0;

class User {
  constructor(name, token = crypto.randomUUID()) {
    this.id = ++idNextUser;
    this.name = name;
    this.userToken = token;
  }
}

class Group {
  constructor(name, description, userId) {
    this.id = ++idNextGroup;
    this.name = name;
    this.description = description;
    this.ownerId = userId;
  }
}

class GroupTeam {
  constructor(groupId, teamId, leagueId, season) {
    this.groupId = groupId;
    this.teamId = teamId;
    this.leagueId = leagueId;
    this.season = season;
  }
}

const USERS = [
  new User('User1', 'c176eafd-25eb-45d3-a8cb-7218f3d63b3b'),
  new User('User2', '3efa8c5d-a9f4-4d71-be2d-8d9347e540c0'),
];

const GROUPS = [
  new Group('Group1', 'Description1', 1),
  new Group('Group2', 'Description2', 2),
];

const GROUP_TEAMS = [
  new GroupTeam(1, 1, 1, 2021),
  new GroupTeam(1, 2, 1, 2021),
  new GroupTeam(2, 1, 1, 2021),
];

export function createUser(name) {
  const user = new User(name);
  USERS.push(user);
  return Promise.resolve(user);
}

export function getGroups(userId) {
  return Promise.resolve(GROUPS.filter((g) => g.ownerId === userId));
}

export function getGroup(groupId) {
  const group = GROUPS.find((g) => g.id === groupId);

  if (group == undefined) {
    return Promise.reject(
      errors.NOT_FOUND(`Group with id ${groupId} not found`)
    );
  }

  return Promise.resolve(group);
}

export function createGroup(name, description, userId) {
  const group = new Group(name, description, userId);
  GROUPS.push(group);
  return Promise.resolve(group);
}

export function updateGroup(groupId, name, description) {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) {
    return Promise.reject(
      errors.NOT_FOUND(`Group with id ${groupId} not found`)
    );
  }
  if (name) group.name = name;
  if (description) group.description = description;

  return Promise.resolve(group);
}

export function deleteGroup(groupId) {
  const index = GROUPS.findIndex((g) => g.id === groupId);
  if (index === -1) {
    return Promise.reject(
      errors.NOT_FOUND(`Group with id ${groupId} not found`)
    );
  }
  GROUPS.splice(index, 1);
  return Promise.resolve();
}

export function getGroupDetails(groupId) {
  return getGroup(groupId).then((group) => {
    const teams = GROUP_TEAMS.filter((gt) => gt.groupId === groupId).map(
      (gt) => {
        console.log(gt);
        return fapiData
          .getTeams({
            id: gt.teamId,
            league: gt.leagueId,
            season: gt.season,
          })
          .then(
            ([
              {
                team: { name: teamName },
                venue: { name: venueName },
              },
            ]) => {
              return fapiData.getLeagues(gt.leagueId).then(
                ([
                  {
                    league: { name: leagueName },
                  },
                ]) => {
                  return {
                    team: teamName,
                    venue: venueName,
                    league: leagueName,
                    season: gt.season,
                  };
                }
              );
            }
          );
      }
    );

    return Promise.all(teams).then((teams) => {
      return {
        ...group,
        teams,
      };
    });
  });
}

export function addTeamToGroup(groupId, teamId, leagueId, season) {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) {
    return Promise.reject(
      errors.NOT_FOUND(`Group with id ${groupId} not found`)
    );
  }

  return fapiData
    .getTeams({
      id: teamId,
      league: leagueId,
      season: season,
    })
    .then(() => {
      const team = GROUP_TEAMS.find(
        (gt) =>
          gt.groupId === groupId &&
          gt.teamId === teamId &&
          gt.leagueId === leagueId &&
          gt.season === season
      );

      if (team) {
        return Promise.reject(
          errors.CONFLICT(
            `Team with id ${teamId}, league id ${leagueId} and season ${season} already exists in group with id ${groupId}`
          )
        );
      }

      const groupTeam = new GroupTeam(groupId, teamId, leagueId, season);
      GROUP_TEAMS.push(groupTeam);
      return Promise.resolve(groupTeam);
    });
}

export function removeTeamFromGroup(groupId, teamId, leagueId, season) {
  const index = GROUP_TEAMS.findIndex(
    (gt) =>
      gt.groupId === groupId &&
      gt.teamId === teamId &&
      gt.leagueId === leagueId &&
      gt.season === season
  );
  if (index === -1) {
    return Promise.reject(
      errors.NOT_FOUND(
        `Team with id ${teamId}, league id ${leagueId} and season ${season} not found in group with id ${groupId}`
      )
    );
  }
  GROUP_TEAMS.splice(index, 1);
  return Promise.resolve();
}

export function convertTokenToId(userToken) {
  const user = USERS.find((u) => u.userToken === userToken);
  if (!user) {
    return Promise.reject(
      errors.NOT_FOUND(`User with token ${userToken} not found`)
    );
  }
  return Promise.resolve(user.id);
}
