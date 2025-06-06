import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
	CreateMonitorModal,
	UptimePill,
	Section,
	Card,
	Button,
	Page,
} from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * Dashboard Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Dashboard = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [monitors, setMonitors] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);

	/**
	 * Fetches the list of monitors for the user
	 */
	const getMonitors = () => {
		axios
			.get(`${API}/api/v1/monitor/list`, { withCredentials: true })
			.then((res) => {
				setMonitors(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		axios
			.get(`${API}/api/v1/account/me`, { withCredentials: true })
			.then((res) => {
				setUser(res.data.user);
				setLoading(false);
			})
			.catch((err) => {
				navigate('/login');
			});

		getMonitors();
	}, [navigate]);

	// Polling for monitor updates every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			getMonitors();
		}, 30000);
		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return <Page header="Loading..." title="PW | Loading..." />;
	}

	return (
		<>
			{showCreateModal && (
				<CreateMonitorModal
					onClose={() => {
						setShowCreateModal(false);
					}}
					onCreate={() => {
						setShowCreateModal(false);
						getMonitors();
					}}
				/>
			)}
			<Page
				className="dashboard-page"
				heading={`Welcome ${user?.username}!`}
				title="PW | Dashboard"
			>
				<Section className="dashboard__content">
					<div className="dashboard__content-header">
						<div className="dashboard__content-header-title">
							<h2>Your Monitors</h2>
							<h4>({monitors.length}/10)</h4>
						</div>
						<Button variant="primary" onClick={() => setShowCreateModal(true)}>
							+ Add Monitor
						</Button>
					</div>
					<div className="dashboard__content-summary">
						<Card className="dashboard__content-summary-item">
							<h3>Total Monitors</h3>
							<h4>{monitors.length}</h4>
						</Card>
						<Card className="dashboard__content-summary-item">
							<h3>Online</h3>
							<h4 className="text-light-green">
								{monitors.filter((m) => m.latest.status === 'up').length}
							</h4>
						</Card>
						<Card className="dashboard__content-summary-item">
							<h3>Offline</h3>
							<h4 className="text-red">
								{monitors.filter((m) => m.latest.status === 'down').length}
							</h4>
						</Card>
						<Card className="dashboard__content-summary-item">
							<h3>Unknown</h3>
							<h4>
								{monitors.filter((m) => m.latest.status === 'unknown').length}
							</h4>
						</Card>
					</div>
					<table className="dashboard__table">
						<thead>
							<tr>
								<th>Status</th>
								<th>Name</th>
								<th>URL</th>
								<th title="Uptime is calculated based on the last 7 days of heartbeats">
									Uptime (%)
								</th>
								<th>Response Time</th>
								<th>Last Checked</th>
							</tr>
						</thead>
						<tbody className="dashboard__table-body">
							{monitors.map((monitor) => (
								<tr
									className="dashboard__table-row"
									key={monitor.id}
									onClick={(e) =>
										!e.target.classList.contains('dashboard__table-link') &&
										navigate(`/monitor/${monitor.id}`)
									}
								>
									<td className="dashboard__table-cell">
										<span
											className={`dashboard__table-status ${monitor.latest.status === 'up' ? 'bg-green' : monitor.latest.status === 'down' ? 'bg-red' : ''}`}
											title={monitor.latest.status}
										/>
									</td>
									<td className="dashboard__table-cell">{monitor.name}</td>
									<td className="dashboard__table-cell">
										<a
											className="dashboard__table-link"
											href={monitor.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{monitor.url}
										</a>
									</td>
									<td className="dashboard__table-cell">
										<UptimePill uptime={monitor.uptime} />
									</td>
									<td className="dashboard__table-cell">
										{monitor.latest.responseTime
											? `${monitor.latest.responseTime} ms`
											: 'N/A'}
									</td>
									<td className="dashboard__table-cell">
										{monitor.lastChecked
											? new Date(monitor.lastChecked).toLocaleString()
											: 'N/A'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Section>
			</Page>
		</>
	);
};

export default Dashboard;
