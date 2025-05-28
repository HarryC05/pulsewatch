/**
 * MenuIcon Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const MenuIcon = ({ className }) => {
	return (
		<svg
			width="800"
			height="800"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h24v24H0z" />
				<path
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					d="M5 7h14M5 17h14M5 12h14"
				/>
			</g>
		</svg>
	);
};

export default MenuIcon;
