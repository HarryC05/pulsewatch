import { Page } from '../components';

/**
 * Homepage component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Homepage = () => {
	return (
		<>
			<Page className="homepage" header="Welcome to the Homepage">
				<div className="homepage__content">
					<p>This is the main content area.</p>
				</div>
			</Page>
		</>
	);
};

export default Homepage;
