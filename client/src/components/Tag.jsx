/**
 * Tag component
 *
 * @param {object}    props           - Component properties
 * @param {string}    props.variant   - Variant of the tag (e.g., 'success', 'error', etc.)
 * @param {string=}   props.className - Additional class names
 * @param {ReactNode} props.children  - Content to be displayed inside the tag
 *
 * @returns {JSX.Element} - Rendered tag component
 */
const Tag = ({ variant, children, className = '' }) => {
	const variants = {
		default: '',
		success: 'success',
		error: 'error',
		warning: 'warning',
		info: 'info',
	};

	const variantClass = variants[variant] || '';
	return (
		<span
			className={`tag ${variantClass && `tag--${variantClass}`} ${className}`}
		>
			{children}
		</span>
	);
};

export default Tag;
