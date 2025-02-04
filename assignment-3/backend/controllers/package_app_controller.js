/** @format */

const Driver = require("../models/Driver");
const Package = require("../models/Package");
const admin = require("firebase-admin");
const db = admin.firestore();
const statsRef = db.collection("operation_data").doc("crud_counts");

/**
 * Package controller module.
 * @module packageAppController
 */
module.exports = {
	/**
	 * Create a new package and assign it to a driver.
	 * @async
	 * @function createPackage
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - The request body containing package information
	 * @param {string} req.body.package_title - The title of the package
	 * @param {number} req.body.package_weight - The weight of the package
	 * @param {string} req.body.package_destination - The destination of the package
	 * @param {string} req.body.description - The description of the package
	 * @param {boolean} req.body.isAllocated - Whether the package is allocated
	 * @param {string} req.body.driver_id - The ID of the driver to assign the package to
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	createPackage: async function (req, res) {
		try {
			console.log("Received request body:", req.body);

			const aPackage = req.body;
			const aDriver = await Driver.findById(aPackage.driver_id);
			if (!aDriver) {
				return res.status(404).send("Driver not found");
			}
			const newPackage = new Package({
				package_title: aPackage.package_title,
				package_weight: aPackage.package_weight,
				package_destination: aPackage.package_destination,
				description: aPackage.description,
				isAllocated: aPackage.isAllocated,
				driver_id: aDriver._id,
			});

			const savedPackage = await newPackage.save();
			aDriver.assigned_packages.push(newPackage._id);
			await aDriver.save();
			await statsRef.update({
				insert: admin.firestore.FieldValue.increment(1),
			});
			res.status(201).json({
				id: savedPackage._id,
				package_id: savedPackage.package_id,
			});
		} catch (error) {
			console.error("Error creating package:", error);
			res
				.status(500)
				.json({ error: "An error occurred while creating the package" });
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
			res.status(200).json(packages);
			await statsRef.update({
				retrieve: admin.firestore.FieldValue.increment(1),
			});
		} catch (error) {
			console.error("Error fetching packages:", error);
			res
				.status(500)
				.json({ error: "An error occurred while fetching packages" });
		}
	},

	/**
	 * Remove a package by ID and update the associated driver.
	 * @async
	 * @function removePackageById
	 * @param {Object} req - Express request object
	 * @param {Object} req.query - The query parameters
	 * @param {string} req.query.package_id - The ID of the package to remove
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	removePackageById: async function (req, res) {
		try {
			const packageId = req.query.package_id;
			console.log(packageId);

			// Find the package by ID
			const packageToDelete = await Package.findById(packageId);
			if (!packageToDelete) {
				return res
					.status(404)
					.json({ status: "Package not found", deletedCount: 0 });
			}

			// Find the driver assigned to the package
			const driver = await Driver.findById(packageToDelete.driver_id);
			if (driver) {
				// Remove the package reference from the driver's assigned_packages array
				driver.assigned_packages = driver.assigned_packages.filter(
					(pkgId) => pkgId.toString() !== packageId
				);
				await driver.save(); // Save the updated driver document
			}

			// Delete the package from the Package collection
			await Package.deleteOne({ _id: packageId });

			res.status(200).json({
				acknowledged: true,
				deletedCount: 1,
			});
			await statsRef.update({
				delete: admin.firestore.FieldValue.increment(1),
			});
		} catch (error) {
			console.error("Error deleting driver:", error);
			res.status(500).json({
				error: "An error occurred while deleting the driver",
				deletedCount: 0,
			});
		}
	},

	/**
	 * Update a package's information.
	 * @async
	 * @function updatePackage
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - The request body containing updated package information
	 * @param {string} req.body.package_id - The ID of the package to update
	 * @param {string} req.body.package_destination - The updated destination of the package
	 * @param {Object} res - Express response object
	 * @returns {Promise<void>}
	 */
	updatePackage: async function (req, res) {
		try {
			let packageId = req.body.package_id;
			console.log(packageId);

			// Find the patient by ID
			let aPackage = await Package.findById(packageId);
			if (!aPackage) {
				return res.status(404).send("Package not found");
			}

			// Log the current patient name
			console.log("Current name:", aPackage.name);

			aPackage.package_destination = req.body.package_destination;

			await aPackage.save();

			await statsRef.update({
				update: admin.firestore.FieldValue.increment(1),
			});

			res.status(200).json({ status: "updated successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	},
};
