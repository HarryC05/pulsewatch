/**
 * UptimePill component
 *
 * @param {object} props           - The component props
 * @param {number} props.uptime    - The uptime percentage to display
 * @param {string} props.className - Additional CSS classes to apply
 *
 * @returns {JSX.Element} - The rendered component
 */
const UptimePill = ({ uptime, className }) => {
	return (
		<span
			className={`uptime-pill ${uptime ? (uptime > 90 ? 'bg-green' : uptime > 50 ? 'bg-yellow' : 'bg-red') : ''} ${className || ''}`}
			title={uptime ? `${uptime}% uptime in the last 7 days` : 'No data'}
		>
			{uptime ? `${uptime}%` : 'N/A'}
		</span>
	);
};

export default UptimePill;
