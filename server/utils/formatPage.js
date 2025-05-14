/**
 * Formats the page object to a more readable structure
 *
 * @param {object} page                                              - The page object containing monitor data
 * @param {string} page.title                                        - The title of the page
 * @param {string} page.description                                  - The description of the page
 * @param {Array}  page.monitors                                     - Array of monitor objects
 * @param {string} page.monitors[].monitor.id                        - The ID of the monitor
 * @param {string} page.monitors[].monitor.name                      - The name of the monitor
 * @param {string} page.monitors[].monitor.url                       - The URL of the monitor
 * @param {Array}  page.monitors[].monitor.heartbeats                - Array of heartbeat objects
 * @param {string} page.monitors[].monitor.heartbeats[].id           - The ID of the heartbeat
 * @param {string} page.monitors[].monitor.heartbeats[].status       - The status of the heartbeat
 * @param {number} page.monitors[].monitor.heartbeats[].responseTime - The response time of the heartbeat
 * @param {string} page.monitors[].monitor.heartbeats[].createdAt    - The creation date of the heartbeat
 *
 * @returns {object} - Formatted page object
 */
const formatPage = (page) => {
	return {
		title: page.title,
		description: page.description,
		monitors: page.monitors.map((monitor) => ({
			id: monitor.monitor.id,
			name: monitor.monitor.name,
			url: monitor.monitor.url,
			lastChecked: monitor.monitor.heartbeats[0]?.createdAt || null,
			responseTime: monitor.monitor.heartbeats[0]?.responseTime || null,
			status: monitor.monitor.heartbeats[0]?.status || 'unknown',
			heartbeats: monitor.monitor.heartbeats.map((heartbeat) => ({
				id: heartbeat.id,
				status: heartbeat.status,
				responseTime: heartbeat.responseTime,
				createdAt: heartbeat.createdAt,
			})),
		})),
	};
};

export default formatPage;
