const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const AppError = require('../utils/appError.utils');
const catchAsync = require('../utils/catchAsync.utils');
const dataModel = require('../models/data.model');

class FileController {
  static upload = catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('No file uploaded', 404));
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

      const { headers, data } = result;

      try {
        await dataModel.create({
          headers,
          data,
          userId: req.userId,
        });

        // Delete the temporary upload file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            return next(
              new AppError('Error cleaning up temporary uploaded file', 500)
            );
          }
        });

        const start = 0;
        const limit = Math.min(50, data.length);
        // First headers elements then limited data for the optimization
        const mixedData = [headers, ...Object.values(data.slice(start, limit))];
        const hasNextValues = data.length > limit;

        return res.status(200).json({
          data: mixedData,
          hasNextValues,
        });
      } catch (error) {
        return next(new AppError(`Worker error: ${error}`, 500));
      }
    });

    worker.on('error', (error) =>
      next(new AppError(`Worker error: ${error}`, 500))
    );
  });

  static getData = catchAsync(async (req, res) => {
    const { start, limit } = req.query;

    let parsedLimit = Number(limit);
    let parsedStart = Number(start);

    if (!parsedLimit || parsedLimit < 0) {
      parsedLimit = 20;
    }

    if (!parsedStart || parsedStart < 0) {
      parsedStart = 0;
    }

    const data = await dataModel.getAggregatedValues({
      userId: req.userId,
      start: parsedStart,
      limit: Math.min(parsedLimit, 50), // 50 - max limit value
    });

    return res.status(200).json({
      data,
    });
  });
}

module.exports = FileController;
