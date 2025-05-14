import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Button, Page, Section } from '../components';

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
