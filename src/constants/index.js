const {
  ORIGIN,
  METHODS = '',
  ALLOWED_HEADERS = '',
  OPTIONS_SUCCESS_STATUS = 204,
} = process.env;

const CORS_OPTIONS = {
  origin: ORIGIN,
  methods: METHODS.split(','),
  allowedHeaders: ALLOWED_HEADERS.split(','),
  optionsSuccessStatus: Number(OPTIONS_SUCCESS_STATUS),
};

module.exports = {
  CORS_OPTIONS,
};
