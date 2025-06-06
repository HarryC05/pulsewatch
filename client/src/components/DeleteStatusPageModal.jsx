import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import { Modal, Button, Notice } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * DeleteStatusPageModal component
 *
 * @param {object}   props          - Props for the component
 * @param {Function} props.onClose  - Function to close the modal
 * @param {string}   props.pageId   - ID of the status page to be deleted
 * @param {string}   props.pageSlug - Slug of the status page to be deleted
 * @param {string}   props.pageName - Name of the status page to be deleted
 *
 * @returns {JSX.Element} - Rendered component
 */
const DeleteStatusPageModal = ({ onClose, pageId, pageSlug, pageName }) => {
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
		if (inputValue === pageSlug) {
			setConfirmed(true);
		} else {
			setConfirmed(false);
		}
	};

	/**
	 * Handle delete status page action
	 */
	const handleDelete = () => {
		axios
			.delete(`${API}/api/v1/page/${pageId}`, { withCredentials: true })
			.then(() => {
				onClose();
				navigate('/pages');
			})
			.catch((err) => {
				console.error(err);
				setError('An error occurred while deleting the status page.');
			});
	};

	return (
		<Modal onClose={onClose} title="Delete Status Page">
			<div className="delete-status-page-modal">
				{error && <Notice type="error" message={error} />}
				<p className="delete-status-page-modal__description">
					Are you sure you want to delete the status page{' '}
					<strong>{pageName}</strong>?
				</p>
				<p className="delete-status-page-modal__description">
					This action cannot be undone.
				</p>

				<div className="delete-status-page-modal__actions">
					<p className="delete-status-page-modal__confirm-text">
						Confirm by typing{' '}
						<code className="delete-status-page-modal__code">{pageSlug}</code>{' '}
						in the box below
					</p>
					<input
						type="text"
						placeholder={pageSlug}
						className="delete-status-page-modal__input"
						onChange={handleConfirmInput}
					/>

					<div className="delete-status-page-modal__buttons">
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

export default DeleteStatusPageModal;
