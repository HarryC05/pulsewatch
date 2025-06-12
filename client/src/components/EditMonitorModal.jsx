import { useState } from 'react';
import axios from 'axios';

import { urlRegex, nameRegex } from '../../../shared/regex';
import { Modal, Notice, Button } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * Edit Monitor Modal component
 *
 * @param {object}   props            - Props for the component
 * @param {Function} props.onClose    - Function to close the modal
 * @param {object}   props.monitor    - Monitor object to be edited
 * @param {Function} props.getMonitor - Function to fetch the monitor data
 *
 * @returns {JSX.Element} - Rendered component
 */
const EditMonitorModal = ({ onClose, monitor, getMonitor }) => {
	const [tmpMonitor, setTmpMonitor] = useState(monitor);
	const [nameError, setNameError] = useState('');
	const [urlError, setUrlError] = useState('');

	/**
	 *
	 */
	const onSave = () => {
		axios
			.put(`${API}/api/v1/monitor/${monitor.id}`, tmpMonitor, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					onClose();
					getMonitor();
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	/**
	 * Handle name input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleNameChange = (e) => {
		const value = e.target.value;

		// Validate monitor name
		if (!nameRegex.pattern.test(value)) {
			setNameError(nameRegex.err);
		} else {
			setNameError('');
		}

		setTmpMonitor({ ...tmpMonitor, name: value });
	};

	/**
	 * Handle URL input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleUrlChange = (e) => {
		const value = e.target.value;

		// Validate URL
		if (!urlRegex.pattern.test(value)) {
			setUrlError(urlRegex.err);
		} else {
			setUrlError('');
		}

		setTmpMonitor({ ...tmpMonitor, url: value });
	};

	return (
		<Modal onClose={onClose} title="Edit Monitor">
			<div className="edit-monitor-modal__inputs">
				<label className="edit-monitor-modal__label" htmlFor="monitor-name">
					Monitor Name
				</label>
				<input
					className="edit-monitor-modal__input"
					type="text"
					id="monitor-name"
					value={tmpMonitor.name}
					onChange={handleNameChange}
					maxLength={32}
				/>
				{nameError && <Notice message={nameError} variant="error" />}
				<label className="edit-monitor-modal__label" htmlFor="monitor-url">
					Monitor URL
				</label>
				<input
					className="edit-monitor-modal__input"
					type="text"
					id="monitor-url"
					value={tmpMonitor.url}
					onChange={handleUrlChange}
				/>
				{urlError && <Notice message={urlError} variant="error" />}
			</div>
			<div className="edit-monitor-modal__footer">
				<Button
					onClick={onSave}
					disabled={
						(tmpMonitor.name === monitor.name &&
							tmpMonitor.url === monitor.url) ||
						nameError ||
						urlError
					}
				>
					Save
				</Button>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
};

export default EditMonitorModal;
