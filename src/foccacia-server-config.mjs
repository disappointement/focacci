/**
 * Configures the express HTTP application (including routes and middlewares)
 */

import express from 'express';
import * as api from './foccacia-web-api.mjs';

console.log('Server-config loaded');

// Middleware to count requests
function countReq(req, res, next) {
  console.log(`Request Count: ${req.method} ${req.url}`);
  next();
}

// Middleware to show request data
function showRequestData(req, res, next) {
  console.log(`Request Data: ${JSON.stringify(req.body)}`);
  next();
}

export default function (app) {
  app.use(express.json());
  app.use(countReq, showRequestData);

  // Web Application Resources URIs
  const RESOURCES = {
    TEAMS: '/api/teams',
    LEAGUES: '/api/leagues',
    USERS: '/api/users',
    GROUPS: '/api/groups',
    GROUP: '/api/groups/:groupId',
  };

  // Middleware to extract token from request
  app.use(RESOURCES.GROUP, api.extractToken);
  app.use(RESOURCES.GROUPS, api.extractToken);

  // Web Application Routes
  app.get(RESOURCES.TEAMS, api.getTeamsByName);

  app.get(RESOURCES.LEAGUES, api.getLeaguesByTeam);

  app.post(RESOURCES.USERS, api.createUser);

  app.get(RESOURCES.GROUPS, api.getGroups);
  app.post(RESOURCES.GROUPS, api.createGroup);
  app.put(RESOURCES.GROUPS, api.updateGroup);
  app.delete(RESOURCES.GROUPS, api.deleteGroup);

  app.get(RESOURCES.GROUP, api.getGroupDetails);
  app.put(RESOURCES.GROUP, api.addTeamToGroup);
  app.delete(RESOURCES.GROUP, api.removeTeamFromGroup);
}
