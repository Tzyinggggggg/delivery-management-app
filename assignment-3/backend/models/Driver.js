/** @format */

const mongoose = require("mongoose");

/**
 * Mongoose schema for Driver.
 * @typedef {Object} DriverSchema
 * @property {string} driver_id - Unique identifier for the driver.
 * @property {string} driver_name - Name of the driver (3-20 characters).
 * @property {('Food'|'Furniture'|'Electronic'|'food'|'furniture'|'electronic')} driver_department - Department of the driver.
 * @property {string} driver_licence - Driver's license (5 characters).
 * @property {boolean} driver_isActive - Indicates if the driver is active.
 * @property {Date} driver_createdAt - Timestamp of when the driver was created.
 * @property {mongoose.Types.ObjectId[]} assigned_packages - Array of Package IDs assigned to the driver.
 */
const driverSchema = new mongoose.Schema({
	driver_id: {
		type: String,
		unique: true,
		default: function () {
			return generateDriverId();
		},
	},
	driver_name: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return v.length >= 3 && v.length <= 20;
			},
			message: (props) =>
				`${props.value} is not a valid name. Name cannot be empty.`,
		},
	},
	driver_department: {
		type: String,
		required: true,
		enum: [
			"Food",
			"Furniture",
			"Electronic",
			"food",
			"furniture",
			"electronic",
		],
		validate: {
			validator: function (v) {
				return ["food", "furniture", "electronic"].includes(v);
			},
			message: (props) =>
				`${props.value} is not a valid department. Must be food, furniture, or electronic.`,
		},
	},
	driver_licence: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return v.length == 5;
			},
			message: (props) =>
				`${props.value} is not a valid driver licence.Driver licence must be in length of 5.`,
		},
	},
	driver_isActive: {
		type: Boolean,
		required: true,
	},
	driver_createdAt: {
		type: Date,
		default: Date.now,
	},
	assigned_packages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Package",
		},
	],
});

/**
 * Generates a unique driver ID.
 * @returns {string} A unique driver ID in the format 'Dxx-32-XXX' where x is a digit and X is an uppercase letter.
 * @private
 */
function generateDriverId() {
	// Generate two random digits
	// math.random generate floating point 0 - 1
	// * 90 will make it 0.0000 - 89.xxxx
	// floor will make it just 2 digits
	// adding 10 10 - 99
	const randomDigits = Math.floor(Math.random() * 90) + 10; // Ensures two digits

	// Generate three random uppercase letters
	// create an empty array with 3 slots
	// fill with undefined
	// map iterate over each of the element then apply random char to it
	// 65 is the ASCII code of 'A',we have 25 letters
	// take the array of characters then join them into a string
	const randomLetters = Array(3)
		.fill()
		.map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
		.join("");

	return `D${randomDigits}-32-${randomLetters}`;
}

/**
 * Mongoose model for Driver.
 * @type {mongoose.Model<DriverSchema>}
 */
module.exports = mongoose.model("Driver", driverSchema);
