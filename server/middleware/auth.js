import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes by verifying JWT token.
 *
 * @param {object}   req  - The request object.
 * @param {object}   res  - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {void}
 */
export const protect = (req, res, next) => {
	// Get token from HTTP-only cookie (not from header)
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // { id: 'uuid-etc' }
		next();
	} catch (err) {
		res.status(401).json({ message: 'Not authorized, token failed' });
	}
};
