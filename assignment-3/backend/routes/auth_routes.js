/** @format */

/**
 * Express router for authentication routes (web version).
 * @module routers/authRouter
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

/**
 * POST /login
 * Handle user login for the web interface.
 */
router.post("/login", authController.login);

/**
 * GET /login
 * Render the login page.
 */
router.get("/login", authController.loginPage);

/**
 * GET /signup
 * Render the signup page.
 */
router.get("/signup", authController.signUpPage);

/**
 * POST /signup
 * Handle user signup for the web interface.
 */
router.post("/signup", authController.signup);

module.exports = router;
