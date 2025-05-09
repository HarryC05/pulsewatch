import '../styles/components/section.css';

/**
 * @description A simple section component that wraps its children in a div with a specific class.
 *
 * @param {Object}    props           - The component props
 * @param {string}    props.className - Additional class name to apply to the section
 * @param {string}    props.variant   - The variant of the section (not used in this implementation)
 * @param {ReactNode} props.children  - The children to render inside the section
 *
 * @returns {JSX.Element} - The rendered component
 */
const Section = ({ className, variant, children }) => {
  const variants = {
    default: '',
    dark: 'section__dark',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <div className={`section ${variantClass} ${className}`}>
      {children}
    </div>
  );
}

export default Section;
