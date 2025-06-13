import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { unameRegex, emailRegex, passwordRegex } from '../../../shared/regex';
import { Notice, Section, Button, Page, DeleteUserModal } from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * Account Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Account = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [updatedUser, setUpdatedUser] = useState({});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [changePasswordError, setChangePasswordError] = useState('');
	const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
	const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

	/**
	 * Update user information
	 *
	 * @param {object} user - User object containing updated information
	 */
	const updateUser = (user) => {
		axios
			.put(`${API}/api/v1/account/me`, user, { withCredentials: true })
			.then((res) => {
				setUser(res.data.user);
				setUpdatedUser({
					username: res.data.user.username,
					email: res.data.user.email,
				});
				setSuccess('Account updated successfully!');
				setTimeout(() => {
					setSuccess('');
				}, 3000);
				setError('');
			})
			.catch((err) => {
				const errorMessage = err.response?.data?.message || 'An error occurred';
				setError(errorMessage);
				setSuccess('');
			});
	};

	/**
	 * Handle username input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUpdatedUser({ ...updatedUser, username: value });

		if (!unameRegex.pattern.test(value)) {
			setNameError(unameRegex.err);
		} else {
			setNameError('');
		}
	};

	/**
	 * Handle email input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleEmailChange = (e) => {
		const value = e.target.value;
		setUpdatedUser({ ...updatedUser, email: value });

		if (!emailRegex.pattern.test(value)) {
			setEmailError(emailRegex.err);
		} else {
			setEmailError('');
		}
	};

	/**
	 * Handle new password input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleNewPasswordChange = (e) => {
		const value = e.target.value;
		setNewPassword(value);

		if (!passwordRegex.pattern.test(value)) {
			setPasswordError(passwordRegex.err);
			return;
		}

		if (newPassword && currentPassword && newPassword === confirmPassword) {
			setPasswordError('Password cannot be the same as current password');
			return;
		}

		setPasswordError('');
	};

	/**
	 * Handle password update
	 */
	const handleUpdatePassword = () => {
		if (!newPassword || newPassword !== confirmPassword) {
			setPasswordError('Passwords do not match');
			return;
		}

		const data = {
			currentPassword,
			newPassword,
		};

		axios
			.put(`${API}/api/v1/account/change-password`, data, {
				withCredentials: true,
			})
			.then(() => {
				setChangePasswordSuccess('Password updated successfully!');
				setTimeout(() => {
					setChangePasswordSuccess('');
				}, 3000);
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
				setPasswordError('');
			})
			.catch((err) => {
				console.log(err);
				const errorMessage = err.response?.data?.message || 'An error occurred';
				setChangePasswordError(errorMessage);
				setTimeout(() => {
					setChangePasswordError('');
				}, 3000);
				setChangePasswordSuccess('');
			});
	};

	useEffect(() => {
		axios
			.get(`${API}/api/v1/account/me`, { withCredentials: true })
			.then((res) => {
				setUser(res.data.user);
				setUpdatedUser({
					username: res.data.user.username,
					email: res.data.user.email,
				});
				setLoading(false);
			})
			.catch(() => {
				navigate('/login');
			});
	}, [navigate]);

	if (loading) {
		return <Page header="Loading..." title="PW | Loading..." />;
	}

	return (
		<>
			{deleteAccountModalOpen && (
				<DeleteUserModal
					onClose={() => setDeleteAccountModalOpen(false)}
					userId={user.id}
					username={user.username}
				/>
			)}
			<Page className="account-page" header="Account" title="PW | Account">
				<Section className="account__content">
					<h2 className="account__title">Your Information</h2>
					{error && <Notice message={error} variant="error" />}
					{success && <Notice message={success} variant="success" />}
					<div className="account__info">
						<label>Username:</label>
						<input
							type="text"
							value={updatedUser.username}
							onChange={handleUsernameChange}
							maxLength={32}
						/>
						{nameError && (
							<Notice
								message={nameError}
								variant="error"
								className="account__info-notice"
							/>
						)}
						<label>Email:</label>
						<input
							type="email"
							value={updatedUser.email}
							onChange={handleEmailChange}
						/>
						{emailError && (
							<Notice
								message={emailError}
								variant="error"
								className="account__info-notice"
							/>
						)}
					</div>
					<Button
						variant="primary"
						disabled={
							(updatedUser.username === user.username &&
								updatedUser.email === user.email) ||
							nameError ||
							emailError
						}
						onClick={() => updateUser(updatedUser)}
					>
						Update
					</Button>
				</Section>
				<Section className="account__actions">
					<h2 className="account__title">Actions</h2>
					{changePasswordError && (
						<Notice
							message={changePasswordError}
							variant="error"
							className="account__actions-notice"
						/>
					)}
					{changePasswordSuccess && (
						<Notice
							message={changePasswordSuccess}
							variant="success"
							className="account__actions-notice"
						/>
					)}
					<h3>Change Password</h3>
					<div className="account__actions-change-password">
						<label>Current Password:</label>
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
						<label>New Password:</label>
						<input
							type="password"
							value={newPassword}
							onChange={handleNewPasswordChange}
						/>
						{passwordError && (
							<Notice
								message={passwordError}
								variant="error"
								className="account__actions-change-password-notice"
							/>
						)}
						<label>Confirm New Password:</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						{newPassword &&
							confirmPassword &&
							newPassword !== confirmPassword && (
								<Notice
									message="Passwords do not match"
									variant="error"
									className="account__actions-change-password-notice"
								/>
							)}
					</div>
					<Button
						variant="primary"
						disabled={
							!newPassword ||
							newPassword !== confirmPassword ||
							passwordError ||
							currentPassword === newPassword
						}
						onClick={handleUpdatePassword}
					>
						Update Password
					</Button>

					<Button
						variant="dangerous"
						onClick={() => setDeleteAccountModalOpen(true)}
					>
						Delete Account
					</Button>
				</Section>
			</Page>
		</>
	);
};

export default Account;
