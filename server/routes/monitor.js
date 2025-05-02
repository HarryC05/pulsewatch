import { subDays, subHours } from 'date-fns';
import express from 'express';

import { protect } from '../middleware/auth.js';
import { urlRegex, urlRegexError, monitorNameRegex, monitorNameRegexError } from '../utils/regex.js';
import prisma from '../utils/prisma.js';
import calcUptime from '../utils/calcUptime.js';
import calcRespTime from '../utils/calcRespTime.js';

const router = express.Router();

// API Routes
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Monitor API',
    endpoints: [
      { method: 'POST', path: '/api/v1/monitor/create', description: 'Create a new monitor' },
      { method: 'GET', path: '/api/v1/monitor/list', description: 'Get all monitors for the logged-in user' },
      { method: 'GET', path: '/api/v1/monitor/:id', description: 'Get a specific monitor by ID' },
      { method: 'PUT', path: '/api/v1/monitor/:id', description: 'Update a monitor' },
      { method: 'DELETE', path: '/api/v1/monitor/:id', description: 'Delete a monitor' },
    ],
  });
});

// Create a monitor
router.post('/create', protect, async (req, res) => {
  const { name, url } = req.body;

  // Validate monitor name
  if (!name.match(monitorNameRegex)) {
    return res.status(400).json({ message: monitorNameRegexError });
  }

  // Validate URL
  if (!url.match(urlRegex)) {
    return res.status(400).json({ message: urlRegexError });
  }

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
          where: {
            createdAt: {
              gte: subDays(new Date(), 7), // last 7 days
            },
          }
        },
      },
    });

    // Format the response
    const formatted = monitors.map(monitor => {
      const latestHeartbeat = monitor.heartbeats[0];

      const uptime = calcUptime(monitor.heartbeats);

      return {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        latest: {
          status: latestHeartbeat?.status || 'unknown',
          responseTime: latestHeartbeat?.responseTime || null,
          checked: latestHeartbeat?.createdAt || null,
        },
        uptime,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monitors' });
  }
});

// Get a specific monitor by ID
router.get('/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    // grab the monitor by ID
    // and include the heartbeats for the last 30 days
    // and order them by createdAt in descending order
    const monitor = await prisma.monitor.findUnique({
      where: { id },
      include: {
        heartbeats: {
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            createdAt: {
              gte: subDays(new Date(), 30), // last 30 days
            },
          },
        },
      },
    });

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    // Check if the monitor belongs to the logged-in user
    if (monitor.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const now = new Date();
    const heartbeatData = monitor.heartbeats;

    const hb24h = heartbeatData.filter(hb => {
      return hb.createdAt >= subHours(now, 24);
    });

    const hb7d = heartbeatData.filter(hb => {
      return hb.createdAt >= subDays(now, 7);
    });

    const hb30d = heartbeatData.filter(hb => {
      return hb.createdAt >= subDays(now, 30);
    });

    const formattedMonitor = {
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      heartbeats: {
        last24h: hb24h,
        last7d: hb7d,
        last30d: hb30d,
      },
      responseTimes: {
        last24h: calcRespTime(hb24h),
        last7d: calcRespTime(hb7d),
      },
      latest: {
        status: heartbeatData[heartbeatData.length - 1]?.status || null,
        responseTime: heartbeatData[heartbeatData.length - 1]?.responseTime || null,
        createdAt: heartbeatData[heartbeatData.length - 1]?.createdAt || null,
      },
      uptime: {
        last24h: calcUptime(hb24h),
        last7d: calcUptime(hb7d),
        last30d: calcUptime(hb30d),
      },
    }

    res.json(formattedMonitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monitor' });
  }
});

// Update a monitor
router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { name, url } = req.body;

  // Validate monitor name
  if (name && !name.match(monitorNameRegex)) {
    return res.status(400).json({ message: monitorNameRegexError });
  }

  // Validate URL
  if (url && !url.match(urlRegex)) {
    return res.status(400).json({ message: urlRegexError });
  }

  // Check if the monitor belongs to the logged-in user
  const monitor = await prisma.monitor.findUnique({
    where: { id },
  });

  if (!monitor) {
    return res.status(404).json({ message: 'Monitor not found' });
  }

  if (monitor.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const updatedMonitor = await prisma.monitor.update({
      where: { id },
      data: {
        name,
        url,
      },
    });

    res.json(updatedMonitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update monitor' });
  }
});

// Delete a monitor
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;

  // Check if the monitor belongs to the logged-in user
  const monitor = await prisma.monitor.findUnique({
    where: { id },
  });

  if (!monitor) {
    return res.status(404).json({ message: 'Monitor not found' });
  }

  if (monitor.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    // Delete all heartbeats associated with the monitor
    await prisma.heartbeat.deleteMany({
      where: { monitorId: id },
    });

    // Delete the monitor
    await prisma.monitor.delete({
      where: { id },
    });

    res.json({ message: 'Monitor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete monitor' });
  }
});

export default router;
