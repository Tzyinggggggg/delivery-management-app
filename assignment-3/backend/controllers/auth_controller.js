/** @format */

/**
 * @file Authentication functions for user signup, login, and page rendering
 * @module authController
 */
const admin = require("firebase-admin");
const db = admin.firestore();
const statsRef = db.collection("operation_data").doc("crud_counts");

/**
 * Handles user signup process
 * @async
 * @function signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.signup = async (req, res) => {
	try {
		const { username, password, confirmPassword } = req.body;

		// Validate input data
		if (password !== confirmPassword) {
			return res.status(400).render("invalid_data");
		}
		console.log();
		if (username.length < 6) {
			return res.status(400).render("invalid_data");
		}

		if (password.length < 5 || password.length > 10) {
			return res.status(400).render("invalid_data");
		}

		const usersSnapshot = await db.collection("user_data");
		console.log(usersSnapshot);
		// Save the new user data in Firestore
		await usersSnapshot.add({
			username,
			password,
		});

		await statsRef.update({
			insert: admin.firestore.FieldValue.increment(1),
		});

		// Redirect to the login page
		res.status(201).redirect("/32758324/tzeying/users/login");
	} catch (error) {
		// Handle errors
		res
			.status(500)
			.json({ message: "Error creating user", error: error.message });
	}
};

/**
 * Handles user login process
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		console.log("Login attempt for username:", username);

		const usersSnapshot = await db.collection("user_data").get();

		let authenticated = false;
		usersSnapshot.forEach((doc) => {
			if (
				doc.data().username === username &&
				doc.data().password === password
			) {
				authenticated = true;
				// Set session variables
				req.session.username = username;
			}
		});

		if (authenticated) {
			await statsRef.update({
				insert: admin.firestore.FieldValue.increment(1),
			});

			return res.redirect("/");
		} else {
			return res.redirect("/32758324/tzeying/users/login");
		}
	} catch (error) {
		console.error("Error logging in: ", error);
		return res.status(500).json({
			success: false,
			message: "Login failed due to error",
			error: error.message,
		});
	}
};

/**
 * Renders the login page
 * @async
 * @function loginPage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.loginPage = async (req, res) => {
	await res.render("login");
};

/**
 * Renders the signup page
 * @async
 * @function signUpPage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.signUpPage = async (req, res) => {
	await res.render("signup");
};
