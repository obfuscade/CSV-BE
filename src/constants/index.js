const { default: rateLimit } = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError.utils');

const { ORIGIN, METHODS, ALLOWED_HEADERS, OPTIONS_SUCCESS_STATUS } =
  process.env;

const CORS_OPTIONS = {
  origin: ORIGIN,
  methods: METHODS.split(','),
  allowedHeaders: ALLOWED_HEADERS.split(','),
  optionsSuccessStatus: Number(OPTIONS_SUCCESS_STATUS),
  credentials: true,
};

const LIMIT_OPTIONS = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 req per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
});

const MULTER_OPTIONS = multer({
  dest: 'uploads/', // Directory to temporarily store files
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (_, file, cb) =>
    file.mimetype === 'text/csv'
      ? cb(null, true)
      : cb(new AppError('Only CSV files are allowed', 403), false),
});

const COOKIES = {
  TOKEN: 'token',
};

module.exports = {
  MULTER_OPTIONS,
  LIMIT_OPTIONS,
  COOKIES,
  CORS_OPTIONS,
};
