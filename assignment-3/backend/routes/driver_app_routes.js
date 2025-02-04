/** @format */

/**
 * @file driver_app_routes.js
 * @module driverAppRoutes
 * @description Express router for handling driver-related API endpoints.
 */

const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver_app_controller");

/**
 * @route POST /add
 * @description Create a new driver
 * @access Public
 */
router.post("/add", driverController.createDriver);

/**
 * @route GET /
 * @description List all drivers
 * @access Public
 */
router.get("/", driverController.listDrivers);

/**
 * @route DELETE /delete_driver
 * @description Delete a driver by ID
 * @access Public
 */
router.delete("/delete_driver", driverController.deleteDriverById);

/**
 * @route PUT /update_driver
 * @description Update a driver's information
 * @access Public
 */
router.put("/update_driver", driverController.updatedriver);

module.exports = router;
