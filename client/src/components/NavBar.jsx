import { useEffect, useState } from 'react';
import axios from 'axios';

import { Button, Icon } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * NavBar component
 *
 * @returns {JSX.Element} - Rendered component
 */
const NavBar = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	/**
	 *
	 */
	const handleLogout = () => {
		axios
			.post(`${API}/api/v1/auth/logout`, {}, { withCredentials: true })
			.then(() => {
				setLoggedIn(false);
				window.location.href = '/';
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		const controller = new AbortController();
		axios
			.get(`${API}/api/v1/account/me`, {
				withCredentials: true,
				signal: controller.signal,
			})
			.then(() => {
				// User is already logged in
				setLoggedIn(true);
			})
			.catch((err) => {
				if (err.name !== 'CanceledError') {
					// No action needed
				}
			});

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<nav className="navbar">
			<div className="navbar__content">
				<img
					className="navbar__logo"
					src="/svgs/logo-dark.min.svg"
					alt="Logo"
				/>
				<ul className="navbar__links">
					<li>
						<a className="navbar__links-link" href="/">
							Home
						</a>
					</li>
					{loggedIn && (
						<>
							<li>
								<a className="navbar__links-link" href="/dashboard">
									Dashboard
								</a>
							</li>
							<li>
								<a className="navbar__links-link" href="/pages">
									Pages
								</a>
							</li>
							<li>
								<a className="navbar__links-link" href="/account">
									Account
								</a>
							</li>
							<li>
								<Button variant="text" onClick={handleLogout}>
									Logout
								</Button>
							</li>
						</>
					)}
					{!loggedIn && (
						<>
							<li>
								<a className="navbar__links-link" href="/login">
									Login
								</a>
							</li>
							<li>
								<a className="navbar__links-link" href="/login?signup=true">
									Sign Up
								</a>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
