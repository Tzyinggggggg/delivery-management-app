/** @format */

const mongoose = require("mongoose");

/**
 * Mongoose schema for Package.
 * @typedef {Object} PackageSchema
 * @property {string} package_id - Unique identifier for the package.
 * @property {string} package_title - Title of the package (3-15 characters).
 * @property {number} package_weight - Weight of the package (greater than 0).
 * @property {string} package_destination - Destination of the package (5-15 characters).
 * @property {string} [description] - Optional description of the package (0-30 characters).
 * @property {boolean} isAllocated - Indicates if the package is allocated to a driver.
 * @property {mongoose.Types.ObjectId} driver_id - ID of the assigned driver.
 * @property {Date} createdAt - Timestamp of when the package was created.
 */
const packageSchema = new mongoose.Schema({
  package_id: {
    type: String,
    unique: true,
    default: function () {
      return generatePackageId();
    },
  },
  package_title: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 15;
      },
      message: (props) =>
        `${props.value} is not a valid title. Title cannot be empty.`,
    },
  },
  package_weight: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: (props) =>
        `${props.value} is not a valid weight. Weight must be greater than 0.`,
    },
  },
  package_destination: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 5 && v.length <= 15;
      },
      message: (props) =>
        `${props.value} is not a valid package destination.Package destination length should between 5 and 15 inclusive.`,
    },
  },
  description: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length >= 0 && v.length <= 30;
      },
      message: (props) =>
        `Description length should between 0 to 30 inclusive.`,
    },
  },
  isAllocated: {
    type: Boolean,
    required: true,
    default: false,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Generates a unique package ID.
 * @returns {string} A unique package ID in the format 'PXX-TS-xxx' where X is an uppercase letter and x is a digit.
 * @private
 */
function generatePackageId() {
  // Generate two random digits
  // math.random generate floating point 0 - 1
  // * 90 will make it 0.0000 - 89.xxxx
  // floor will make it just 2 digits
  // adding 10 10 - 99
  const randomDigits = Math.floor(Math.random() * 900) + 100; // Ensures two digits

  // Generate three random uppercase letters
  // create an empty array with 3 slots
  // fill with undefined
  // map iterate over each of the element then apply random char to it
  // 65 is the ASCII code of 'A',we have 25 letters
  // take the array of characters then join them into a string
  const randomLetters = Array(2)
    .fill()
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");

  return `P${randomLetters}-TS-${randomDigits}`;
}

/**
 * Mongoose model for Package.
 * @type {mongoose.Model<PackageSchema>}
 */
module.exports = mongoose.model("Package", packageSchema);
