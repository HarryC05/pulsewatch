/**
 * Calendar Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const Calendar = ({ className }) => {
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
				d="M3 9h18M7 3v2m10-2v2M6 13h2m-2 4h2m3-4h2m-2 4h2m3-4h2m-2 4h2M6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 19.48 21 18.92 21 17.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 6.52 3 7.08 3 8.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 21 5.08 21 6.2 21z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Calendar;
