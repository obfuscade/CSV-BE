const { default: rateLimit } = require('express-rate-limit');

const { ORIGIN, METHODS, ALLOWED_HEADERS, OPTIONS_SUCCESS_STATUS } =
  process.env;

const CORS_OPTIONS = {
  origin: ORIGIN,
  methods: METHODS.split(','),
  allowedHeaders: ALLOWED_HEADERS.split(','),
  optionsSuccessStatus: Number(OPTIONS_SUCCESS_STATUS),
};

const LIMIT_OPTIONS = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
});

const COOKIES = {
  TOKEN: 'token',
};

module.exports = {
  LIMIT_OPTIONS,
  COOKIES,
  CORS_OPTIONS,
};
