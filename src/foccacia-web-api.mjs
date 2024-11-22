/**
 * This file contains all HTTP API handling functions.
 */
/**
 * This file contains all HTTP API handling functions.
 */

import * as foccaciaServices from './foccacia-services.mjs';
import errorsMapping from './application-to-http-errors.mjs';
import errors from '../errors.mjs';

export const searchTeamsByName = createHandler(internalSearchTeamsByName);
export const searchLeaguesByTeam = createHandler(internalSearchLeaguesByTeam);
export const createGroup = createHandler(internalCreateGroup);
export const updateGroup = createHandler(internalUpdateGroup);
export const listGroups = createHandler(internalListGroups);
export const deleteGroup = createHandler(internalDeleteGroup);
export const getGroupDetails = createHandler(internalGetGroupDetails);
export const addTeamToGroup = createHandler(internalAddTeamToGroup);
export const removeTeamFromGroup = createHandler(internalRemoveTeamFromGroup);
export const createUser = createHandler(internalCreateUser);


// foccacia-web-api.mjs

export function extractToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    req.token = token;
    next();
  } else {
    res.status(401).send('Token not provided');
  }
}

function internalSearchTeamsByName(req, rsp) {
  return foccaciaServices
    .searchTeamsByName(req.query.name, req.headers['x-apisports-key'])
    .then((teams) => rsp.json(teams));
}

function internalSearchLeaguesByTeam(req, rsp) {
  return foccaciaServices
    .searchLeaguesByTeam(req.query.team, req.headers['x-apisports-key'])
    .then((leagues) => rsp.json(leagues));
}

function internalCreateGroup(req, rsp) {
  return foccaciaServices
    .createGroup(req.body.name, req.body.description, req.headers.authorization)
    .then((group) => rsp.status(201).json(group));
}

function internalUpdateGroup(req, rsp) {
  return foccaciaServices
    .updateGroup(
      req.params.id,
      req.body.name,
      req.body.description,
      req.headers.authorization
    )
    .then((group) => rsp.json(group));
}

function internalListGroups(req, rsp) {
  return foccaciaServices
    .listGroups(req.headers.authorization)
    .then((groups) => rsp.json(groups));
}

function internalDeleteGroup(req, rsp) {
  return foccaciaServices
    .deleteGroup(req.params.id, req.headers.authorization)
    .then(() => rsp.status(204).send());
}

function internalGetGroupDetails(req, rsp) {
  return foccaciaServices
    .getGroupDetails(req.params.id, req.headers.authorization)
    .then((group) => rsp.json(group));
}

function internalAddTeamToGroup(req, rsp) {
  return foccaciaServices
    .addTeamToGroup(
      req.params.id,
      req.body.teamId,
      req.body.leagueId,
      req.body.season,
      req.headers.authorization
    )
    .then((team) => rsp.status(201).json(team));
}

function internalRemoveTeamFromGroup(req, rsp) {
  return foccaciaServices
    .removeTeamFromGroup(
      req.params.id,
      req.params.teamId,
      req.headers.authorization
    )
    .then(() => rsp.status(204).send());
}

function internalCreateUser(req, rsp) {
  return foccaciaServices
    .createUser(req.body.username)
    .then((user) => rsp.status(201).json(user));
}

function createHandler(internalFunction) {
  return async (req, rsp) => {
    try {
      await internalFunction(req, rsp);
    } catch (error) {
      const mappedError =
        errorsMapping[error.message] || errors.INTERNAL_SERVER_ERROR;
      rsp.status(mappedError.status).json({ error: mappedError.message });
    }
  };
}
