/**
 * FileChecked Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered lock closed icon
 */
const FileChecked = ({ className }) => {
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
				d="M15 19l2 2 4-4M13 3H8.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C5 4.52 5 5.08 5 6.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C6.52 21 7.08 21 8.2 21h3.3M13 3l6 6m-6-6v4.4c0 .56 0 .84.109 1.054a1 1 0 00.437.437C13.76 9 14.04 9 14.6 9H19m0 0v4.4M9 17h2.5M9 13h6M9 9h1"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default FileChecked;
