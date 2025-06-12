import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
	UptimePill,
	UptimeChart,
	ResponseChart,
	EditMonitorModal,
	Section,
	Card,
	Notice,
	Button,
	DeleteMonitorModal,
	Page,
	Tag,
} from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * MonitorDetails Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
const MonitorDetails = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [monitor, setMonitor] = useState({});
	const [downHBs, setDownHBs] = useState([]);
	const [responseTimeOption, setResponseTimeOption] = useState('last24h');
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();

	/**
	 * Filter down heartbeats
	 *
	 * @param {Array} heartbeats - Array of heartbeats
	 *
	 * @returns {void}
	 */
	const filterDownHBs = (heartbeats) => {
		const filtered = heartbeats.filter(
			(heartbeat) => heartbeat.status === 'down'
		);
		setDownHBs(filtered.reverse());
	};

	/**
	 * Fetch monitor details
	 */
	const getMonitor = () => {
		axios
			.get(`${API}/api/v1/monitor/${id}`, { withCredentials: true })
			.then((res) => {
				setMonitor(res.data);
				filterDownHBs(res.data.heartbeats.last30d);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					navigate('/login');
				} else {
					setLoading(false);
					setError('An error occurred while fetching monitor details.');
					console.error(err);
				}
			});
	};

	useEffect(() => {
		// Fetch monitor details
		getMonitor();

		// Polling for monitor updates every 30 seconds
		const interval = setInterval(() => {
			getMonitor();
		}, 30000);

		return () => clearInterval(interval);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return <Page header="Loading..." title="PW | Loading..." />;
	}

	return (
		<>
			{showEditModal && (
				<EditMonitorModal
					onClose={() => setShowEditModal(false)}
					monitor={{ id: monitor.id, name: monitor.name, url: monitor.url }}
					getMonitor={getMonitor}
				/>
			)}
			{showDeleteModal && (
				<DeleteMonitorModal
					onClose={() => setShowDeleteModal(false)}
					monitorId={monitor.id}
					monitorName={monitor.name}
				/>
			)}
			<Page
				className="monitor-page"
				title={`PW | Edit ${monitor.name} Monitor`}
			>
				{error && <Notice variant="error" message={error} />}
				<Button variant="text" onClick={() => navigate(-1)}>
					<h4>← Back</h4>
				</Button>
				<div className="monitor-page__details--header">
					<div className="monitor-page__details--header-info">
						<Tag variant={monitor.latest.status === 'up' ? 'green' : 'red'}>
							{monitor.latest.status === 'up' ? 'Up' : 'Down'}
						</Tag>
						<h1 className="monitor-page__details--header-info-name">
							{monitor.name}
						</h1>
						<h2>
							<a
								href={monitor.url}
								target="_blank"
								rel="noopener noreferrer"
								className="monitor-page__details--header-info-url"
							>
								{monitor.url}
							</a>
						</h2>
					</div>
					<div className="monitor-page__details--header-buttons">
						<Button variant="primary" onClick={() => setShowEditModal(true)}>
							Edit
						</Button>
						<Button
							variant="dangerous"
							onClick={() => setShowDeleteModal(true)}
						>
							Delete
						</Button>
					</div>
				</div>
				<Section className="monitor-page__details">
					<h4>
						Last Check: {new Date(monitor.latest.createdAt).toLocaleString()}
					</h4>
					<div className="monitor-page__details--info">
						<Card className="monitor-page__details--info-item">
							<h2>Response</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(current)
							</span>
							<h3 className="monitor-page__details--info-item-value">
								{monitor.latest.responseTime
									? `${monitor.latest.responseTime} ms`
									: 'N/A'}
							</h3>
						</Card>
						<Card className="monitor-page__details--info-item">
							<h2>Response</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(Avg. 24 hrs)
							</span>
							<h3 className="monitor-page__details--info-item-value">
								{monitor.responseTimes.last24h
									? `${monitor.responseTimes.last24h} ms`
									: 'N/A'}
							</h3>
						</Card>
						<Card className="monitor-page__details--info-item">
							<h2>Response</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(Avg. 7 days)
							</span>
							<h3 className="monitor-page__details--info-item-value">
								{monitor.responseTimes.last7d
									? `${monitor.responseTimes.last7d} ms`
									: 'N/A'}
							</h3>
						</Card>
						<Card className="monitor-page__details--info-item">
							<h2>Uptime</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(24 hrs)
							</span>
							<UptimePill
								uptime={monitor.uptime.last24h}
								className="monitor-page__details--info-item-uptime-pill"
							/>
						</Card>
						<Card className="monitor-page__details--info-item">
							<h2>Uptime</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(7 Days)
							</span>
							<UptimePill
								uptime={monitor.uptime.last7d}
								className="monitor-page__details--info-item-uptime-pill"
							/>
						</Card>
						<Card className="monitor-page__details--info-item">
							<h2>Uptime</h2>
							<span className="monitor-page__details--info-item-subtitle">
								(30 Days)
							</span>
							<UptimePill
								uptime={monitor.uptime.last30d}
								className="monitor-page__details--info-item-uptime-pill"
							/>
						</Card>
					</div>
					<UptimeChart data={monitor.heartbeats.last24h} />
					<Section
						variant="dark"
						className="monitor-page__details--response-time"
					>
						<div className="monitor-page__details--response-time-header">
							<h2>Response Time</h2>
							<select
								className="monitor-page__details--response-time-header-select"
								value={responseTimeOption}
								onChange={(e) => setResponseTimeOption(e.target.value)}
							>
								<option value="last24h">Last 24 hours</option>
								<option value="last7d">Last 7 days</option>
								<option value="last30d">Last 30 days</option>
							</select>
						</div>
						<ResponseChart
							heartbeats={monitor.heartbeats[responseTimeOption]}
						/>
					</Section>
					<Section variant="dark" className="monitor-page__details--downtime">
						<h2>Downtime</h2>
						<div className="monitor-page__details--downtime-list">
							{downHBs.length > 0 ? (
								<table className="monitor-page__details--downtime-list-table">
									<thead className="monitor-page__details--downtime-list-table-head">
										<tr>
											<th className="monitor-page__details--downtime-list-table-header monitor-page__details--downtime-list-table-header-date">
												Date
											</th>
											<th className="monitor-page__details--downtime-list-table-header monitor-page__details--downtime-list-table-header-response-code">
												Response Code
											</th>
											<th className="monitor-page__details--downtime-list-table-header monitor-page__details--downtime-list-table-header-error-message">
												Error Message
											</th>
										</tr>
									</thead>
									<tbody className="monitor-page__details--downtime-list-table-body">
										{downHBs.map((heartbeat) => (
											<tr
												key={heartbeat.id}
												className="monitor-page__details--downtime-list-table-row"
											>
												<td
													className="monitor-page__details--downtime-list-table-row-cell"
													data-label="Date"
												>
													{new Date(heartbeat.createdAt).toLocaleString()}
												</td>
												<td
													className="monitor-page__details--downtime-list-table-row-cell"
													data-label="Response Code"
												>
													{heartbeat.responseCode || 'N/A'}
												</td>
												<td
													className="monitor-page__details--downtime-list-table-row-cell"
													data-label="Error Message"
												>
													{heartbeat.errorMessage || 'N/A'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>No downtime recorded in the last 30 days.</p>
							)}
						</div>
					</Section>
				</Section>
			</Page>
		</>
	);
};

export default MonitorDetails;
