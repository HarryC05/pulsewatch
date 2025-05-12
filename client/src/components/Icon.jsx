/**
 * Icon component
 *
 * @param {object}  props           - Component properties
 * @param {string}  props.icon      - Icon name
 * @param {string=} props.className - Additional class names
 * @param {string=} props.alt       - Alt text for the icon
 *
 * @returns {JSX.Element} - Rendered icon component
 */
const Icon = ({ icon, className = '', alt = '' }) => {
	const icons = {
		icon: 'icon.min.svg',
		'lock-closed': 'lock-closed.min.svg',
		'lock-open': 'lock-open.min.svg',
		logo: 'logo-dark.min.svg',
		'logo-dark': 'logo-dark.min.svg',
		'logo-light': 'logo-light.min.svg',
	};

	if (!icons[icon]) {
		console.error(`Icon "${icon}" not found.`);
		return null;
	}

	const iconPath = `/svgs/${icons[icon]}`;

	return <img src={iconPath} alt={alt} className={`icon ${className}`} />;
};

export default Icon;
