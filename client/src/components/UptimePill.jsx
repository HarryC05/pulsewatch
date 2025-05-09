import '../styles/components/uptimePill.css';

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
			className={`uptime-pill ${uptime ? (uptime > 90 ? 'background-colour-green' : uptime > 50 ? 'background-colour-yellow' : 'background-colour-red') : ''}`}
			title={uptime ? `${uptime}% uptime in the last 7 days` : 'No data'}
		>
			{uptime ? `${uptime}%` : 'N/A'}
		</span>
	);
};

export default UptimePill;
