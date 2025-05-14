/**
 * Card component
 *
 * @param {object}    props           - The component props
 * @param {string}    props.className - Additional class name to apply to the card
 * @param {ReactNode} props.children  - The children to render inside the card
 * @param {string=}   props.key       - The key for the card (optional)
 * @param {Function=} props.onClick   - Click event handler for the card (optional)
 *
 * @returns {JSX.Element} - The rendered component
 */
const Card = ({ className, children, key, onClick }) => {
	return (
		<div
			className={`card ${className}`}
			key={key}
			onClick={onClick}
			role={onClick ? 'button' : undefined}
			aria-hidden={!onClick}
			aria-label={onClick ? 'Click to open' : undefined}
			tabIndex={onClick ? 0 : undefined}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick();
				}
			}}
		>
			{children}
		</div>
	);
};

export default Card;
