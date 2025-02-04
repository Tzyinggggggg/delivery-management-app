/** @format */
/**
 * @file package_routes.js
 * @module packageRoutes
 * @description Express router for handling package-related web pages and actions.
 */

const express = require("express");
const router = express.Router();
const packageController = require("../controllers/package_controller");

/**
 * @route GET /add_package
 * @description Renders the page for adding a new package
 * @access Public
 */
router.get("/add_package", packageController.getAddPackagePage);
/**
 * @route POST /add_package_post
 * @description Handles the form submission for adding a new package
 * @access Public
 */
router.post("/add_package_post", packageController.addPackage);
/**
 * @route GET /
 * @description Lists all packages
 * @access Public
 */
router.get("/", packageController.listPackages);
/**
 * @route GET /delete_package
 * @description Renders the page for deleting packages
 * @access Public
 */
router.get("/delete_package", packageController.getDeletePackagePage);
/**
 * @route GET /delete_package_form
 * @description Handles the deletion of a package
 * @access Public
 */
router.get("/delete_package_form", packageController.deletePackage);

module.exports = router;
