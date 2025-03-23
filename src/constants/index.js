const { default: rateLimit } = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError.utils');

const { ORIGIN, METHODS, ALLOWED_HEADERS, OPTIONS_SUCCESS_STATUS } =
  process.env;

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  TOO_MANY_REQUEST: 'Too many requests, please try again later',
  ONLY_CSV: 'Only CSV files are allowed',
  CSV: 'Error processing CSV file',
  CLEAN_FILE: 'Error cleaning up uploaded file',
  NO_FILE_UPLOADED: 'No file uploaded',
  PROVIDE_CREDENTIALS: 'Please provide correct credentials',
  USER_EXISTS: 'User is already exist',
  INTERNAL_ERROR: 'Internal Error',
  WORKER_ERROR: (error) => `Worker error: ${error}`,
};

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
  message: ERROR_MESSAGES.TOO_MANY_REQUEST,
});

const MULTER_OPTIONS = multer({
  dest: 'uploads/', // Directory to temporarily store files
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (_, file, cb) =>
    file.mimetype === 'text/csv'
      ? cb(null, true)
      : cb(new AppError(ERROR_MESSAGES.ONLY_CSV, 403), false),
});

const COOKIES = {
  TOKEN: 'token',
};

module.exports = {
  ERROR_MESSAGES,
  MULTER_OPTIONS,
  LIMIT_OPTIONS,
  COOKIES,
  CORS_OPTIONS,
};
