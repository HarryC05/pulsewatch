import express from 'express';

import { protect } from '../middleware/auth.js';
import { emailRegex, emailRegexError, usernameRegex, usernameRegexError } from '../utils/regex.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

// API Routes
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Account API',
    endpoints: [
      { method: 'GET', path: '/api/v1/account/me', description: 'Get logged-in user info' },
      { method: 'PUT', path: '/api/v1/account/me', description: 'Update logged-in user info' },
    ],
  });
});

// Get user account information
router.get('/me', protect, (req, res) => {
  // Get user data from the request
  const user = req.user;
  // Find the user in the database
  prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User authenticated', user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      } });
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Update user account information
router.put('/me', protect, async (req, res) => {
  const { username, email } = req.body;

  // Validate input
  if (!username || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if username is valid
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: usernameRegexError });
  }

  // Check if email is valid
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: emailRegexError });
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

export default router;