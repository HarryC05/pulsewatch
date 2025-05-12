import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Page, Section, Card, Tag } from '../components';

const API = import.meta.env.VITE_API_URL;

/**
 * Pages component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Pages = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [pages, setPages] = useState([]);

	/**
	 * Fetches the list of pages
	 */
	const getPages = () => {
		axios
			.get(`${API}/api/v1/page/list`, { withCredentials: true })
			.then((res) => {
				setPages(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		axios
			.get(`${API}/api/v1/account/me`, { withCredentials: true })
			.then((res) => {
				if (res.data.user) {
					getPages();
					setLoading(false);
				} else {
					navigate('/login');
				}
			})
			.catch((err) => {
				navigate('/login');
			});
	}, [navigate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Page className="pages-page" title={`Pages (${pages.length}/1)`}>
			<div className="pages-page__content">
				<Section>
					<div className="pages-page__list">
						{pages.map((page) => (
							<Card className="pages-page__card">
								<h2>{page.title}</h2>
								<p>{page.description}</p>
								<p>Slug: {page.slug}</p>
								<Tag>Test</Tag>
								<button
									onClick={() => {
										navigate(`/statuses/${page.slug}`);
									}}
								>
									View Page
								</button>
							</Card>
						))}
					</div>
				</Section>
			</div>
		</Page>
	);
};

export default Pages;
