const JwtProvider = require('../providers/jwt.provider');
const cookieProvider = require('../providers/cookie.provider');
const userModel = require('../models/user.model');
const { COOKIES } = require('../constants');
const tokenBlackListModel = require('../models/tokenBlackList.model');
const catchAsync = require('../utils/catchAsync.utils');
const AppError = require('../utils/appError.utils');

class AuthController {
  static signUp = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide correct credentials', 401));
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return next(new AppError('User is already exist', 409));
    }

    const userCreated = await userModel.create({ email, password });

    // Create a token and save in the httpOnly cookie
    const token = await JwtProvider.get(userCreated._id);
    cookieProvider.set({
      res,
      key: COOKIES.TOKEN,
      value: token,
    });

    return res.status(200).json({
      token,
    });
  });

  static signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide correct credentials', 401));
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return next(new AppError('Please provide correct credentials', 401));
    }

    const isPasswordMatched = await user.comparePasswords(password);

    if (!isPasswordMatched) {
      return next(new AppError('Please provide correct credentials', 401));
    }

    // Create a token and save in the httpOnly cookie
    const tokenCreated = await JwtProvider.get(user._id);
    cookieProvider.set({
      res,
      key: COOKIES.TOKEN,
      value: tokenCreated,
    });

    return res.status(201).json({
      token: tokenCreated,
    });
  });

  static signOut = catchAsync(async (req, res, next) => {
    const token = cookieProvider.get({
      req,
      key: COOKIES.TOKEN,
    });

    if (!token) {
      return next(new AppError('Unauthorized', 401));
    }

    // Save in the black list to not have an access of reattempt request
    await tokenBlackListModel.create({ token });
    cookieProvider.delete({
      res,
      key: COOKIES.TOKEN,
    });

    return res.sendStatus(200);
  });
}

module.exports = AuthController;
