import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
	Accordion,
	Button,
	Card,
	Page,
	ResponseChart,
	Section,
	UptimeChart,
	UptimePill,
} from '../components';

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
	const [responseTimeOption, setResponseTimeOption] = useState(24);
	const [responseTimeHBs, setResponseTimeHBs] = useState([]);
	const [downHBs, setDownHBs] = useState([]);

	/**
	 * Calculate the average response time to the nearest ms from heartbeats
	 *
	 * @param {Array}  heartbeats - Array of heartbeat objects
	 * @param {number} hours      - Number of hours to calculate average for
	 *
	 * @returns {string} - Average response time in ms
	 */
	const calculateAverageResponseTime = (heartbeats, hours) => {
		if (!heartbeats || heartbeats.length === 0) {
			return 'N/A';
		}

		let hbs = heartbeats;

		if (hours) {
			const now = new Date();
			const pastDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
			hbs = heartbeats.filter((heartbeat) => {
				return new Date(heartbeat.createdAt) >= pastDate;
			});
		}

		// Filter out heartbeats down hbs
		const filteredHeartbeats = hbs.filter((heartbeat) => {
			return heartbeat.status === 'up';
		});

		// if no heartbeats are up, return N/A
		if (filteredHeartbeats.length === 0) {
			return 'N/A';
		}

		const totalResponseTime = filteredHeartbeats.reduce((acc, heartbeat) => {
			return acc + heartbeat.responseTime;
		}, 0);

		const averageResponseTime = totalResponseTime / filteredHeartbeats.length;
		return `${Math.round(averageResponseTime)} ms`;
	};

	/**
	 * Calculate the average uptime to 2 decimal places from heartbeats
	 *
	 * @param {Array}  heartbeats - Array of heartbeat objects
	 * @param {number} hours      - Number of hours to calculate average for
	 *
	 * @returns {number} - Average uptime percentage
	 */
	const calculateAverageUptime = (heartbeats, hours) => {
		if (!heartbeats || heartbeats.length === 0) {
			return 0;
		}

		let hbs = heartbeats;
		if (hours) {
			const now = new Date();
			const pastDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
			hbs = heartbeats.filter((heartbeat) => {
				return new Date(heartbeat.createdAt) >= pastDate;
			});
		}

		const totalUptime = hbs.reduce((acc, heartbeat) => {
			return acc + (heartbeat.status === 'up' ? 1 : 0);
		}, 0);

		const averageUptime = (totalUptime / hbs.length) * 100;
		return Math.round(averageUptime * 100) / 100;
	};

	/**
	 * Handle response time option change
	 *
	 * @param {Event} e - Event object
	 */
	const handleResponseTimeChange = (e) => {
		// validate the input
		if (
			isNaN(e.target.value) ||
			(e.target.value !== '24' && e.target.value !== '168')
		) {
			return;
		}

		setResponseTimeOption(e.target.value);
	};

	// Set the response time heartbeats based on the selected option
	useEffect(() => {
		const now = new Date();
		const pastDate = new Date(
			now.getTime() - responseTimeOption * 60 * 60 * 1000
		);

		if (!status.monitors) {
			return;
		}

		const hbs = status.monitors.map((monitor) => {
			return monitor.heartbeats.filter((heartbeat) => {
				return new Date(heartbeat.createdAt) >= pastDate;
			});
		});

		setResponseTimeHBs(hbs);
	}, [responseTimeOption, status]);

	// Set the downtime heartbeats max of 5 for each monitor
	useEffect(() => {
		if (!status.monitors) {
			return;
		}

		const hbs = status.monitors.map((monitor) => {
			return monitor.heartbeats.filter((heartbeat) => {
				return heartbeat.status === 'down';
			});
		});

		const downHbs = hbs.map((monitor) => {
			return monitor.slice(0, 5);
		});

		setDownHBs(downHbs);
	}, [status]);

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
		<Page title={status.title} className="status-page">
			{status.monitors && status.monitors.length > 0 ? (
				status.monitors.map((monitor, index) => (
					<Accordion
						className="status-page__monitor--content"
						key={monitor.id}
						title={monitor.name}
						status={monitor.status}
						collapsed={index !== 0}
					>
						<h4>
							Last Check: {new Date(monitor.lastChecked).toLocaleString()}
						</h4>
						<div className="status-page__monitor--details">
							<Card className="status-page__monitor--details-card">
								<h2>Response</h2>
								<span className="status-page__monitor--details-card-subtitle">
									(Current)
								</span>
								<h3 className="status-page__monitor--details-card-value">
									{monitor.heartbeats[0].responseTime
										? `${monitor.heartbeats[0].responseTime} ms`
										: 'N/A'}
								</h3>
							</Card>
							<Card className="status-page__monitor--details-card">
								<h2>Response</h2>
								<span className="status-page__monitor--details-card-subtitle">
									(Avg. 24 hrs)
								</span>
								<h3 className="status-page__monitor--details-card-value">
									{calculateAverageResponseTime(monitor.heartbeats, 24)}
								</h3>
							</Card>
							<Card className="status-page__monitor--details-card">
								<h2>Response</h2>
								<span className="status-page__monitor--details-card-subtitle">
									(Avg. 7 Days)
								</span>
								<h3 className="status-page__monitor--details-card-value">
									{calculateAverageResponseTime(monitor.heartbeats)}
								</h3>
							</Card>
							<Card className="status-page__monitor--details-card">
								<h2>Uptime</h2>
								<span className="status-page__monitor--details-card-subtitle">
									(24 hrs)
								</span>
								<UptimePill
									uptime={calculateAverageUptime(monitor.heartbeats, 24)}
									className="status-page__monitor--details-uptime"
								/>
							</Card>
							<Card className="status-page__monitor--details-card">
								<h2>Uptime</h2>
								<span className="status-page__monitor--details-card-subtitle">
									(7 Days)
								</span>
								<UptimePill
									uptime={calculateAverageUptime(monitor.heartbeats)}
									className="status-page__monitor--details-uptime"
								/>
							</Card>
						</div>
						<UptimeChart data={monitor.heartbeats} />
						<Section
							variant="dark"
							className="status-page__monitor--response-time"
						>
							<div className="status-page__monitor--response-time-header">
								<h2>Response Time</h2>
								<select
									className="status-page__monitor--response-time-header-select"
									value={responseTimeOption}
									onChange={handleResponseTimeChange}
								>
									<option value="24">Last 24 hours</option>
									<option value="168">Last 7 days</option>
								</select>
							</div>
							{responseTimeHBs[index] && (
								<ResponseChart heartbeats={responseTimeHBs[index]} />
							)}
						</Section>
						<Section variant="dark" className="status-page__monitor--downtime">
							<h2>Downtime</h2>
							<span className="status-page__monitor--downtime-subtitle">
								<i>Showing up to 5 most recent events from the last 7 days.</i>
							</span>
							<div className="status-page__monitor--downtime-list">
								{downHBs[index] && downHBs[index].length > 0 ? (
									<table className="status-page__monitor--downtime-list-table">
										<thead>
											<tr>
												<th className="status-page__monitor--downtime-list-table-header-date">
													Date
												</th>
												<th className="status-page__monitor--downtime-list-table-header-response-code">
													Response Code
												</th>
												<th className="status-page__monitor--downtime-list-table-header-error-message">
													Error Message
												</th>
											</tr>
										</thead>
										<tbody>
											{downHBs[index].map((heartbeat) => (
												<tr key={heartbeat.id}>
													<td>
														{new Date(heartbeat.createdAt).toLocaleString()}
													</td>
													<td>{heartbeat.responseCode || 'N/A'}</td>
													<td>{heartbeat.errorMessage || 'N/A'}</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<p>No downtime recorded in the last 7 days.</p>
								)}
							</div>
						</Section>
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
