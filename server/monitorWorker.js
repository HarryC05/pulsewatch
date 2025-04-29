import fetch from 'node-fetch';
import cron from 'node-cron';
import prisma from './utils/prisma.js';

// Function to ping a monitor
async function checkMonitor(monitor) {
  try {
    const start = Date.now();
    const response = await fetch(monitor.url, { method: 'GET', timeout: 5000 });
    const responseTime = Date.now() - start;

    const status = response.ok ? 'up' : 'down';

    await prisma.heartbeat.create({
      data: {
        monitorId: monitor.id,
        status,
        responseTime,
      },
    });

    console.log(`✅ ${monitor.name} (${monitor.url}) is ${status} - ${responseTime}ms`);
  } catch (error) {
    await prisma.heartbeat.create({
      data: {
        monitorId: monitor.id,
        status: 'down',
        responseTime: null,
      },
    });

    console.error(`❌ ${monitor.name} (${monitor.url}) is down - error: ${error.message}`);
  }
}

// Function to run all monitors
async function checkAllMonitors() {
  try {
    const monitors = await prisma.monitor.findMany();
    console.log(`🔄 Checking ${monitors.length} monitor(s)...`);
    
    for (const monitor of monitors) {
      await checkMonitor(monitor);
    }
  } catch (error) {
    console.error('❌ Failed to fetch monitors:', error);
  }
}

// Schedule to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('🕐 Running scheduled monitor checks...');
  checkAllMonitors();
});

// Also run once on startup
checkAllMonitors();
