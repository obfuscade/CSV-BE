const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { CORS_OPTIONS } = require('./constants');

const app = express();

app.use(cors(CORS_OPTIONS)).use(compression()).use(cookieParser());

module.exports = app;
