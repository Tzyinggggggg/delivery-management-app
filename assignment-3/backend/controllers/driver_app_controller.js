/** @format */

const Driver = require("../models/Driver");
const Package = require("../models/Package");
const admin = require("firebase-admin");
const db = admin.firestore();
const statsRef = db.collection("operation_data").doc("crud_counts");

/**
 * Driver controller module.
 * @module driverAppController
 */
module.exports = {
  /**
   * Create a new driver.
   * @async
   * @function createDriver
   * @param {Object} req - Express request object
   * @param {Object} req.body - The request body containing driver information
   * @param {string} req.body.driver_name - The name of the driver
   * @param {string} req.body.driver_department - The department of the driver
   * @param {string} req.body.driver_licence - The licence number of the driver
   * @param {boolean} req.body.driver_isActive - The active status of the driver
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  createDriver: async function (req, res) {
    try {
      console.log("Received request body:", req.body); // Add this line for debugging

      const {
        driver_name,
        driver_department,
        driver_licence,
        driver_isActive,
      } = req.body;

      const newDriver = new Driver({
        driver_name,
        driver_department,
        driver_licence,
        driver_isActive,
      });

      const savedDriver = await newDriver.save();
      res.status(201).json({
        id: savedDriver._id,
        driver_id: savedDriver.driver_id,
      });
      await statsRef.update({
        insert: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error("Error creating driver:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the driver" });
    }
  },

  /**
   * List all drivers.
   * @async
   * @function listDrivers
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  listDrivers: async function (req, res) {
    try {
      const drivers = await Driver.find().populate("assigned_packages");
      res.status(200).json(drivers);
      await statsRef.update({
        retrieve: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching drivers" });
    }
  },

  /**
   * Delete a driver by ID.
   * @async
   * @function deleteDriverById
   * @param {Object} req - Express request object
   * @param {Object} req.query - The query parameters
   * @param {string} req.query.id - The ID of the driver to delete
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  deleteDriverById: async function (req, res) {
    try {
      const id = req.query.id;
      console.log(id);

      const driver = await Driver.findById(id).populate("assigned_packages");
      if (!driver) {
        return res.status(404).json({ status: "ID not found" });
      }

      await Package.deleteMany({ _id: { $in: driver.assigned_packages } });

      const result = await Driver.deleteOne({ _id: id });

      res.status(200).json({
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount,
      });
      await statsRef.update({
        delete: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({
        error: "An error occurred while deleting the driver",
        deletedCount: "0",
      });
    }
  },

  /**
   * Update a driver's information.
   * @async
   * @function updatedriver
   * @param {Object} req - Express request object
   * @param {Object} req.body - The request body containing updated driver information
   * @param {string} req.body.driverId - The ID of the driver to update
   * @param {string} req.body.driver_licence - The updated licence number of the driver
   * @param {string} req.body.driver_department - The updated department of the driver
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  updatedriver: async function (req, res) {
    try {
      let { driverId, driver_licence, driver_department } = req.body;

      // Validate driver ID existence
      let theDriver = await Driver.findById(driverId);
      if (!theDriver) {
        return res.status(404).send("Driver not found");
      }

      // Validate driver licence (alphanumeric, length of 5)
      if (!/^[a-zA-Z0-9]{5}$/.test(driver_licence)) {
        return res.status(400).send("Invalid driver licence");
      }

      // Validate driver department
      const validDepartments = ["food", "furniture", "electronic"];
      if (!validDepartments.includes(driver_department)) {
        return res.status(400).send("Invalid driver department");
      }

      // Update the driver details
      theDriver.driver_licence = driver_licence;
      theDriver.driver_department = driver_department;
      await theDriver.save();

      // Respond with success
      return res.status(200).json({ message: "Driver updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  },
};
