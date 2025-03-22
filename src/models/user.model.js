const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { PASSWORD_SALT } = process.env;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 50,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Encrypt the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(PASSWORD_SALT));
  }

  next();
});

// Compare the password
userSchema.method('comparePasswords', async function (password) {
  const isMatched = await bcrypt.compare(password, this.password);

  return isMatched;
});

module.exports = mongoose.model('User', userSchema);
