/** @format */

/**
 * Express router for authentication routes (app version).
 * @module routers/authAppRouter
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_app_controller");

/**
 * POST /login
 * Handle user login for the app.
 */
router.post("/login", authController.login);

/**
 * POST /signup
 * Handle user signup for the app.
 */
router.post("/signup", authController.signup);

module.exports = router;
