const { NODE_ENV, BASE_TIME_EXPIRES } = process.env;

class CookieProvider {
  static get({ req, key }) {
    return req.cookies[key];
  }

  static set({ res, key, value }) {
    res.cookie(key, value, {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: Number(BASE_TIME_EXPIRES),
    });
  }

  static delete({ res, key }) {
    res.clearCookie(key);
  }
}

module.exports = CookieProvider;
