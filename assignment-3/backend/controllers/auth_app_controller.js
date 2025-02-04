/** @format */
/**
 * @file Authentication functions for user signup and login
 * @module authAppController
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
		const { username, password, confirm_password } = req.body;

		// Validate input data
		if (password !== confirm_password) {
			return res.status(400).json({ message: "Passwords do not match." });
		}

		if (username.length < 6) {
			return res
				.status(400)
				.json({ message: "Username need to has at least 6 characters." });
		}

		if (password.length < 5 || password.length > 10) {
			return res.status(400).json({
				message:
					"Password need to has at least 5 characters and less than 10 characters.",
			});
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
		res
			.status(201)
			.json({ message: "User created successfully", user: username });
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

			res
				.status(200)
				.json({ message: "User login successfully", user: username });
		} else {
			return res.status(401).json({ message: "Invalid username or password" });
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
