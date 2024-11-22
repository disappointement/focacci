/**
 * Starts HTTP server
 */

import swaggerUI from 'swagger-ui-express';
import express from 'express';
import YAML from 'yamljs';
import cors from 'cors';
import foccaciaWebApi from './foccacia-web-api.mjs';

const app = express();
const swaggerDocument = YAML.load('./docs/foccacia-api-spec.yaml');

app.use(cors());
app.use(express.json()); // Middleware to handle JSON body
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api', foccaciaWebApi); // Use the routes defined in foccacia-web-api.mjs

const PORT = 1904;
app.listen(PORT, serverStarted);

function serverStarted(e) {
  if (e) {
    return console.log(
      `Server not started because of the following error: ${e}`
    );
  }
  console.log(`Server listening on port ${PORT}`);
}