import { NavBar } from '../components';

/**
 * Statuses component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Statuses = () => {
	return (
		<>
			<NavBar />
			<main className="statuses">
				<div className="statuses__content">
					<h1>Statuses</h1>
					<p>Here you can view the statuses of your monitors.</p>
					{/* Add your statuses content here */}
				</div>
			</main>
		</>
	);
};

export default Statuses;
