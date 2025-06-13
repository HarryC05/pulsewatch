import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
	Page,
	Section,
	Card,
	Tag,
	Icon,
	Button,
	CreatePageModal,
} from '../components';

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
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [user, setUser] = useState({});

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
					setUser(res.data.user);
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
		return <Page header="Loading..." title="PW | Loading..." />;
	}

	return (
		<>
			{showCreateModal && (
				<CreatePageModal onClose={() => setShowCreateModal(false)} />
			)}
			<Page className="pages-page" title="PW | Pages">
				<div className="pages-page__header">
					<h1 className="pages-page__header-title">{`Pages (${pages.length}/${user.statusPageLimit})`}</h1>
					<Button
						onClick={() => setShowCreateModal(true)}
						disabled={pages.length >= user.statusPageLimit}
					>
						Create Page
					</Button>
				</div>
				<div className="pages-page__content">
					<Section>
						<div className="pages-page__list">
							{pages.map((page) => (
								<Card
									className="pages-page__card"
									onClick={() => navigate(`/status/${page.slug}`)}
									key={page.id}
								>
									<div className="pages-page__card-header">
										<div className="pages-page__card-header-title">
											<h2>{page.title}</h2>
											<Tag
												className="pages-page__card-header-access-pill"
												variant={page.isPublic ? 'green' : 'red'}
											>
												{page.isPublic ? (
													<>
														<Icon icon="lockOpen" />
														Public
													</>
												) : (
													<>
														<Icon icon="lockClosed" />
														Private
													</>
												)}
											</Tag>
										</div>
										<Button
											className="pages-page__card-button"
											variant="secondary"
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												navigate(`/edit/${page.id}`);
											}}
										>
											Edit
										</Button>
									</div>
									<p className="pages-page__description">{page.description}</p>
								</Card>
							))}
						</div>
					</Section>
				</div>
			</Page>
		</>
	);
};

export default Pages;
