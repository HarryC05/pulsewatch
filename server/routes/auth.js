import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { protect } from '../middleware/auth.js';
import { unameRegex, emailRegex, passwordRegex } from '../../shared/regex.js';
import { prisma } from '../utils/index.js';

const router = express.Router();

/**
 * API Routes
 *
 * @route GET /api/v1/auth
 * @access public
 *
 * @returns {object} - API information
 */
router.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the Authentication API',
		endpoints: [
			{
				method: 'POST',
				path: '/api/v1/auth/signup',
				description: 'Register a new user',
			},
			{
				method: 'POST',
				path: '/api/v1/auth/login',
				description: 'Authenticate a user',
			},
			{
				method: 'POST',
				path: '/api/v1/auth/logout',
				description: 'Logout a user',
			},
		],
	});
});

/**
 * Register a new user
 *
 * @route POST /api/v1/auth/signup
 * @access public
 *
 * @param {string} username - User's username
 * @param {string} email    - User's email
 *
 * @returns {object} - User registration status
 */
router.post('/signup', async (req, res) => {
	// Check that the body is provided
	if (!req.body) {
		return res.status(400).json({ message: 'Body is required' });
	}

	const { username, email, password } = req.body;

	// Check if all fields are provided
	if (!username || !email || !password) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	if (!emailRegex.pattern.test(email)) {
		return res.status(400).json({ message: emailRegex.err });
	}

	if (!unameRegex.pattern.test(username)) {
		return res.status(400).json({ message: unameRegex.err });
	}

	// Check if password is strong
	if (!passwordRegex.pattern.test(password)) {
		return res.status(400).json({ message: passwordRegex.err });
	}

	// Check if email already exists
	const emailExists = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (emailExists) {
		return res.status(400).json({ message: 'Email already exists' });
	}

	// Check if username already exists
	const usernameExists = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (usernameExists) {
		return res.status(400).json({ message: 'Username already exists' });
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		res.status(201).json({ message: 'User created' });
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

/**
 * Login user
 *
 * @route POST /api/v1/auth/login
 * @access public
 *
 * @param {string} identifier - User's email or username
 * @param {string} password   - User's password
 *
 * @returns {object} - User login status
 */
router.post('/login', async (req, res) => {
	// Check that the body is provided
	if (!req.body) {
		return res.status(400).json({ message: 'Body is required' });
	}

	const { identifier, password } = req.body;

	// Check if all fields are provided
	if (!identifier || !password) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	// Check if identifier is an email or username
	const isEmail = emailRegex.pattern.test(identifier);
	const isUsername = unameRegex.pattern.test(identifier);

	if (!isEmail && !isUsername) {
		return res.status(400).json({ message: 'Invalid username or email' });
	}

	// Find user by email or username
	let user;

	if (isEmail) {
		user = await prisma.user.findUnique({
			where: {
				email: identifier,
			},
		});
	} else if (isUsername) {
		user = await prisma.user.findUnique({
			where: {
				username: identifier,
			},
		});
	}

	if (!user) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production', // Dynamically set based on environment
		sameSite: 'Lax',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.json({ success: true });
});

/**
 * Logout user
 *
 * @route POST /api/v1/auth/logout
 * @access private
 *
 * @returns {object} - User logout status
 */
router.post('/logout', protect, (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		// secure: true, // Only set if using HTTPS
		sameSite: 'Strict',
	});
	res.json({ message: 'Logged out' });
});

export default router;
