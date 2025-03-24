const { COOKIES } = require('../../constants');
const tokenBlackListModel = require('../../models/tokenBlackList.model');
const userModel = require('../../models/user.model');
const CookieProvider = require('../../providers/cookie.provider');
const JwtProvider = require('../../providers/jwt.provider');
const AppError = require('../../utils/appError.utils');
const catchAsync = require('../../utils/catchAsync.utils');

class AuthMiddleware {
  static verify = catchAsync(async (req, _, next) => {
    const token = CookieProvider.get({ req, key: COOKIES.TOKEN });

    // Token not provided
    if (!token) {
      return next(new AppError('Unauthorized', 401));
    }

    const isTokenInBlackList = await tokenBlackListModel.findOne({ token });

    // Token expired
    if (isTokenInBlackList) {
      return next(new AppError('Unauthorized', 401));
    }

    const decoded = await JwtProvider.decode(token);
    const isUserExist = await userModel.findById(decoded.userId);

    // User deleted
    if (!isUserExist) {
      return next(new AppError('Unauthorized', 401));
    }

    req.userId = decoded.userId;
    return next();
  });
}

module.exports = AuthMiddleware;
