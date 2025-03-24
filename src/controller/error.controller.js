class ErrorController {
  static handler(error, req, res, next) {
    return res.status(error?.statusCode || 500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

module.exports = ErrorController;
