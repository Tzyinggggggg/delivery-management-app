/** @format */

const Package = require("../models/Package");
const Driver = require("../models/Driver");
const admin = require("firebase-admin");
const db = admin.firestore();
const statsRef = db.collection("operation_data").doc("crud_counts");

/**
 * Extended Package controller module.
 * @module packageController
 */
module.exports = {
	/**
	 * Render the add package page with available drivers.
	 * @async
	 * @function getAddPackagePage
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	getAddPackagePage: async function (req, res) {
		const drivers = await Driver.find({});

		await statsRef.update({
			retrieve: admin.firestore.FieldValue.increment(1),
		});

		res.render("add_package", { drivers: drivers });
	},

	/**
	 * Add a new package and associate it with a driver.
	 * @async
	 * @function addPackage
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - The request body containing package information
	 * @param {string} req.body.package_title - The title of the package
	 * @param {number} req.body.package_weight - The weight of the package
	 * @param {string} req.body.package_destination - The destination of the package
	 * @param {string} req.body.description - The description of the package
	 * @param {string} req.body.isAllocated - Whether the package is allocated ("on" if checked)
	 * @param {string} req.body.driver_id - The ID of the driver to assign the package to
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	addPackage: async function (req, res) {
		try {
			// Find the driver by the ID select by the user
			const driver = await Driver.findOne({ driver_id: req.body.driver_id });

			let newPackage = new Package({
				package_title: req.body.package_title,
				package_weight: req.body.package_weight,
				package_destination: req.body.package_destination,
				description: req.body.description,
				isAllocated: req.body.isAllocated === "on",
				driver_id: driver._id,
			});
			await newPackage.save();
			// Update the driver's assigned_packages array
			driver.assigned_packages.push(newPackage._id);
			await driver.save();

			await statsRef.update({
				insert: admin.firestore.FieldValue.increment(1),
			});

			res.redirect("/32758324/tzeying/packages");
		} catch (err) {
			console.error("Error adding package:", err);
			res.render("invalid_data");
		}
	},

	/**
	 * List all packages with populated driver information.
	 * @async
	 * @function listPackages
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	listPackages: async function (req, res) {
		try {
			const packages = await Package.find({}).populate("driver_id");

			await statsRef.update({
				retrieve: admin.firestore.FieldValue.increment(1),
			});

			res.render("list_packages", { packages: packages });
		} catch (err) {
			console.error("Error listing packages", err);
			res.render("invalid_data");
		}
	},

	/**
	 * Render the delete package page.
	 * @async
	 * @function getDeletePackagePage
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	getDeletePackagePage: async function (req, res) {
		res.render("delete_package");
	},

	/**
	 * Delete a package by ID and update the associated driver.
	 * @async
	 * @function deletePackage
	 * @param {Object} req - Express request object
	 * @param {Object} req.query - The query parameters
	 * @param {string} req.query.package_id - The ID of the package to delete
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	deletePackage: async function (req, res) {
		const packageId = req.query.package_id;
		try {
			// Find the package to get the driver_id
			const packageToDelete = await Package.findOne({ package_id: packageId });

			if (!packageToDelete) {
				res.render("invalid_data");
				return;
			}

			const driverId = packageToDelete.driver_id;

			// Remove the package from the assigned_packages array in the driver
			if (driverId) {
				await Driver.updateOne(
					{ _id: driverId },
					{ $pull: { assigned_packages: packageToDelete._id } }
				);
			}

			// Delete the package
			const result = await Package.deleteOne({ package_id: packageId });

			if (result.deletedCount > 0) {
				await statsRef.update({
					delete: admin.firestore.FieldValue.increment(1),
				});
				res.redirect("/32758324/tzeying/packages");
			} else {
				res.render("invalid_data");
			}
		} catch (err) {
			console.error("Error deleting package:", err);
			res.render("invalid_data");
		}
	},
};
