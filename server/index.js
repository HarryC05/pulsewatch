import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import accountRoutes from './routes/account.js';
import authRoutes from './routes/auth.js';
import monitorRoutes from './routes/monitor.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

app.use(cookieParser());

// Account routes
app.use('/api/v1/account', accountRoutes);

// Authentication routes
app.use('/api/v1/auth', authRoutes);

// Monitor routes
app.use('/api/v1/monitor', monitorRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to PulseWatch API v1',
    endpoints: [
      { method: 'GET', path: '/api/v1/health', description: 'Health check' },
      { method: 'GET', path: '/api/v1/account/me', description: 'Get logged-in user info' },
      { method: 'POST', path: '/api/v1/auth/login', description: 'Login' },
      { method: 'POST', path: '/api/v1/auth/register', description: 'Register' },
      { method: 'POST', path: '/api/v1/monitor', description: 'Create a monitor' },
      { method: 'GET', path: '/api/v1/monitor/:id', description: 'Get monitor details' },
      { method: 'GET', path: '/api/v1/monitor/list', description: 'Get all monitors for logged-in user' },
    ],
  })
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
