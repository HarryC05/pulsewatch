import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { unameRegex, emailRegex, passwordRegex } from '../../../shared/regex';
import { Notice, Button, Icon, Page } from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * Login Page component
 *
 * @returns {JSX.Element} - Rendered component
 */
function Login() {
	const [email, setEmail] = useState('');
	const [identifier, setIdentifier] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [signup, setSignup] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const navigate = useNavigate();

	/**
	 * Handle login/signup
	 *
	 * @param {Event} e - The event object
	 */
	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');

		if (signup) {
			try {
				if (password !== confirmPassword) {
					setError('Passwords do not match');
					return;
				}

				await axios.post(
					`${API}/api/v1/auth/signup`,
					{ username, email, password },
					{ withCredentials: true }
				);

				setSuccess('Signup successful! Please login.');
				setTimeout(() => {
					setSuccess('');
				}, 3000);

				// Reset form fields
				setIdentifier(username);
				setUsername('');
				setEmail('');
				setSignup(false);
				setPassword('');
				setConfirmPassword('');
				return;
			} catch (err) {
				// Get the error message from the response
				const errorMessage = err.response?.data?.message || 'An error occurred';
				setError(errorMessage);
				setSuccess('');
				setPassword('');
				setConfirmPassword('');
				return;
			}
		}

		// Login
		try {
			const res = await axios.post(
				`${API}/api/v1/auth/login`,
				{ identifier, password },
				{ withCredentials: true }
			);
			if (res.data.success) {
				navigate('/dashboard');
			} else {
				setError('Invalid credentials');
				setSuccess('');
				setPassword('');
				setConfirmPassword('');
			}
		} catch (err) {
			setError('Invalid credentials');
			setSuccess('');
			setPassword('');
			setConfirmPassword('');
		}
	};

	/**
	 * Handle username input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUsername(value);

		if (!unameRegex.pattern.test(value)) {
			setUsernameError(unameRegex.err);
		} else {
			setUsernameError('');
		}
	};

	/**
	 * Handle email input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);

		if (!emailRegex.pattern.test(value)) {
			setEmailError(emailRegex.err);
		} else {
			setEmailError('');
		}
	};

	/**
	 * Handle password input change
	 *
	 * @param {Event} e - The event object
	 */
	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);

		if (!passwordRegex.pattern.test(value)) {
			setPasswordError(passwordRegex.err);
		} else {
			setPasswordError('');
		}

		if (value !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
		} else {
			setConfirmPasswordError('');
		}
	};

	/**
	 * Handle confirm password input change
	 *
	 * @param {Event} e - The event object
	 */
	const handleConfirmPasswordChange = (e) => {
		const value = e.target.value;
		setConfirmPassword(value);

		if (value !== password) {
			setConfirmPasswordError('Passwords do not match');
		} else {
			setConfirmPasswordError('');
		}
	};

	// Check if the user is already logged in
	useEffect(() => {
		const controller = new AbortController();
		axios
			.get(`${API}/api/v1/account/me`, {
				withCredentials: true,
				signal: controller.signal,
			})
			.then(() => {
				// User is already logged in
				navigate('/dashboard');
			})
			.catch((err) => {
				if (err.name !== 'CanceledError') {
					const urlParams = new URLSearchParams(window.location.search);
					const isSignup = urlParams.get('signup');
					if (isSignup) {
						setSignup(true);
					}
				}
			});

		return () => {
			controller.abort();
		};
	}, [navigate]);

	return (
		<Page className="login-page">
			<div className="login-page__container">
				<a href="/">
					<img
						src="/svgs/logo-dark.min.svg"
						alt="Logo"
						className="login-page__logo"
					/>
				</a>
				<div className="login-page__login-signup">
					<button
						className={`login-page__login-signup-button${!signup ? ' login-page__login-signup-button--active' : ''}`}
						onClick={() => {
							setSignup(false);
							setError('');
							setSuccess('');
							setPassword('');
							setConfirmPassword('');
						}}
					>
						<h2 className="login-page__login-signup-button--text">Login</h2>
					</button>
					<button
						className={`login-page__login-signup-button${signup ? ' login-page__login-signup-button--active' : ''}`}
						onClick={() => {
							setSignup(true);
							setError('');
							setSuccess('');
							setPassword('');
							setConfirmPassword('');
						}}
					>
						<h2 className="login-page__login-signup-button--text">Signup</h2>
					</button>
				</div>
				{error && <Notice message={error} variant="error" />}
				{success && <Notice message={success} variant="success" />}
				<form onSubmit={handleLogin} className="login-page__form">
					{signup && (
						<>
							<input
								type="text"
								placeholder="Username"
								value={username}
								onChange={handleUsernameChange}
								className="login-page__form-input"
								required
							/>
							{usernameError && (
								<Notice message={usernameError} variant="error" />
							)}
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={handleEmailChange}
								className="login-page__form-input"
								required
							/>
							{emailError && <Notice message={emailError} variant="error" />}
						</>
					)}
					{!signup && (
						<input
							type="text"
							placeholder="Email/Username"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							className="login-page__form-input"
							required
						/>
					)}
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={handlePasswordChange}
						className="login-page__form-input"
						required
					/>
					{passwordError && signup && (
						<Notice message={passwordError} variant="error" />
					)}
					{signup && (
						<>
							<input
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={handleConfirmPasswordChange}
								className="login-page__form-input"
								required
							/>
							{confirmPasswordError && (
								<Notice message={confirmPasswordError} variant="error" />
							)}
						</>
					)}
					<Button
						type="submit"
						variant="primary"
						disabled={
							(signup &&
								(!username || !email || !password || !confirmPassword)) ||
							(signup &&
								(usernameError ||
									emailError ||
									passwordError ||
									confirmPasswordError)) ||
							(!signup && (!identifier || !password))
						}
					>
						{signup ? 'Signup' : 'Login'}
					</Button>
				</form>
			</div>
		</Page>
	);
}

export default Login;
