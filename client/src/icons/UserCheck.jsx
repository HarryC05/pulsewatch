/**
 * UserCheck Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const UserCheck = ({ className }) => {
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
				d="M15 15.255a7.001 7.001 0 00-10.955 4.947c-.028.246-.042.37.007.49.04.097.128.194.22.245.113.063.251.063.528.063h5.145M14 19.286L15.8 21l4.2-4M15 7a4 4 0 11-8 0 4 4 0 018 0z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default UserCheck;
