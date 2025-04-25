import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

app.use(cookieParser());

// Authentication routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('PulseWatch API Running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
