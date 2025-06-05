/**
 * LockOpen Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered lock open icon
 */
const LockOpen = ({ className }) => {
	return (
		<svg
			width="800"
			height="800"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ fill: 'currentColor' }}
		>
			<path d="M9.525 4.525A3.5 3.5 0 0115.208 5.6l.2.458a1 1 0 001.316.517l.917-.4a1 1 0 00.516-1.317l-.2-.458A6.499 6.499 0 007.404 2.404 6.5 6.5 0 005.5 7v3H5a3 3 0 00-3 3v7a3 3 0 003 3h14a3 3 0 003-3v-7a3 3 0 00-3-3H8.5V7a3.5 3.5 0 011.025-2.475z" />
		</svg>
	);
};

export default LockOpen;
