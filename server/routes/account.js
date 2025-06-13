import express from 'express';
import bcrypt from 'bcryptjs';

import { protect } from '../middleware/auth.js';
import { emailRegex, unameRegex, passwordRegex } from '../shared/regex.js';
import { prisma } from '../utils/index.js';

const router = express.Router();

/**
 * API Routes
 *
 * @route GET /api/v1/account
 * @access public
 *
 * @returns {object} - API information
 */
router.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the Account API',
		endpoints: [
			{
				method: 'GET',
				path: '/api/v1/account/me',
				description: 'Get logged-in user info',
			},
			{
				method: 'PUT',
				path: '/api/v1/account/me',
				description: 'Update logged-in user info',
			},
			{
				method: 'PUT',
				path: '/api/v1/account/change-password',
				description: 'Change user password',
			},
			{
				method: 'DELETE',
				path: '/api/v1/account/:id',
				description: 'Delete user account',
			},
		],
	});
});

/**
 * Get logged-in user information
 *
 * @route GET /api/v1/account/me
 * @access private
 *
 * @returns {object} - User information
 */
router.get('/me', protect, async (req, res) => {
	// Get user data from the request
	const user = req.user;

	try {
		// Find the user in the database
		const userData = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!userData) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Get total monitors for the user
		const totalMonitors = await prisma.monitor.count({
			where: {
				userId: user.id,
			},
		});

		res.json({
			message: 'User authenticated',
			user: {
				id: userData.id,
				username: userData.username,
				email: userData.email,
				totalMonitors,
				monitorLimit: userData.monitorLimit,
				statusPageLimit: userData.statusPageLimit,
			},
		});
	} catch (error) {
		console.error('Error fetching user data:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

/**
 * Update logged-in user information
 *
 * @route PUT /api/v1/account/me
 * @access private
 *
 * @param {string} username - User's new username
 * @param {string} email    - User's new email
 *
 * @returns {object} - Updated user information
 */
router.put('/me', protect, async (req, res) => {
	// Check that the body is provided
	if (!req.body) {
		return res.status(400).json({ message: 'Body is required' });
	}

	const { username, email } = req.body;

	// Validate input
	if (!username || !email) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	// Check if username is valid
	if (!unameRegex.pattern.test(username)) {
		return res.status(400).json({ message: unameRegex.err });
	}

	// Check if email is valid
	if (!emailRegex.pattern.test(email)) {
		return res.status(400).json({ message: emailRegex.err });
	}

	// Check if email is already in use
	const emailExists = await prisma.user.findUnique({
		where: { email },
	});

	if (emailExists && emailExists.id !== req.user.id) {
		return res.status(400).json({ message: 'Email already in use' });
	}

	// Check if username is already in use
	const usernameExists = await prisma.user.findUnique({
		where: { username },
	});

	if (usernameExists && usernameExists.id !== req.user.id) {
		return res.status(400).json({ message: 'Username already in use' });
	}

	// Check if both the new email and username are the same as the existing ones
	const existingUser = await prisma.user.findUnique({
		where: { id: req.user.id },
	});

	if (existingUser.email === email && existingUser.username === username) {
		return res.status(400).json({ message: 'No changes detected' });
	}

	try {
		// Update user information in the database
		const updatedUser = await prisma.user.update({
			where: { id: req.user.id },
			data: { username, email },
		});

		res.json({ message: 'User information updated', user: updatedUser });
	} catch (error) {
		console.error('Error updating user information:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

/**
 * Change user password
 *
 * @route PATCH /api/v1/account/change-password
 * @access private
 *
 * @param {string} currentPassword - User's current password
 * @param {string} newPassword     - User's new password
 *
 * @returns {object} - Success message or error
 */
router.put('/change-password', protect, async (req, res) => {
	// Check that the body is provided
	if (!req.body) {
		return res.status(400).json({ message: 'Body is required' });
	}

	const { currentPassword, newPassword } = req.body;

	// Validate input
	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	// Check if new password is valid
	if (!passwordRegex.pattern.test(newPassword)) {
		return res.status(400).json({ message: passwordRegex.err });
	}

	try {
		// Verify current password
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
		});

		const isCurrentPasswordValid = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (!isCurrentPasswordValid) {
			return res.status(400).json({ message: 'Current password is incorrect' });
		}

		// Check if the new password is the same as the current one
		const isSame = await bcrypt.compare(newPassword, user.password);

		if (isSame) {
			return res.status(400).json({
				message: 'New password cannot be the same as the current password',
			});
		}

		// Hash the new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// Update password
		await prisma.user.update({
			where: { id: req.user.id },
			data: { password: hashedNewPassword },
		});

		res.json({ message: 'Password updated successfully' });
	} catch (error) {
		console.error('Error changing password:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

/**
 * Delete user account
 *
 * @route DELETE /api/v1/account/:id
 * @access private
 *
 * @param {string} id - User ID
 *
 * @returns {object} - Deletion status
 */
router.delete('/:id', protect, async (req, res) => {
	const { id } = req.params;

	try {
		// Check if the user exists
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the user is trying to delete their own account
		if (user.id !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		// Delete all status page monitors associated with the user
		await prisma.statusPageMonitor.deleteMany({
			where: { monitor: { userId: id } },
		});

		// Delete all heartbeats associated with the user
		await prisma.heartbeat.deleteMany({
			where: { monitor: { userId: id } },
		});

		// Delete all monitors associated with the user
		await prisma.monitor.deleteMany({
			where: { userId: id },
		});

		// Delete all status pages associated with the user
		await prisma.statusPage.deleteMany({
			where: { userId: id },
		});

		// Delete the user account
		await prisma.user.delete({
			where: { id },
		});

		res.json({ message: 'User account deleted successfully' });
	} catch (error) {
		console.error('Error deleting user account:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

export default router;
