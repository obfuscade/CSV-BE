const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { CORS_OPTIONS, LIMIT_OPTIONS } = require('./constants');
const authRouter = require('./api/routes/auth.route');
const ErrorController = require('./controller/error.controller');
const AppError = require('./utils/appError.utils');

const app = express();

// Security
app.use(cors(CORS_OPTIONS)).use(helmet());

// Rate limits
app.use(LIMIT_OPTIONS);

// Parsers
app.use(express.json()).use(cookieParser()).use(mongoSanitize());

// Optimization
app.use(compression());

// Routes
app.use('/auth', authRouter);

// 404 Handler
app.use('*', (req, res, next) => {
  next(new AppError('Route not found', 404));
});

// Error Handler
app.use(ErrorController.handler);

module.exports = app;
