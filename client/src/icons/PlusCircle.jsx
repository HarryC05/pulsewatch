/**
 * PlusCircle Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const PlusCircle = ({ className }) => {
	return (
		<svg
			width="800"
			height="800"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			className={className}
		>
			<g fill="currentColor">
				<path d="M7.75 4a.75.75 0 01.75.75V7h2.25a.75.75 0 010 1.5H8.5v2.25a.75.75 0 01-1.5 0V8.5H4.75a.75.75 0 010-1.5H7V4.75A.75.75 0 017.75 4z" />
				<path
					fill-rule="evenodd"
					d="M0 7.75a7.75 7.75 0 1115.5 0 7.75 7.75 0 01-15.5 0zM7.75 1.5a6.25 6.25 0 100 12.5 6.25 6.25 0 000-12.5z"
					clip-rule="evenodd"
				/>
			</g>
		</svg>
	);
};

export default PlusCircle;
