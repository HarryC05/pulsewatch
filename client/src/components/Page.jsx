import { useEffect } from 'react';

import { NavBar, Footer } from './';

/**
 * Page component
 *
 * @param {object}    props           - Component properties
 * @param {string=}   props.className - Additional class name for styling
 * @param {string}    props.header    - Header text to be displayed
 * @param {string}    props.title     - Title of the page
 * @param {ReactNode} props.children  - Child components to be rendered
 *
 * @returns {JSX.Element} Rendered Page component
 */
const Page = ({ className = '', header, title, children }) => {
	useEffect(() => {
		document.title = title || 'Pulse Watch';
	}, [title]);

	return (
		<>
			<NavBar />
			<main className={`page ${className}`}>
				{header && <h1 className="page__header">{header}</h1>}
				<section className="page__content">{children}</section>
			</main>
			<Footer />
		</>
	);
};

export default Page;
