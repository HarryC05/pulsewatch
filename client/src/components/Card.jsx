/**
 * Card component
 *
 * @param {object}    props           - The component props
 * @param {string}    props.className - Additional class name to apply to the card
 * @param {ReactNode} props.children  - The children to render inside the card
 *
 * @returns {JSX.Element} - The rendered component
 */
const Card = ({ className, children }) => (
	<div className={`card ${className}`}>{children}</div>
);

export default Card;
