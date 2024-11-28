import * as foccaciaServices from './foccacia-services.mjs';
import errorsMapping from './application-to-http-errors.mjs';

export const getTeamsByName = createHandler(internalGetTeamsByName);
export const getLeaguesByTeam = createHandler(internalGetLeaguesByTeam);
export const createGroup = createHandler(internalCreateGroup);
export const updateGroup = createHandler(internalUpdateGroup);
export const getGroups = createHandler(internalGetGroups);
export const deleteGroup = createHandler(internalDeleteGroup);
export const getGroupDetails = createHandler(internalGetGroupDetails);
export const addTeamToGroup = createHandler(internalAddTeamToGroup);
export const removeTeamFromGroup = createHandler(internalRemoveTeamFromGroup);
export const createUser = createHandler(internalCreateUser);

export function extractToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    req.token = token.split(' ')[1];
    next();
  } else {
    res.status(401).send('Token not provided');
  }
}

function internalGetTeamsByName(req, rsp) {
  return foccaciaServices
    .getTeamsByName(req.query.name)
    .then((teams) => rsp.json(teams));
}

function internalGetLeaguesByTeam(req, rsp) {
  return foccaciaServices
    .getLeaguesByTeam(req.query.team)
    .then((leagues) => rsp.json(leagues));
}

function internalCreateGroup(req, rsp) {
  return foccaciaServices
    .createGroup(req.body.name, req.body.description, req.token)
    .then((group) => rsp.status(201).json(group));
}

function internalUpdateGroup(req, rsp) {
  return foccaciaServices
    .updateGroup(
      req.query['groupId'],
      req.body.name,
      req.body.description,
      req.token
    )
    .then((group) => rsp.json(group));
}

function internalGetGroups(req, rsp) {
  return foccaciaServices
    .getGroups(req.token)
    .then((groups) => rsp.json(groups));
}

function internalDeleteGroup(req, rsp) {
  return foccaciaServices
    .deleteGroup(req.query['groupId'], req.token)
    .then(() => rsp.status(204).send());
}

function internalGetGroupDetails(req, rsp) {
  return foccaciaServices
    .getGroupDetails(req.params.groupId, req.token)
    .then((group) => rsp.json(group));
}

function internalAddTeamToGroup(req, rsp) {
  return foccaciaServices
    .addTeamToGroup(
      req.params.groupId,
      req.body.teamId,
      req.body.leagueId,
      req.body.season,
      req.token
    )
    .then((team) => rsp.status(201).json(team));
}

function internalRemoveTeamFromGroup(req, rsp) {
  return foccaciaServices
    .removeTeamFromGroup(
      req.params.groupId,
      req.query['teamId'],
      req.query['leagueId'],
      req.query['season'],
      req.token
    )
    .then(() => rsp.status(204).send());
}

function internalCreateUser(req, rsp) {
  return foccaciaServices
    .createUser(req.body.username)
    .then((user) => rsp.status(201).json(user));
}

function createHandler(specificFunction) {
  return function (req, rsp, next) {
    const promiseResult = specificFunction(req, rsp);

    promiseResult.catch((error) => sendError(rsp, error));
  };
}

function sendError(rsp, appError) {
  console.error(appError);
  const httpError = errorsMapping(appError);
  rsp.status(httpError.status).json(httpError.body);
}
