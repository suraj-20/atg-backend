// const { randomBytes, createHmac } = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name Should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password Should Contain minimun 8 characters"],
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: Date,
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
