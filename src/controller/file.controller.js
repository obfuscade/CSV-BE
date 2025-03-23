const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const AppError = require('../utils/appError.utils');
const catchAsync = require('../utils/catchAsync.utils');
const dataModel = require('../models/data.model');
const { ERROR_MESSAGES } = require('../constants');

class FileController {
  static upload = catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError(ERROR_MESSAGES.NO_FILE_UPLOADED, 404));
    }

    // Create a new thread to parse CSV to prevent blocking other users
    const worker = new Worker(
      path.join(__dirname, '../workers/file.worker.js')
    );
    worker.postMessage(req.file.path);

    worker.on('message', async (result) => {
      if (result.error) {
        return next(new AppError(result.error, 500));
      }

      const { headers, body } = result;
      // Get the minimum limit to prevent a new request for a new data
      const limit = Math.min(50, body?.length);

      try {
        await dataModel.create({
          headers,
          data: body,
          userId: req.userId,
        });

        fs.unlink(req.file.path, (err) => {
          if (err) {
            return next(new AppError(ERROR_MESSAGES.CLEAN_FILE, 500));
          }
        });

        return res.status(200).json({
          data: [headers, ...Object.values(body.slice(0, limit))],
          hasNextValues: body?.length > limit,
        });
      } catch (error) {
        return next(new AppError(ERROR_MESSAGES.WORKER_ERROR(error), 500));
      }
    });

    worker.on('error', (error) =>
      next(new AppError(ERROR_MESSAGES.WORKER_ERROR(error), 500))
    );
  });

  static getData = catchAsync(async (req, res) => {
    const { start, limit } = req.query;

    const result = await dataModel.getAggregatedValues({
      userId: req.userId,
      start: Number(start || 0),
      limit: Math.min(Number(limit || 20), 50), // Max limit value
    });

    return res.status(200).json({
      data: result,
    });
  });
}

module.exports = FileController;
