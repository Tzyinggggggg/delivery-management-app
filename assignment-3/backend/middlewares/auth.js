/** @format */

/**
 * Authentication middleware module.
 * @module authMiddleware
 */

/**
 * Middleware to check if the user is authenticated for web routes.
 * If authenticated, it sets cache control headers to prevent caching of authenticated pages.
 * If not authenticated, it renders the login page.
 *
 * @function isAuthenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.isAuthenticated = (req, res, next) => {
	if (req.session && req.session.username) {
		// prevent browser's back button to cache the previous session which bypass the authentication check
		res.set(
			"Cache-Control",
			"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
		);
		return next();
	}
	res.status(401).render("login");
};

/**
 * Middleware to check if the user is authenticated for API routes.
 * If authenticated, it sets cache control headers to prevent caching of authenticated responses.
 * If not authenticated, it sends a JSON response with an unauthorized message.
 *
 * @function isAppsAuthenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.isAppsAuthenticated = (req, res, next) => {
	if (req.session && req.session.username) {
		res.set(
			"Cache-Control",
			"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
		);
		return next();
	}
	res.status(401).json({ message: "Unauthorized access. Please log in." });
};
