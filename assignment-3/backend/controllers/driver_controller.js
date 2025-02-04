/** @format */

const Driver = require("../models/Driver");
const Package = require("../models/Package");
const admin = require("firebase-admin");
const db = admin.firestore();
const statsRef = db.collection("operation_data").doc("crud_counts");

/**
 * Driver controller module.
 * @module driverController
 */
module.exports = {
	/**
	 * Render the add driver page.
	 * @async
	 * @function getAddDriverPage
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	getAddDriverPage: async function (req, res) {
		res.render("add_driver");
	},

	/**
	 * Add a new driver to the database.
	 * @async
	 * @function addDriver
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	addDriver: async function (req, res) {
		try {
			let newDriver = new Driver({
				driver_name: req.body.driver_name,
				driver_department: req.body.driver_department,
				driver_licence: req.body.driver_licence,
				driver_isActive: req.body.driver_isActive === "on",
			});
			await newDriver.save();

			await statsRef.update({
				insert: admin.firestore.FieldValue.increment(1),
			});

			res.redirect("/32758324/tzeying/drivers");
		} catch (err) {
			console.error("Error Adding Driver ", err);
			res.status(400).render("invalid_data");
		}
	},

	/**
	 * Render the delete drivers page.
	 * @async
	 * @function getDeleteDriversPage
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	getDeleteDriversPage: async function (req, res) {
		res.render("delete_drivers");
	},

	/**
	 * Delete a driver from the database.
	 * @async
	 * @function deleteDriver
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	deleteDriver: async function (req, res) {
		const driverId = req.query.id;

		try {
			const result = await Driver.deleteOne({ driver_id: driverId });
			if (result.deletedCount > 0) {
				await statsRef.update({
					delete: admin.firestore.FieldValue.increment(1),
				});

				res.redirect("/32758324/tzeying/drivers");
			} else {
				res.render("invalid_data");
			}
		} catch (err) {
			console.error("Error in Deleting Driver", err);
			res.render("invalid_data");
		}
	},

	/**
	 * List all drivers.
	 * @async
	 * @function listDrivers
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	listDrivers: async function (req, res) {
		try {
			let drivers = await Driver.find({});
			res.render("list_drivers", {
				drivers: drivers,
			});

			await statsRef.update({
				retrieve: admin.firestore.FieldValue.increment(1),
			});
		} catch (err) {
			console.error("Error in Listing Driver", err);
			res.render("invalid_data");
		}
	},

	/**
	 * Render the department page.
	 * @async
	 * @function getDepartmentPage
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	getDepartmentPage: async function (req, res) {
		res.render("department");
	},

	/**
	 * List drivers by department.
	 * @async
	 * @function listDriversByDepartment
	 * @param {Object} req - Express request object with Driver attributes
	 * @param {Object} res - Express response object with Driver attributes
	 */
	listDriversByDepartment: async function (req, res) {
		const selectedDepartment = req.query.department;

		try {
			const filteredDrivers = await Driver.find({
				driver_department: selectedDepartment,
			});

			await statsRef.update({
				retrieve: admin.firestore.FieldValue.increment(1),
			});

			res.render("list_drivers", {
				drivers: filteredDrivers,
				title: `Drivers in ${selectedDepartment} Department`,
			});
		} catch (err) {
			console.error("Error listing drivers by department:", err);
			res.render("invalid_data");
		}
	},
};
