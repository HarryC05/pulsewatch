import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { unameRegex, emailRegex } from '../../../shared/regex';
import { Notice, Section, Button, Page } from '../components';

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
		</Page>
	);
};

export default Account;
