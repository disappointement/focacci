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
  app.use(countReq);
  app.use(showRequestData);
  app.use(api.extractToken);

  // Web Application Resources URIs
  const RESOURCES = {
    GROUPS: '/api/groups',
    GROUP: '/api/groups/:groupId',
  };

  // Web Application Routes
  app.get(RESOURCES.GROUPS, api.listGroups);
  app.post(RESOURCES.GROUPS, api.createUser);

  app.get(RESOURCES.GROUP, api.getGroupDetails);
  app.put(RESOURCES.GROUP, api.addTeamToGroup);
  app.delete(RESOURCES.GROUP, api.deleteGroup);
}