import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Accordion, Button, Page, Section } from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * Status Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Status = () => {
	const { slug } = useParams();

	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState({});
	const [error, setError] = useState({ code: 0, message: '' });

	useEffect(() => {
		const controller = new AbortController();
		axios
			.get(`${API}/api/v1/page/${slug}`, {
				withCredentials: true,
				signal: controller.signal,
			})
			.then((res) => {
				if (res.data) {
					setStatus(res.data);
					setLoading(false);
				} else {
					setError({
						code: 404,
						message: 'Page not found',
					});
					setLoading(false);
				}
			})
			.catch((err) => {
				if (err.name !== 'CanceledError') {
					console.error(err);
					setError({
						code: err.response.status,
						message: err.response.data.message,
					});
					setLoading(false);
				}
			});

		return () => {
			controller.abort();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return <Page title="Loading..." />;
	}

	if (error.code !== 0) {
		return (
			<Page className="status-page" title={`Error ${error.code}`}>
				<Section className="status-page__error">
					{error.code === 404 ? (
						<div className="status-page__error-content">
							<h1 className="status-page__error-title">
								Status Page Not Found
							</h1>
							<p className="status-page__error-description">
								The status page you are looking for does not exist.
							</p>
							<Button onClick={() => navigate('/')}>Go to Homepage</Button>
						</div>
					) : error.code === 401 ? (
						<div className="status-page__error-content">
							<h1 className="status-page__error-title">
								This status page is private
							</h1>
							<p className="status-page__error-description">
								You need to be logged in to view this status page. Please log in
								to your account.
							</p>
							<Button onClick={() => navigate('/login')}>Login</Button>
						</div>
					) : (
						<div className="status-page__error-content">
							<h1 className="status-page__error-title">Error</h1>
							<p className="status-page__error-description">{error.message}</p>
						</div>
					)}
				</Section>
			</Page>
		);
	}

	console.log(status);

	return (
		<Page title={status.title} className="status-page">
			{status.monitors && status.monitors.length > 0 ? (
				status.monitors.map((monitor) => (
					<Accordion
						className="status-page__monitor"
						key={monitor.id}
						title={monitor.name}
						status={monitor.status}
						collapsed={status.monitors.length > 1}
					>
						<p>Status stuff here</p>
					</Accordion>
				))
			) : (
				<Section className="status-page__no-monitors">
					<h1 className="status-page__no-monitors-title">
						This status page has no monitors
					</h1>
				</Section>
			)}
		</Page>
	);
};

export default Status;
