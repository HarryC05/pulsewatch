import { useState } from 'react';

/**
 * Accordion component
 *
 * @param {object}    props           - Component properties
 * @param {ReactNode} props.children  - Child components
 * @param {string=}   props.className - Additional class names
 * @param {string=}   props.title     - Accordion title
 * @param {boolean=}  props.collapsed - Initial collapsed state
 * @param {string=}   props.status    - Status of the accordion
 *
 * @returns {JSX.Element} - Rendered component
 */
const Accordion = ({
	children,
	className = '',
	title = '',
	collapsed = true,
	status = null,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(collapsed);

	/**
	 * Toggle accordion state
	 */
	const toggleAccordion = () => {
		setIsCollapsed((prev) => !prev);
	};

	/**
	 * Handle key down event
	 *
	 * @param {KeyboardEvent} event - Key down event
	 */
	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleAccordion();
		}
	};

	/**
	 * Handle click event
	 */
	const handleClick = () => {
		toggleAccordion();
	};
	return (
		<div className={`accordion ${isCollapsed ? 'accordion__collapsed' : ''}`}>
			<div
				className="accordion__header"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
			>
				<span className="accordion__icon">{isCollapsed ? '▶' : '▼'}</span>
				<div className="accordion__title">
					{status && (
						<span
							className={`accordion__title-status ${status === 'up' ? 'bg-green' : status === 'down' ? 'bg-red' : ''}`}
							aria-label={`Status: ${status}`}
							title={`Status: ${status}`}
						></span>
					)}
					<h2>{title}</h2>
				</div>
			</div>
			<div className={`accordion__content ${className}`}>{children}</div>
		</div>
	);
};

export default Accordion;
