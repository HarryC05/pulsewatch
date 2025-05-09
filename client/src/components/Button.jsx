import '../styles/components/button.css';

/**
 * @description A simple button component that can be used throughout the application.
 *
 * @param {Object}    props           - The component props
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
  onClick=() => {},
  className='',
  variant='primary',
  disabled=false,
  type='button',
  children,
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    dangerous: 'btn-dangerous',
    text: 'btn-text',
  }

  const variantClass = variants[variant];

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
