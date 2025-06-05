/**
 * Layers Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered lock closed icon
 */
const Layers = ({ className }) => {
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.678 2.303a3.034 3.034 0 012.644 0l7.316 3.555a2.365 2.365 0 010 4.284l-7.316 3.555a3.034 3.034 0 01-2.644 0l-7.316-3.555a2.365 2.365 0 010-4.284l7.316-3.555zm1.763 1.714a1.011 1.011 0 00-.882 0L4.244 7.572a.473.473 0 000 .856l7.315 3.555c.278.135.604.135.882 0l7.315-3.555a.473.473 0 000-.856l-7.315-3.555z"
				fill="currentColor"
			/>
			<path
				d="M2.106 16.817a1 1 0 011.341-.447l8.106 4.053a1 1 0 00.894 0l8.106-4.053a1 1 0 11.894 1.789l-8.105 4.053a3 3 0 01-2.684 0l-8.105-4.053a1 1 0 01-.447-1.342z"
				fill="currentColor"
			/>
			<path
				d="M3.447 12.106a1 1 0 10-.894 1.789l8.106 4.052a3 3 0 002.683 0l8.105-4.052a1 1 0 10-.894-1.79l-8.106 4.054a1 1 0 01-.894 0l-8.106-4.053z"
				fill="currentColor"
			/>
		</svg>
	);
};

export default Layers;
