import jwt from 'jsonwebtoken';

/**
 *
 * @param req
 * @param res
 * @param next
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
