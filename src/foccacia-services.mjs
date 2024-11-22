import errors from '../errors.mjs';
import * as groupsData from '../data/foccacia-data-mem.mjs';
import * as usersData from '../data/fapi-teams-data.mjs';

function changeUserTokenToUserIdArgument(internalFunction) {
  return function (...args) {
    const userToken = args.pop();
    return usersData.convertTokenToId(userToken).then((userId) => {
      args.push(userId);
      return internalFunction.apply(this, args);
    });
  };
}

export const getGroups = changeUserTokenToUserIdArgument(getGroupsInternal);
export const getGroup = changeUserTokenToUserIdArgument(getGroupInternal);
export const updateGroup = changeUserTokenToUserIdArgument(updateGroupInternal);
export const createGroup = changeUserTokenToUserIdArgument(createGroupInternal);
export const deleteGroup = changeUserTokenToUserIdArgument(deleteGroupInternal);

/**
 *
 * @returns Returns A Promise resolved with an array, with all groups
 */
function getGroupsInternal(userId) {
  return groupsData.getGroups(userId);
}

/**
 * Create a new Group, given a creator object
 *
 * @param {*} groupCreator - The object with the initial data to create a Group
 * @returns a Promise resolved with the created group
 */
function createGroupInternal(groupCreator, userId) {
  // Validate if user exists - TODO
  if (groupCreator.name && groupCreator.description) {
    return groupsData.createGroup(groupCreator, userId);
  }
  return Promise.reject(
    errors.INVALID_DATA(
      `To create a Group, a name and description must be provided`
    )
  );
}

function getGroupInternal(groupId, userId) {
  return groupsData.getGroup(groupId).then((group) => {
    if (group.ownerId === userId) return group;
    return Promise.reject(
      errors.NOT_AUTHORIZED(
        `User with id ${userId} does not own group with id ${groupId}`
      )
    );
  });
}

function updateGroupInternal(groupId, groupUpdater, userId) {
  if (groupUpdater.name && groupUpdater.description) {
    return groupsData.updateGroup(groupId, groupUpdater, userId);
  } else {
    return Promise.reject(
      errors.INVALID_DATA(
        `To update a Group, a name and description must be provided`
      )
    );
  }
}

function deleteGroupInternal(groupId, userId) {
  return groupsData.getGroup(groupId).then((group) => {
    if (group.ownerId === userId)
      return groupsData.deleteGroup(groupId, userId);
    return Promise.reject(
      errors.NOT_AUTHORIZED(
        `User with id ${userId} does not own group with id ${groupId}`
      )
    );
  });
}
