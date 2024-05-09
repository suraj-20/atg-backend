const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { createTokenForUser } = require("../services/authentication");

module.exports.handleUserRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createTokenForUser(user);
    console.log("Token in user login : ", token);
    // Generate and send token if login successful
    // (You can use JWT or any other authentication mechanism here)

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 36000000; // Token expres in 1 hours
    console.log("resetTokenExpires", resetTokenExpires);
    await User.findOneAndUpdate(
      { email },
      { resetToken: resetToken, resetTokenExpires }
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "kumarsuraj54057@gmail.com",
        pass: "spww nxcq duao eqzs",
      },
    });

    const mailOptions = {
      from: "kumarsuraj54057@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Click <a href="${process.env.REACT_APP_BASE_URL}/api/v1/reset-password/${resetToken}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send reset email" });
      } else {
        console.log("Email sent:" + info.response);
        res.json({ message: "Password reset email sent successfully" });
      }
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

module.exports.handleResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully", user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
