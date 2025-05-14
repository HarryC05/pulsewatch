import { Page } from '../components';

/**
 * Status Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Status = () => {
	return (
		<Page title="Status">
			<div className="status">
				<div className="status__content">
					<h1 className="status__title">Status</h1>
					<p className="status__description">
						PulseWatch is currently up and running. All systems are functioning
						normally.
					</p>
				</div>
			</div>
		</Page>
	);
};

export default Status;
