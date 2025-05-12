import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import { Modal, Button, Notice } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * DeleteMonitorModal component
 *
 * @param {object}   props             - Props for the component
 * @param {Function} props.onClose     - Function to close the modal
 * @param {string}   props.monitorId   - ID of the monitor to be deleted
 * @param {string}   props.monitorName - Name of the monitor to be deleted
 *
 * @returns {JSX.Element} - Rendered component
 */
const DeleteMonitorModal = ({ onClose, monitorId, monitorName }) => {
	const [confirmed, setConfirmed] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();

	/**
	 * Handle input change for confirmation
	 *
	 * @param {Event} e - The event object
	 */
	const handleConfirmInput = (e) => {
		const inputValue = e.target.value;
		if (inputValue === monitorName) {
			setConfirmed(true);
		} else {
			setConfirmed(false);
		}
	};

	/**
	 * Handle delete monitor action
	 */
	const handleDelete = () => {
		axios
			.delete(`${API}/api/v1/monitor/${monitorId}`, { withCredentials: true })
			.then(() => {
				onClose();
				navigate('/dashboard');
			})
			.catch((err) => {
				console.error(err);
				setError('An error occurred while deleting the monitor.');
			});
	};

	return (
		<Modal onClose={onClose} title="Delete Monitor">
			<div className="delete-monitor-modal">
				{error && <Notice type="error" message={error} />}
				<p className="delete-monitor-modal__description">
					Are you sure you want to delete the monitor{' '}
					<strong>{monitorName}</strong>?
				</p>
				<p className="delete-monitor-modal__description">
					This action cannot be undone.
				</p>

				<div className="delete-monitor-modal__actions">
					<p>
						Confirm by typing{' '}
						<code className="delete-monitor-modal__code">{monitorName}</code> in
						the box below
					</p>
					<input
						type="text"
						placeholder={monitorName}
						className="delete-monitor-modal__input"
						onChange={handleConfirmInput}
					/>

					<div className="delete-monitor-modal__buttons">
						<Button variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button
							variant="dangerous"
							disabled={!confirmed}
							onClick={handleDelete}
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteMonitorModal;
