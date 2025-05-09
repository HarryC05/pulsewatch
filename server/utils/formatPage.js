/**
 * Formats the page object to a more readable structure
 *
 * @param {Object} page - The page object containing monitor data
 * @param {String} page.title - The title of the page
 * @param {String} page.description - The description of the page
 * @param {Array}  page.monitors - Array of monitor objects
 * @param {String} page.monitors[].id - The ID of the monitor
 * @param {String} page.monitors[].name - The name of the monitor
 * @param {String} page.monitors[].url - The URL of the monitor
 * @param {Array} page.monitors[].monitor.heartbeats - Array of heartbeat objects
 * @param {String} page.monitors[].monitor.heartbeats[].id - The ID of the heartbeat
 * @param {String} page.monitors[].monitor.heartbeats[].status - The status of the heartbeat
 * @param {Number} page.monitors[].monitor.heartbeats[].responseTime - The response time of the heartbeat
 * @param {String} page.monitors[].monitor.heartbeats[].createdAt - The creation date of the heartbeat
 * @returns
 */
const formatPage = (page) => {
  return {
    title: page.title,
    description: page.description,
    monitors: page.monitors.map((monitor) => ({
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
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
  }
}

export default formatPage;
