/**
 * Zap Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const Zap = ({ className }) => {
	return (
		<svg
			width="800"
			height="800"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M17.763 10.761l.107-.163a.128.128 0 00-.107-.198H13.5a.214.214 0 01-.214-.214V4.213c0-.063-.082-.088-.117-.035l-5.98 9.134-.086.13a.102.102 0 00.086.158h4.314c.117 0 .211.095.211.212v5.79c0 .119.154.163.219.064l5.83-8.905z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Zap;
