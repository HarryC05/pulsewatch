import { useState, useEffect } from 'react';
import axios from 'axios';

import { Modal, Button } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * AddMonitorModal component
 *
 * @param {object}   props          - Component properties
 * @param {Function} props.onClose  - Function to handle modal close
 * @param {Function} props.onAdd    - Function to handle adding a monitor
 * @param {Array}    props.existing - Array of existing monitors to avoid duplicates
 *
 * @returns {JSX.Element} - Rendered Add Monitor modal
 */
const AddMonitorModal = ({ onClose, onAdd, existing }) => {
	const [loading, setLoading] = useState(true);
	const [monitors, setMonitors] = useState([]);

	useEffect(() => {
		axios
			.get(`${API}/api/v1/monitor/list`, { withCredentials: true })
			.then((res) => {
				const filteredMonitors = res.data.filter(
					(monitor) => !existing.some((e) => e.id === monitor.id)
				);
				setMonitors(
					filteredMonitors.map((monitor) => ({
						id: monitor.id,
						name: monitor.name,
						url: monitor.url,
						status: monitor.latest.status,
					}))
				);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return (
			<Modal onClose={onClose} title="Add Monitor">
				<div className="add-monitor-modal">
					<p>Loading monitors...</p>
				</div>
			</Modal>
		);
	}

	return (
		<Modal onClose={onClose} title="Add Monitor" className="add-monitor-modal">
			<p>Select a monitor to add:</p>
			{monitors.length > 0 ? (
				<ul className="add-monitor-modal__list">
					{monitors.map((monitor) => (
						<li key={monitor.id} className="add-monitor-modal__item">
							<span>
								{monitor.name} - {monitor.url}
							</span>
							<Button
								onClick={() => {
									onAdd(monitor);
									// remove the monitor from the list after adding
									setMonitors((prev) =>
										prev.filter((m) => m.id !== monitor.id)
									);
								}}
								className="add-monitor-modal__button"
							>
								Add
							</Button>
						</li>
					))}
				</ul>
			) : (
				<p>No monitors available to add.</p>
			)}
		</Modal>
	);
};

export default AddMonitorModal;
