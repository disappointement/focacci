import errors from '../src/errors.mjs';

const memoize = (fn) => {
  const memory = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!memory.has(key)) {
      console.log(`Memoizing ${key}`);
      memory.set(key, fn(...args));
    }

    return memory.get(key);
  };
};

const footballApiUrl = 'https://v3.football.api-sports.io';

export const getTeamsByName = memoize(getTeamsByNameInternal);
export const getLeaguesByTeam = memoize(getLeaguesByTeamInternal);

function getTeamsByNameInternal(teamName) {
  return fetch(`${footballApiUrl}/teams?name=${teamName}`, {
    headers: {
      'x-apisports-key': process.env.apiKey,
    },
  }).then((rsp) => {
    if (rsp.ok) {
      return rsp.json().then((data) => {
        if (data.response) {
          return data.response;
        }
        return Promise.reject(errors.NOT_FOUND(`Team ${teamName} not found`));
      });
    }

    if (rsp.status === 404) {
      return Promise.reject(errors.NOT_FOUND(`Team ${teamName} not found`));
    }

    return Promise.reject(errors.INTERNAL_ERROR(`Error fetching teams`));
  });
}

function getLeaguesByTeamInternal(teamId) {
  return fetch(`${footballApiUrl}/leagues?team=${teamId}`, {
    headers: {
      'x-apisports-key': process.env.apiKey,
    },
  }).then((rsp) => {
    if (rsp.ok) {
      return rsp.json().then((data) => {
        if (data.response) {
          return data.response;
        }
        return Promise.reject(
          errors.NOT_FOUND(`Leagues for team ${teamId} not found`)
        );
      });
    }

    if (rsp.status === 404) {
      return Promise.reject(
        errors.NOT_FOUND(`Leagues for team ${teamId} not found`)
      );
    }

    return Promise.reject(errors.INTERNAL_ERROR(`Error fetching leagues`));
  });
}
