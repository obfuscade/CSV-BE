class ErrorController {
  static handler(error, req, res, next) {
    return res.status(error?.status || 500).json({
      message: error?.message || 'Error',
    });
  }
}

module.exports = ErrorController;
