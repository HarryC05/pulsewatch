/**
 * @description Calculate the average response time of the server based on heartbeats
 *
 * @param {Array} heartBeats - Array of heartbeats
 *
 * @returns {string | null} - Average response time in milliseconds as a string or null if no heartbeats
 */
const calcRespTime = (heartBeats) => {
	const upHeartbeats = heartBeats.filter((hb) => hb.status === 'up');
	const totalResponseTime = upHeartbeats.reduce(
		(acc, hb) => acc + hb.responseTime,
		0
	);
	const totalHeartbeats = upHeartbeats.length;
	if (totalHeartbeats === 0) {
		return null; // No heartbeats yet
	}
	const avgResponseTime = totalResponseTime / totalHeartbeats;
	return avgResponseTime.toFixed(2); // Return average response time in milliseconds with 2 decimal places
};

export default calcRespTime;
