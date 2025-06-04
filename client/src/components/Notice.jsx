import Icon from './Icon';

/**
 * Notice component
 *
 * @param {object}   props           - The component props
 * @param {string}   props.message   - The message to display
 * @param {string}   props.variant   - The type of notice (e.g., success, error)
 * @param {Function} props.onDismiss - Callback function to dismiss the notice
 *
 * @returns {JSX.Element} - The rendered component
 */
const Notice = ({ message, variant, onDismiss }) => {
	const noticeTypes = {
		success: 'notice__success',
		error: 'notice__error',
		info: 'notice__info',
		warning: 'notice__warning',
	};

	const noticeType = noticeTypes[variant] || 'notice__info';

	const noticeClass = `notice ${noticeType}`;

	return (
		<div className={noticeClass}>
			{message}
			{onDismiss && (
				<button className="notice__dismiss" onClick={onDismiss}>
					<Icon icon="close" className="notice__icon" alt="Dismiss notice" />
				</button>
			)}
		</div>
	);
};

export default Notice;
