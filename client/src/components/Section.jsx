import '../styles/components/section.css';

/**
 * @description A simple section component that wraps its children in a div with a specific class.
 * 
 * @param {Object}    props           - The component props
 * @param {string}    props.className - Additional class name to apply to the section
 * @param {ReactNode} props.children  - The children to render inside the section
 * 
 * @returns {JSX.Element} - The rendered component
 */
const Section = ({ className, children }) => (
  <div className={`section ${className}`}>
    {children}
  </div>
)

export default Section;
