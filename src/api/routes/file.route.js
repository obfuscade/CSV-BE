const { Router } = require('express');
const { upload, getData } = require('../../controller/file.controller');
const { verify } = require('../middlewares/auth.middleware');
const { MULTER_OPTIONS } = require('../../constants');

const fileRouter = Router();

fileRouter
  .get('/', verify, getData)
  .post('/', [verify, MULTER_OPTIONS.single('file')], upload);

module.exports = fileRouter;
