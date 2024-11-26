import errors from './errors.mjs';
import * as apiData from '../data/foccacia-data-mem.mjs';
import * as fapiData from '../data/fapi-teams-data.mjs';

function changeUserTokenToUserIdArgument(internalFunction) {
  return function (...args) {
    const userToken = args.pop();
    return apiData.convertTokenToId(userToken).then((userId) => {
      args.push(userId);
      return internalFunction.apply(this, args);
    });
  };
}

export const getTeamsByName = getTeamsByNameInternal;
export const getLeaguesByTeam = getLeaguesByTeamInternal;
export const createUser = createUserInternal;
export const getGroups = changeUserTokenToUserIdArgument(getGroupsInternal);
export const updateGroup = changeUserTokenToUserIdArgument(updateGroupInternal);
export const createGroup = changeUserTokenToUserIdArgument(createGroupInternal);
export const deleteGroup = changeUserTokenToUserIdArgument(deleteGroupInternal);
export const getGroupDetails = changeUserTokenToUserIdArgument(
  getGroupDetailsInternal
);
export const addTeamToGroup = changeUserTokenToUserIdArgument(
  addTeamToGroupInternal
);
export const removeTeamFromGroup = changeUserTokenToUserIdArgument(
  removeTeamFromGroupInternal
);

function parseGroupId(groupId) {
  if (!groupId) {
    return Promise.reject(errors.INVALID_DATA(`groupId must be provided`));
  }

  if (isNaN(groupId)) {
    return Promise.reject(errors.INVALID_DATA(`groupId must be a number`));
  }

  return Promise.resolve(parseInt(groupId));
}

function getTeamsByNameInternal(teamName) {
  return fapiData.getTeams({
    name: teamName,
  });
}

function getLeaguesByTeamInternal(teamId) {
  return fapiData.getLeagues({
    team: teamId,
  });
}

function createUserInternal(userName) {
  if (!userName) {
    return Promise.reject(errors.INVALID_DATA(`userName must be provided`));
  }

  return apiData.createUser(userName);
}

function getGroupsInternal(userId) {
  return apiData.getGroups(userId);
}

function createGroupInternal(name, description, userId) {
  if (name && description) {
    return apiData.createGroup(name, description, userId);
  }
  return Promise.reject(
    errors.INVALID_DATA(
      `To create a Group, a name and description must be provided`
    )
  );
}

function updateGroupInternal(groupId, name, description, userId) {
  return parseGroupId(groupId).then((groupId) => {
    return apiData.getGroup(groupId).then((group) => {
      if (!name && !description)
        return Promise.reject(
          errors.INVALID_DATA(`Either name or description must be provided`)
        );

      if (group.ownerId === userId)
        return apiData.updateGroup(groupId, name, description);

      return Promise.reject(
        errors.NOT_AUTHORIZED(
          `User with id ${userId} does not own group with id ${groupId}`
        )
      );
    });
  });
}

function deleteGroupInternal(groupId, userId) {
  return parseGroupId(groupId).then((groupId) => {
    return apiData.getGroup(groupId).then((group) => {
      if (group.ownerId === userId) return apiData.deleteGroup(groupId);
      return Promise.reject(
        errors.NOT_AUTHORIZED(
          `User with id ${userId} does not own group with id ${groupId}`
        )
      );
    });
  });
}

function getGroupDetailsInternal(groupId, userId) {
  return parseGroupId(groupId).then((groupId) => {
    return apiData.getGroup(groupId).then((group) => {
      if (group.ownerId === userId) return group;
      return Promise.reject(
        errors.NOT_AUTHORIZED(
          `User with id ${userId} does not own group with id ${groupId}`
        )
      );
    });
  });
}

function addTeamToGroupInternal(groupId, teamId, leagueId, season, userId) {
  return parseGroupId(groupId).then((groupId) => {
    return apiData.getGroup(groupId).then((group) => {
      if (group.ownerId === userId) {
        return apiData.addTeamToGroup(groupId, teamId, leagueId, season);
      }
      return Promise.reject(
        errors.NOT_AUTHORIZED(
          `User with id ${userId} does not own group with id ${groupId}`
        )
      );
    });
  });
}

function removeTeamFromGroupInternal(groupId, teamId, userId) {
  return parseGroupId(groupId).then((groupId) => {
    return apiData.getGroup(groupId).then((group) => {
      if (group.ownerId === userId) {
        return apiData.removeTeamFromGroup(groupId, teamId);
      }
      return Promise.reject(
        errors.NOT_AUTHORIZED(
          `User with id ${userId} does not own group with id ${groupId}`
        )
      );
    });
  });
}
