import { useState } from 'react';
import axios from 'axios';

import { urlRegex, nameRegex } from '../../shared/regex';
import { Modal, Notice, Button } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * CreateMonitorModal component
 *
 * @param {object}   props          - Props for the component
 * @param {Function} props.onClose  - Function to close the modal
 * @param {Function} props.onCreate - Function to handle monitor creation
 *
 * @returns {JSX.Element} - Rendered component
 */
const CreateMonitorModal = ({ onClose, onCreate }) => {
	const [monitor, setMonitor] = useState({
		name: '',
		url: '',
	});
	const [disabled, setDisabled] = useState({ url: true, name: true });
	const [nameError, setNameError] = useState('');
	const [urlError, setUrlError] = useState('');
	const [error, setError] = useState('');

	/**
	 * Handle monitor creation
	 */
	const handleCreateMonitor = async () => {
		if (!monitor.name.trim() || !monitor.url.trim()) {
			return;
		}

		try {
			await axios.post(`${API}/api/v1/monitor/create`, monitor, {
				withCredentials: true,
			});
			onCreate();
			onClose();
		} catch (error) {
			console.error('Error creating monitor:', error);
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError('An error occurred while creating the monitor.');
			}
		}
	};

	/**
	 * Handle name input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleNameChange = (e) => {
		const value = e.target.value;
		setMonitor({ ...monitor, name: value });

		if (!nameRegex.pattern.test(value)) {
			setNameError(nameRegex.err);
			setDisabled({ ...disabled, name: true });
		} else {
			setNameError('');
			setDisabled({ ...disabled, name: false });
		}
	};

	/**
	 * Handle URL input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleUrlChange = (e) => {
		const value = e.target.value;
		setMonitor({ ...monitor, url: value });

		if (urlRegex.pattern.test(value)) {
			setUrlError('');
			setDisabled({ ...disabled, url: false });
		} else {
			setUrlError(urlRegex.err);
			setDisabled({ ...disabled, url: true });
		}
	};

	return (
		<Modal onClose={onClose} title="Create Monitor">
			{error && <Notice message={error} variant="error" />}
			<div className="create-monitor-modal__inputs">
				<label htmlFor="monitor-name">Monitor Name</label>
				<input
					type="text"
					id="monitor-name"
					className="create-monitor-modal__input"
					value={monitor.name}
					onChange={handleNameChange}
					maxLength={32}
				/>
				{nameError && (
					<Notice
						message={nameError}
						variant="error"
						className="create-monitor-modal__input--error"
					/>
				)}
				<label htmlFor="monitor-url">Monitor URL</label>
				<input
					type="text"
					id="monitor-url"
					className="create-monitor-modal__input"
					value={monitor.url}
					onChange={handleUrlChange}
				/>
				{urlError && (
					<Notice
						message={urlError}
						variant="error"
						className="create-monitor-modal__input--error"
					/>
				)}
			</div>
			<div className="create-monitor-modal__footer">
				<Button
					onClick={handleCreateMonitor}
					disabled={disabled.url || disabled.name}
				>
					Create Monitor
				</Button>
			</div>
		</Modal>
	);
};

export default CreateMonitorModal;
