const { parentPort } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const { ERROR_MESSAGES } = require('../constants');

parentPort.on('message', (filePath) => {
  const body = [];
  let headers = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (!headers?.length) {
        headers = Object.keys(data);
      }

      body.push(Object.values(data));
    })
    .on('end', () => {
      parentPort.postMessage({ headers, body });
    })
    .on('error', () => {
      parentPort.postMessage({ error: ERROR_MESSAGES.CSV });
    });
});
