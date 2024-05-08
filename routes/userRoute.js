const express = require("express");
const {
  handleUserRegister,
  handleUserLogin,
  handleForgotPassword,
  handleResetPassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", handleUserRegister);
router.post("/login", handleUserLogin);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);

module.exports = router;
