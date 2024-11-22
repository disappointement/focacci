/**
 * Represents an application error.
 * @constructor
 * @param {number} code - The error code.
 * @param {string} message - The error message.
 */
function ApplicationError(code, message) {
  this.code = code;
  this.message = message;
}

/***
 * Error codes used in the application.
 * @enum {number}
 */
export const ERROR_CODES = {
  InvalidData: 1,
  NotFound: 2,
  NotAuthorized: 3,
};

export default {
  /**
   * Creates an InvalidData error.
   * @param {string} message - The error message.
   * @returns {ApplicationError} The InvalidData error.
   */
  INVALID_DATA: (message) =>
    new ApplicationError(ERROR_CODES.InvalidData, message),

  /**
   * Creates a NotFound error.
   * @param {string} message - The error message.
   * @returns {ApplicationError} The NotFound error.
   */
  NOT_FOUND: (message) => new ApplicationError(ERROR_CODES.NotFound, message),

  /**
   * Creates a NotAuthorized error.
   * @param {string} message - The error message.
   * @returns {ApplicationError} The NotAuthorized error.
   */
  NOT_AUTHORIZED: (message) =>
    new ApplicationError(ERROR_CODES.NotAuthorized, message),
};
