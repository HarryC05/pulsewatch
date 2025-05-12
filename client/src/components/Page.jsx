import { NavBar } from './';

/**
 * Page component
 *
 * @param {object}    props           - Component properties
 * @param {string=}   props.className - Additional class name for styling
 * @param {string=}   props.title     - Title of the page
 * @param {ReactNode} props.children  - Child components to be rendered
 *
 * @returns {JSX.Element} Rendered Page component
 */
const Page = ({ className = '', title, children }) => {
	return (
		<>
			<NavBar />
			<main className={`page ${className}`}>
				{title && <h1 className="page__title">{title}</h1>}
				<section className="page__content">{children}</section>
			</main>
		</>
	);
};

export default Page;
