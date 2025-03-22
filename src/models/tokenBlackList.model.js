const mongoose = require('mongoose');

const { BASE_TIME_EXPIRES } = process.env;

const tokenBlackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      expires: Number(BASE_TIME_EXPIRES) / 1000, // Converted to the seconds
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('TokenBlackList', tokenBlackListSchema);
