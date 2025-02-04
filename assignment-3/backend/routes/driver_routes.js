/** @format */

/**
 * @file driver_routes.js
 * @module driverRoutes
 * @description Express router for handling driver-related web pages and actions.
 */


const express = require("express");
/** @type {ExpressRouter} */
const router = express.Router();
const driverController = require("../controllers/driver_controller");

/**
 * @route GET /add_driver
 * @description Renders the page for adding a new driver
 * @access Public
 */
router.get("/add_driver", driverController.getAddDriverPage);

/**
 * @route POST /add_driver_post
 * @description Handles the form submission for adding a new driver
 * @access Public
 */
router.post("/add_driver_post", driverController.addDriver);

/**
 * @route GET /delete_drivers
 * @description Renders the page for deleting drivers
 * @access Public
 */
router.get("/delete_drivers", driverController.getDeleteDriversPage);

/**
 * @route GET /delete_drivers_form
 * @description Handles the deletion of a driver
 * @access Public
 */
router.get("/delete_drivers_form", driverController.deleteDriver);

/**
 * @route GET /
 * @description Lists all drivers
 * @access Public
 */
router.get("/", driverController.listDrivers);

/**
 * @route GET /department
 * @description Renders the department selection page
 * @access Public
 */
router.get("/department", driverController.getDepartmentPage);

/**
 * @route GET /list_drivers_department
 * @description Lists drivers filtered by department
 * @access Public
 */
router.get(
	"/list_drivers_department",
	driverController.listDriversByDepartment
);

module.exports = router;
