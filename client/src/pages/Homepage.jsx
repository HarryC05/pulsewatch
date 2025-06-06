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
				<div className="homepage__hero" data-width="full">
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
							<h3>Free (Ad-Supported)</h3>
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
					<p className="homepage__features-coming-soon-subheading">
						We’re working on some exciting new features to make Pulse Watch even
						better. Here’s a sneak peek at what’s coming next:
					</p>
					<div className="homepage__features-grid homepage__features-grid__upcoming">
						<Card className="homepage__feature-card homepage__feature-card__upcoming">
							<Icon icon="dollarCircle" className="homepage__feature-icon" />
							<h3>Paid Tiers & More Monitors</h3>
							<p>
								Unlock higher limits, faster check intervals, and ad-free usage
								with our Pro plans.
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card__upcoming">
							<Icon icon="layers" className="homepage__feature-icon" />
							<h3>Custom Branding</h3>
							<p>
								Add your logo and colors to your status page so it always looks
								like “you.”
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card__upcoming">
							<Icon icon="users" className="homepage__feature-icon" />
							<h3>Organization & Team Support</h3>
							<p>
								Invite teammates, assign roles, and manage monitors at an
								organizational level.
							</p>
						</Card>

						<Card className="homepage__feature-card homepage__feature-card__upcoming">
							<Icon icon="zap" className="homepage__feature-icon" />
							<h3>Slack, Webhooks, SMS Alerts</h3>
							<p>
								Choose from multiple alert channels so the right people get
								pinged however you like it.
							</p>
						</Card>
					</div>
				</Section>
				<Section className="homepage__how-it-works" data-width="narrow">
					<h2>How It Works</h2>

					<div className="homepage__how-it-works-steps">
						<Card className="homepage__how-it-works-step">
							<Icon icon="plusCircle" className="homepage__step-icon" />
							<h3>Add a Monitor</h3>
							<p>Enter any HTTP/S URL, set a name, and save.</p>
						</Card>

						<Card className="homepage__how-it-works-step">
							<Icon icon="monitor" className="homepage__step-icon" />
							<h3>See Live Status</h3>
							<p>
								View real‐time uptime metrics and response times for each
								monitor.
							</p>
						</Card>

						<Card className="homepage__how-it-works-step">
							<Icon icon="share" className="homepage__step-icon" />
							<h3>Share Your Status Page</h3>
							<p>
								Publish a custom status page (public or private) so your users
								always know you’re up.
							</p>
						</Card>
					</div>
				</Section>
				<Section className="homepage__pricing" data-width="narrow">
					<h2>Simple, Transparent Plans</h2>

					<div className="homepage__pricing-grid">
						{/* Free Tier */}
						<Card className="homepage__pricing-card pricing__free">
							<h3>Free</h3>
							<p className="homepage__price-amount">$0 / month</p>
							<ul>
								<li>Up to 10 HTTP/S monitors</li>
								<li>5-minute check interval</li>
								<li>Email alerts</li>
								<li>1 year of history</li>
							</ul>
							<Button
								variant="secondary"
								onClick={() => navigate('/login?signup=true')}
							>
								Get Started Free
							</Button>
						</Card>

						{/* Pro Tier (Coming Soon) */}
						<Card className="homepage__pricing-card pricing__upcoming">
							<Tag className="homepage__pricing-tag">Coming Soon</Tag>
							<h3>Pro</h3>
							<p className="homepage__price-amount">$15 / month</p>
							<ul>
								<li>Up to 50 monitors</li>
								<li>1-minute check interval</li>
								<li>Slack, Webhook & SMS alerts</li>
								<li>Custom branding</li>
								<li>Team & organization support</li>
							</ul>
							<Button variant="secondary" disabled>
								Launching Soon
							</Button>
						</Card>
					</div>
				</Section>
			</Page>
		</>
	);
};

export default Homepage;
