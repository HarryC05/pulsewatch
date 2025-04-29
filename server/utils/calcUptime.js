/**
 * @description Calculate the uptime of the server based on heartbeats
 * 
 * @param {Array} heartBeats - Array of heartbeats
 * 
 * @returns {String|null} - Uptime percentage as a string or null if no heartbeats
 */
const calcUptime = (heartBeats) => {
  const totalHeartbeats = heartBeats.length;
  const upHeartbeats = heartBeats.filter(hb => hb.status === 'up').length;

  if (totalHeartbeats === 0) {
    return null; // No heartbeats yet
  }

  const uptime = (upHeartbeats / totalHeartbeats) * 100;
  return uptime.toFixed(2); // Return uptime as a percentage with 2 decimal places
}

export default calcUptime;
