/**
 * UptimePill component
 *
 * @param {object} props        - The component props
 * @param {number} props.uptime - The uptime percentage to display
 *
 * @returns {JSX.Element} - The rendered component
 */
const UptimePill = ({ uptime }) => {
	return (
		<span
			className={`uptime-pill ${uptime ? (uptime > 90 ? 'bg-green' : uptime > 50 ? 'bg-yellow' : 'bg-red') : ''}`}
			title={uptime ? `${uptime}% uptime in the last 7 days` : 'No data'}
		>
			{uptime ? `${uptime}%` : 'N/A'}
		</span>
	);
};

export default UptimePill;
