import { Tag } from './';

/**
 * VisibilityToggle component allows toggling between public and private visibility states.
 *
 * @param {object}   props           - Component properties
 * @param {boolean}  props.isVisible - Current visibility state as a boolean (true for public, false for private)
 * @param {Function} props.onToggle  - Function to call when toggling visibility
 *
 * @returns {JSX.Element} - Rendered VisibilityToggle component
 */
const VisibilityToggle = ({ isVisible, onToggle }) => {
	if (typeof isVisible !== 'boolean') {
		console.error(
			'VisibilityToggle: isVisible must be a boolean or a string ("true" or "false")'
		);
		return null;
	}

	return (
		<div className="visibility-toggle">
			<button
				type="button"
				className={`visibility-toggle--button`}
				onClick={() => onToggle(!isVisible)}
			>
				<Tag variant={!isVisible ? 'red' : 'default'}>Private</Tag>
			</button>
			<label className="visibility-toggle--label" htmlFor="isPublic">
				<input
					type="checkbox"
					id="isPublic"
					checked={isVisible}
					onChange={() => onToggle(!isVisible)}
					className="visibility-toggle--checkbox"
				/>
				<span className="visibility-toggle--slider"></span>
			</label>
			<button
				type="button"
				className={`visibility-toggle--button`}
				onClick={() => onToggle(!isVisible)}
			>
				<Tag variant={isVisible ? 'green' : 'default'}>Public</Tag>
			</button>
		</div>
	);
};

export default VisibilityToggle;
