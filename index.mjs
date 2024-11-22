import express from 'express';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import cors from 'cors';


export const app = express();
const swaggerDocument = yaml.load('./docs/foccacia-api-spec.yaml');

import init from './src/foccacia-server-config.mjs';
app.use(cors());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
init(app);

const PORT = 1904;
app.listen(PORT, serverStarted);

function serverStarted(e) {
  if (e) {
    return console.log(
      `Server not started because of the following error: ${e}`
    );
  }
  console.log(`Server running on http://localhost:${PORT}`);
}
