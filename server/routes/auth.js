import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { protect } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
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
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

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

// Protected me route
router.get('/me', protect, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
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


export default router;
