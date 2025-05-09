import cron from 'node-cron';
import prisma from './utils/prisma.js';
import axios from 'axios';

// Function to ping a monitor
/**
 *
 * @param monitor
 */
async function checkMonitor(monitor) {
	try {
		const start = Date.now();
		const response = await axios.get(monitor.url, { timeout: 5000 });
		const responseTime = Date.now() - start;

		const responseOk = response.status >= 200 && response.status < 300;

		const status = responseOk ? 'up' : 'down';

		await prisma.heartbeat.create({
			data: {
				monitorId: monitor.id,
				status,
				responseTime,
				responseCode: response.status,
				errorMessage: responseOk ? null : response.statusText,
			},
		});

		console.log(
			`✅ ${monitor.name} (${monitor.url}) is ${status} - ${responseTime}ms`
		);
	} catch (error) {
		let responseCode = 500; // default to internal error
		let errorMessage = error.message || 'Unexpected error';

		if (error.response?.status) {
			responseCode = error.response.status;
			errorMessage = error.response.statusText || 'HTTP error';
		} else if (error.code === 'ECONNABORTED') {
			responseCode = 504; // Gateway Timeout
			errorMessage = 'Request timed out';
		} else if (error.code === 'ENOTFOUND') {
			responseCode = 404; // DNS resolution failure
			errorMessage = 'DNS resolution failed';
		} else if (error.code === 'ECONNREFUSED') {
			responseCode = 503; // Service unavailable
			errorMessage = 'Connection refused';
		} else if (error.code === 'EAI_AGAIN') {
			responseCode = 503; // Temporary DNS failure
			errorMessage = 'Temporary DNS resolution failure';
		} else if (error.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
			responseCode = 502; // Bad Gateway
			errorMessage = 'Invalid SSL certificate';
		} else if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
			responseCode = 525; // SSL handshake failed
			errorMessage = 'Self-signed certificate';
		} else if (error.code === 'ERR_TLS_CERT_EXPIRED') {
			responseCode = 526; // Certificate expired
			errorMessage = 'TLS certificate expired';
		}

		await prisma.heartbeat.create({
			data: {
				monitorId: monitor.id,
				status: 'down',
				responseTime: null,
				responseCode,
				errorMessage,
			},
		});

		console.error(
			`❌ ${monitor.name} (${monitor.url}) is down - error: ${error.message}`
		);
	}
}

// Function to run all monitors
/**
 *
 */
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

// run once on startup
checkAllMonitors();

/**
 * Daily cleanup of old heartbeats
 * This will delete heartbeats older than 1 year
 * This is a simple cleanup task that runs once a day at 03:00 AM
 */
cron.schedule('0 3 * * *', async () => {
	try {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		const deletedHeartbeats = await prisma.heartbeat.deleteMany({
			where: {
				createdAt: {
					lt: oneYearAgo,
				},
			},
		});
		console.log(
			`🗑️ Deleted ${deletedHeartbeats.count} heartbeats older than 12 months.`
		);
	} catch (error) {
		console.error('❌ Failed to delete old heartbeats:', error);
	}
});
