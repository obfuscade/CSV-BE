const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const { BASE_TIME_EXPIRES, TOKEN_SECRET } = process.env;

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

class JwtProvider {
  static async get(userId) {
    const tokenCreated = await signAsync({ userId }, TOKEN_SECRET, {
      expiresIn: BASE_TIME_EXPIRES,
    });

    return tokenCreated;
  }

  static async decode(token) {
    const decoded = await verifyAsync(token, TOKEN_SECRET);

    return decoded;
  }
}

module.exports = JwtProvider;
