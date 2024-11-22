/**
 * Implements all Groups data access, stored in memory
 */

// TODO : Implement the Groups data access

import errors from '../errors.mjs';

let idNextGroup = 0;

class Group {
  constructor(name, description, ownerId) {
    this.id = ++idNextGroup;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.teams = [];
  }
}

const GROUPS = [];

export function getGroups(userId) {
  return Promise.resolve(GROUPS.filter((g) => g.ownerId === userId));
}

export function createGroup(groupCreator, userId) {
  const newGroup = new Group(
    groupCreator.name,
    groupCreator.description,
    userId
  );
  GROUPS.push(newGroup);
  return Promise.resolve(newGroup);
}

export function getGroup(groupId) {
  const group = GROUPS.find((g) => g.id === groupId);
  if (group) {
    return Promise.resolve(group);
  }
  return Promise.reject(errors.NOT_FOUND(`Group with id ${groupId} not found`));
}

export function updateGroup(groupId, groupUpdater, userId) {
  const group = GROUPS.find((g) => g.id === groupId && g.ownerId === userId);
  if (group) {
    group.name = groupUpdater.name;
    group.description = groupUpdater.description;
    return Promise.resolve(group);
  }
  return Promise.reject(errors.NOT_FOUND(`Group with id ${groupId} not found`));
}

export function deleteGroup(groupId, userId) {
  const idxToRemove = GROUPS.findIndex(
    (g) => g.id === groupId && g.ownerId === userId
  );
  if (idxToRemove !== -1) {
    GROUPS.splice(idxToRemove, 1);
    return Promise.resolve(groupId);
  }
  return Promise.reject(errors.NOT_FOUND(`Group with id ${groupId} not found`));
}
