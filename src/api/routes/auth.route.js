const { Router } = require('express');
const { signIn, signUp, signOut } = require('../../controller/auth.controller');
const { verify } = require('../middlewares/auth.middleware');

const authRouter = Router();

authRouter
  .post('/signUp', signUp)
  .post('/signIn', signIn)
  .post('/signOut', verify, signOut);

module.exports = authRouter;
