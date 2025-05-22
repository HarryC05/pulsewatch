import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import accountRoutes from './routes/account.js';
import authRoutes from './routes/auth.js';
import monitorRoutes from './routes/monitor.js';
import pageRoutes from './routes/page.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(
	cors({
		origin: 'http://localhost:5173', // frontend URL
		credentials: true,
	})
);

app.use(cookieParser());

// Account routes
app.use('/api/v1/account', accountRoutes);

// Authentication routes
app.use('/api/v1/auth', authRoutes);

// Monitor routes
app.use('/api/v1/monitor', monitorRoutes);

// Page routes
app.use('/api/v1/page', pageRoutes);

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
			{
				method: 'POST',
				path: '/api/v1/monitor/create',
				description: 'Create a new monitor',
			},
			{
				method: 'GET',
				path: '/api/v1/monitor/list',
				description: 'Get all monitors for the logged-in user',
			},
			{
				method: 'GET',
				path: '/api/v1/monitor/:id',
				description: 'Get a specific monitor by ID',
			},
			{
				method: 'PUT',
				path: '/api/v1/monitor/:id',
				description: 'Update a monitor',
			},
			{
				method: 'DELETE',
				path: '/api/v1/monitor/:id',
				description: 'Delete a monitor',
			},
			{
				method: 'POST',
				path: '/api/v1/page/create',
				description: 'Create a new status page',
			},
			{
				method: 'GET',
				path: '/api/v1/page/list',
				description: 'Get all status pages for the logged-in user',
			},
			{
				method: 'GET',
				path: '/api/v1/page/:identifier',
				description: 'Get a specific status page by slug or ID',
			},
			{
				method: 'PUT',
				path: '/api/v1/page/:id',
				description: 'Update a status page',
			},
			{
				method: 'DELETE',
				path: '/api/v1/page/:id',
				description: 'Delete a status page',
			},
		],
	});
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
