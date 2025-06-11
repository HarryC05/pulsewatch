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
	const [menuOpen, setMenuOpen] = useState(false);

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
				<a href="/">
					<Icon icon="logoDark" className="navbar__logo" />
				</a>
				<button
					className="navbar__toggle"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="Toggle menu"
				>
					<Icon icon="menu" className="navbar__toggle-icon" />
				</button>
				<ul
					className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}
				>
					<li className="navbar__links-link">
						<button
							className="navbar__links--close"
							onClick={() => setMenuOpen(false)}
							aria-label="Close menu"
						>
							<Icon icon="close" className="navbar__links--close-icon" />
						</button>
					</li>
					<li className="navbar__links-link">
						<a href="/">Home</a>
					</li>
					{loggedIn && (
						<>
							<li className="navbar__links-link">
								<a href="/dashboard">Dashboard</a>
							</li>
							<li className="navbar__links-link">
								<a href="/pages">Pages</a>
							</li>
							<li className="navbar__links-link">
								<a href="/account">Account</a>
							</li>
							<li className="navbar__links-link">
								<Button variant="text" onClick={handleLogout}>
									Logout
								</Button>
							</li>
						</>
					)}
					{!loggedIn && (
						<>
							<li className="navbar__links-link">
								<a href="/login">Login</a>
							</li>
							<li className="navbar__links-link">
								<a
									className="navbar__links-link-anchor"
									href="/login?signup=true"
								>
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
