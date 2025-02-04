/** @format */
/**
 * @file package_app_routes.js
 * @module packageAppRoutes
 * @description Express router for handling package-related API endpoints.
 */

const express = require("express");
/** @type {ExpressRouter} */
const router = express.Router();
const packageController = require("../controllers/package_app_controller");

/**
 * @route POST /add
 * @description Create a new package
 * @access Public
 */
router.post("/add", packageController.createPackage);

/**
 * @route GET /
 * @description List all packages
 * @access Public
 */
router.get("/", packageController.listPackages);

/**
 * @route DELETE /delete_packages
 * @description Remove a package by its ID
 * @access Public
 */
router.delete("/delete_packages", packageController.removePackageById);

/**
 * @route PUT /update_packages
 * @description Update a package's information
 * @access Public
 */
router.put("/update_packages", packageController.updatePackage);

module.exports = router;
