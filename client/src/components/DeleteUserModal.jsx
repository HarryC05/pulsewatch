import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import { Modal, Button, Notice } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * DeleteUserModal component
 *
 * @param {object}   props          - Props for the component
 * @param {Function} props.onClose  - Function to close the modal
 * @param {string}   props.userId   - ID of the user to be deleted
 * @param {string}   props.username - Name of the user to be deleted
 *
 * @returns {JSX.Element} - Rendered component
 */
const DeleteUserModal = ({ onClose, userId, username }) => {
	const [confirmed, setConfirmed] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();

	/**
	 * Handle logout action
	 */
	const handleLogout = () => {
		axios
			.post(`${API}/api/v1/auth/logout`, {}, { withCredentials: true })
			.catch((err) => {
				console.error(err);
			});
	};

	/**
	 * Handle input change for confirmation
	 *
	 * @param {Event} e - The event object
	 */
	const handleConfirmInput = (e) => {
		const inputValue = e.target.value;
		if (inputValue === username) {
			setConfirmed(true);
		} else {
			setConfirmed(false);
		}
	};

	/**
	 * Handle delete user action
	 */
	const handleDelete = () => {
		axios
			.delete(`${API}/api/v1/account/${userId}`, { withCredentials: true })
			.then(() => {
				onClose();
				navigate('/');
				handleLogout();
			})
			.catch((err) => {
				console.error(err);
				setError('An error occurred while deleting the user.');
			});
	};

	return (
		<Modal onClose={onClose} title="Delete User">
			<div className="delete-user-modal">
				{error && <Notice variant="error" message={error} />}
				<p className="delete-user-modal__description">
					Are you sure you want to delete your account{' '}
					<strong>{username}</strong>?
				</p>
				<p className="delete-user-modal__warning">
					This action cannot be undone and will permanently delete all your
					data, including monitors, status pages, and any other associated
					information.
				</p>

				<div className="delete-user-modal__actions">
					<p className="delete-user-modal__confirm-text">
						Confirm by typing{' '}
						<code className="delete-user-modal__code">{username}</code> in the
						box below
					</p>
					<input
						type="text"
						placeholder={username}
						className="delete-user-modal__input"
						onChange={handleConfirmInput}
					/>

					<div className="delete-user-modal__buttons">
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

export default DeleteUserModal;
