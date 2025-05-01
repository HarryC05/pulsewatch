import '../styles/components/notice.css';

/**
 * @description A simple notice component that displays a message.
 * 
 * @param {Object} props - The component props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of notice (e.g., success, error)
 * 
 * @returns {JSX.Element} - The rendered component
 */
const Notice = ({ message, type }) => {
  const noticeTypes = {
    success: 'notice-success',
    error: 'notice-error',
    info: 'notice-info',
    warning: 'notice-warning'
  };

  const noticeType = noticeTypes[type] || 'notice-info';

  const noticeClass = `notice ${noticeType}`;

  return (
    <div className={noticeClass}>
      {message}
    </div>
  );
}

export default Notice;
