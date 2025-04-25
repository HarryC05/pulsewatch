import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { v4 as uuidv4 } from 'uuid';

import { protect } from '../middleware/auth.js';


const router = express.Router();

// Fake in-memory DB (for now)
const users = [];

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User created' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

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
    secure: false,      // ✅ must be false for localhost!
    sameSite: 'Lax',     // ✅ needed to allow cross-origin cookies
    path: '/',           // ✅ so it covers the entire site
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
