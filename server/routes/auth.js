import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { protect } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/; // Alphanumeric and underscores, at least 3 characters

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format' });
  }

  // Check if password is strong
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &)' });
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

// Login route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  // Check if all fields are provided
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if identifier is an email or username
  const isEmail = emailRegex.test(identifier);
  const isUsername = usernameRegex.test(identifier);

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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Dynamically set based on environment
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ success: true });
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    // secure: true, // Only set if using HTTPS
    sameSite: 'Strict'
  });
  res.json({ message: 'Logged out' });
});

// Protected me route
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


export default router;
