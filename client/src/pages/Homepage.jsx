import { useNavigate } from 'react-router-dom';

import { Button, Card, Icon, Page, Section, Tag } from '../components';

/**
 * Homepage component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Homepage = () => {
	const navigate = useNavigate();

	return (
		<>
			<Page className="homepage">
				<div className="homepage--hero" data-width="full">
					<h1>Monitor your uptime. Share it with the world.</h1>
					<p>
						Show users when you’re up, not just when you’re down. Monitor your
						services and share real-time status pages effortlessly.
					</p>
					<Button
						variant="primary"
						onClick={() => navigate('/login?signup=true')}
					>
						Start Monitoring Now!
					</Button>
				</div>
				<Section className="homepage__features">
					<h2>Everything you need to keep your services online</h2>
					<div className="homepage__features-grid">
						<Card className="homepage__feature-card">
							<Icon icon="userCheck" className="homepage__feature-icon" />
							<h3>Free Accounts (Ad-Supported)</h3>
							<p>
								No cost to start, your service is monitored in minutes. Ads keep
								the free tier running.
							</p>
						</Card>

						<Card className="homepage__feature-card">
							<Icon icon="monitor" className="homepage__feature-icon" />
							<h3>Up to 10 HTTP/S Monitors</h3>
							<p>
								Track up to ten different URLs/IPs with one account. One check
								every 5 minutes.
							</p>
						</Card>

						<Card className="homepage__feature-card">
							<Icon icon="fileChecked" className="homepage__feature-icon" />
							<h3>Single Status Page</h3>
							<p>
								Create one status page with a custom title, slug, and
								description. Public or private.
							</p>
						</Card>

						<Card className="homepage__feature-card">
							<Icon icon="clockActivity" className="homepage__feature-icon" />
							<h3>5-Minute Heartbeats</h3>
							<p>
								Pulse Watch pings your endpoints every 5 minutes, keeping
								overhead to a minimum.
							</p>
						</Card>

						<Card className="homepage__feature-card">
							<Icon icon="bell" className="homepage__feature-icon" />
							<h3>Email Alerts</h3>
							<p>
								Instant email notifications the moment a monitor goes down or
								comes back up.
							</p>
						</Card>

						<Card className="homepage__feature-card">
							<Icon icon="calendar" className="homepage__feature-icon" />
							<h3>1 Year of History</h3>
							<p>
								All uptime/response data is retained for up to 12 months, so you
								can spot long-term trends.
							</p>
						</Card>
					</div>
				</Section>
				<Section className="homepage__coming-soon">
					<h2 className="homepage__features-coming-soon-heading">
						Coming Soon
					</h2>
					<div className="homepage__features-grid homepage__features-grid--upcoming">
						<Card className="homepage__feature-card homepage__feature-card--upcoming">
							<Icon icon="dollarCircle" className="homepage__feature-icon" />
							<h3>Paid Tiers & More Monitors</h3>
							<p>
								Unlock higher limits, faster check intervals, and ad-free usage
								with our Pro plans.
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card--upcoming">
							<Icon icon="layers" className="homepage__feature-icon" />
							<h3>Custom Branding</h3>
							<p>
								Add your logo and colors to your status page so it always looks
								like “you.”
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card--upcoming">
							<Icon icon="users" className="homepage__feature-icon" />
							<h3>Organization & Team Support</h3>
							<p>
								Invite teammates, assign roles, and manage monitors at an
								organizational level.
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card--upcoming">
							<Icon icon="zap" className="homepage__feature-icon" />
							<h3>Slack, Webhooks, SMS Alerts</h3>
							<p>
								Choose from multiple alert channels so the right people get
								pinged however you like it.
							</p>
						</Card>
					</div>
				</Section>
			</Page>
		</>
	);
};

export default Homepage;
