# Foccacia REST API

## Overview

The Foccacia REST API provides endpoints to manage teams, leagues, users, and groups. It is built using Node.js and Express, and it includes middleware for request counting and logging request data.

## Technologies Used

- Node.js
- Express
- JSON

## Middleware

- **countReq**: Logs the request count.
- **showRequestData**: Logs the request data.
- **extractToken**: Extracts the token from the request for group-related endpoints.

## Endpoints

### Teams

- **GET /api/teams**: Retrieve teams by name.
  - Query Parameters:
    - `name`: The name of the team to search for.

### Leagues

- **GET /api/leagues**: Retrieve leagues by team.
  - Query Parameters:
    - `team`: The name of the team to search for leagues.

### Users

- **POST /api/users**: Create a user

### Groups

For all the following requests it is required to provide a Bearer authentication token.
In order to get one you must first create a user with the **POST /api/users/** endpoint.

## Group

- **GET /api/groups**: Retrieve all groups.
- **POST /api/groups**: Create a new group.
  - Request Body:
    - `name`: The name of the group.
    - `description`: The description of the group.
- **PUT /api/groups**: Update an existing group.
  - Request Queries:
    - `groupId`: The ID of the group to update.
  - Request Body:
    - `name`: The new name of the group.
    - `description`: The new description of the group.
- **DELETE /api/groups**: Delete a group.
  - Request Queries:
    - `groupId`: The ID of the group to delete.

## Group items (teams)

- **GET /api/groups:groupId**: Get the details and items of a group
- **POST /api/groups:groupId**: Add a team to a group
  - Request Body:
    - `teamId`: The id of the team
    - `leagueId`: Id of the league for the team
    - `season`: Year of the season of the league for the team
- **DELETE /api/groups:groupId**: Delete a team from a group
  - Request Queries:
    - `teamId`: The id of the team
    - `leagueId`: Id of the league for the team
    - `season`: Year of the season of the league for the team

## Running the Server

1. Ensure you have Node.js installed.
2. Clone the repository.
3. Create a configuration file (e.g., `config.json`) with the following content:
   ```json
   {
     "apiKey": "your-api-key"
   }
   ```
4. Run the server using the following command:
   ```sh
   node src/foccacia-server.mjs <config-file>
   ```
   Replace `<config-file>` with the path to your configuration file.
