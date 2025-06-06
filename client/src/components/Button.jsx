/**
 * Button component
 *
 * @param {object}    props           - The component props
 * @param {Function}  props.onClick   - The function to call when the button is clicked
 * @param {string}    props.className - Additional class names to apply to the button
 * @param {string}    props.variant   - The variant of the button (e.g., primary, secondary, danger)
 * @param {boolean}   props.disabled  - Whether the button is disabled
 * @param {string}    props.type      - The type of the button (e.g., button, submit)
 * @param {ReactNode} props.children  - The content to display inside the button
 *
 * @returns {JSX.Element} - The rendered button component
 */
const Button = ({
	onClick = () => {},
	className = '',
	variant = 'primary',
	disabled = false,
	type = 'button',
	children,
}) => {
	const variants = {
		primary: 'button__primary',
		secondary: 'button__secondary',
		dangerous: 'button__dangerous',
		text: 'button__text',
		back: 'button__back',
	};

	const variantClass = variants[variant];

	return (
		<button
			className={`button ${variantClass} ${className}`}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
