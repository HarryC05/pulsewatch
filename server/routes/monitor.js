import express from 'express';
import { protect } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

// API Routes
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Monitor API',
    endpoints: [
      { method: 'POST', path: '/api/v1/monitor/create', description: 'Create a new monitor' },
      { method: 'GET', path: '/api/v1/monitor/list', description: 'Get all monitors for the logged-in user' },
    ],
  });
});

// Create a monitor
router.post('/create', protect, async (req, res) => {
  const { name, url } = req.body;

  try {
    const newMonitor = await prisma.monitor.create({
      data: {
        userId: req.user.id,
        name,
        url,
      },
    });

    res.json(newMonitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create monitor' });
  }
});

// Get all monitors for the logged-in user
router.get('/list', protect, async (req, res) => {
  try {
    // Get monitors belonging to logged-in user
    const monitors = await prisma.monitor.findMany({
      where: { userId: req.user.id },
      include: {
        heartbeats: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        },
      },
    });

    // Format the response
    const formatted = monitors.map(monitor => {
      const latestHeartbeat = monitor.heartbeats[0];

      const upHeartbeats = monitor.heartbeats.filter(hb => hb.status === 'up').length;
      const totalHeartbeats = monitor.heartbeats.length;

      const uptime = totalHeartbeats > 0
        ? ((upHeartbeats / totalHeartbeats) * 100).toFixed(2)
        : null; // if no heartbeats yet

      return {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        latestStatus: latestHeartbeat?.status || 'unknown',
        latestResponseTime: latestHeartbeat?.responseTime || null,
        lastChecked: latestHeartbeat?.createdAt || null,
        uptime,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monitors' });
  }
});

export default router;
