/**
 * ClockActivity Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const ClockActivity = ({ className }) => {
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
				d="M4 12a8 8 0 018-8 1 1 0 100-2C6.477 2 2 6.477 2 12s4.477 10 10 10a9.972 9.972 0 007.071-2.929 1 1 0 00-1.414-1.414A8 8 0 014 12zm9-6a1 1 0 10-2 0v6a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 11.586V6zm8.748 9.167a1.25 1.25 0 11-2.377-.772 1.25 1.25 0 012.377.772zm-.663-3.34a1.25 1.25 0 10-.391-2.47 1.25 1.25 0 00.39 2.47zm-.793-5.852a1.25 1.25 0 11-2.022 1.47 1.25 1.25 0 012.022-1.47zM17.2 4.548a1.25 1.25 0 10-2.228-1.134A1.25 1.25 0 0017.2 4.548z"
				fill="currentColor"
			/>
		</svg>
	);
};

export default ClockActivity;
