import { Icon } from './';

/**
 * Footer component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Footer = () => {
	return (
		<footer className="footer">
			<small className="footer__copy">
				&copy; {new Date().getFullYear()} Pulse Watch. All rights reserved.
			</small>
			<div className="footer__legal">
				<a href="/privacy" className="footer__link">
					Privacy Policy
				</a>
				<a href="/terms" className="footer__link">
					Terms & Conditions
				</a>
			</div>
			<div className="footer__socials">
				<a
					href="https://www.instagram.com/getpulsewatch/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Pulse Watch on Instagram"
					className="footer__social-link"
				>
					<Icon icon="instagram" className="footer__social-icon" />
				</a>
				<a
					href="https://bsky.app/profile/pulsewatch.bsky.social"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Pulse Watch on Bluesky"
					className="footer__social-link"
				>
					<Icon icon="bluesky" className="footer__social-icon" />
				</a>
			</div>
		</footer>
	);
};

export default Footer;
