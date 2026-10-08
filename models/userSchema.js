// import mongoose and bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// make user with username, email, password
const userSchema = new mongoose.Schema({
  username: {
  type: String,
  required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must use a vaild email address"],
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function () {
  if(!this.isModified('password')) {
    return;
  }

  const saltRounds = 10;

  this.password = await bcrypt.hash(this.password, saltRounds);
});

// PASSWORD CHECKER
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;