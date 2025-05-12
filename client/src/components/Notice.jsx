/**
 * Notice component
 *
 * @param {object} props         - The component props
 * @param {string} props.message - The message to display
 * @param {string} props.variant - The type of notice (e.g., success, error)
 *
 * @returns {JSX.Element} - The rendered component
 */
const Notice = ({ message, variant }) => {
	const noticeTypes = {
		success: 'notice__success',
		error: 'notice__error',
		info: 'notice__info',
		warning: 'notice__warning',
	};

	const noticeType = noticeTypes[variant] || 'notice__info';

	const noticeClass = `notice ${noticeType}`;

	return <div className={noticeClass}>{message}</div>;
};

export default Notice;
