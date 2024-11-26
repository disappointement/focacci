import express from 'express';
import fs from 'fs';

const argv = process.argv.slice(2);

if (argv.length !== 1) {
  console.log('Usage: node src/foccacia-server.mjs <config-file>');
  process.exit(1);
}

const configFile = argv[0];
if (!fs.existsSync(configFile)) {
  console.log(`Config file not found: ${configFile}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
if (!config.apiKey) {
  console.log('Config file must have an apiKey property');
  process.exit(1);
}

process.env.apiKey = config.apiKey;

const app = express();

import init from './foccacia-server-config.mjs';
init(app);

const PORT = 2024;
app.listen(PORT, serverStarted);

function serverStarted(e) {
  if (e) {
    return console.log(
      `Server not started because of the following error: ${e}`
    );
  }
  console.log(`Server listening on port ${PORT}`);
}
