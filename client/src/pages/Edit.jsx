import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
	Page,
	Notice,
	Button,
	Section,
	Icon,
	MonitorItem,
	AddMonitorModal,
	VisibilityToggle,
	DeleteStatusPageModal,
} from '../components';
import { nameRegex, descRegex, slugRegex } from '../../../shared/regex';

const API = import.meta.env.VITE_API_URL;

/**
 * Edit component
 *
 * @returns {JSX.Element} - Rendered component
 */
const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [pageData, setPageData] = useState(null);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [information, setInformation] = useState('');
	const [edited, setEdited] = useState(false);
	const [editedPage, setEditedPage] = useState(null);
	const [titleError, setTitleError] = useState('');
	const [slugError, setSlugError] = useState('');
	const [descError, setDescError] = useState('');
	const [addMonitorModalOpen, setAddMonitorModalOpen] = useState(false);
	const [deletePageModalOpen, setDeletePageModalOpen] = useState(false);

	/**
	 * Fetch page data
	 */
	const getPageData = () => {
		axios
			.get(`${API}/api/v1/page/${id}`, { withCredentials: true })
			.then((res) => {
				setPageData(res.data);
				const initialPageData = {
					title: res.data.title,
					desc: res.data.description,
					isPublic: res.data.isPublic,
					slug: res.data.slug,
					monitors: res.data.monitors.map((monitor) => ({
						id: monitor.id,
						name: monitor.name,
						url: monitor.url,
						status: monitor.status,
					})),
				};
				setEditedPage(initialPageData);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					navigate('/login');
				} else {
					setLoading(false);
					setError('An error occurred while fetching monitor details.');
					console.error(err);
				}
			});
	};

	/**
	 * Handle save action
	 */
	const onSave = () => {
		setInformation('Saving changes...');
		setSuccess('');
		setError('');
		if (!editedPage || !pageData) return;

		if (titleError || descError) {
			alert('Please fix the errors before saving.');
			return;
		}

		const updatedPage = {
			title: editedPage.title,
			slug: editedPage.slug,
			description: editedPage.desc,
			isPublic: editedPage.isPublic,
			monitors: editedPage.monitors.map((monitor) => monitor.id),
		};

		axios
			.put(`${API}/api/v1/page/${id}`, updatedPage, { withCredentials: true })
			.then(() => {
				setEdited(false);
				setError('');
				setInformation('');
				setSuccess('Page updated successfully!');
				setPageData((prev) => ({
					...prev,
					title: editedPage.title,
					slug: editedPage.slug,
					description: editedPage.desc,
					isPublic: editedPage.isPublic,
					monitors: editedPage.monitors.map((monitor) => ({
						id: monitor.id,
						name: monitor.name,
						url: monitor.url,
						status: monitor.status,
					})),
				}));
			})
			.catch((err) => {
				setInformation('');
				setSuccess('');
				if (err.response.status === 401) {
					navigate('/login');
				} else if (err.response.status === 400) {
					setError(err.response.data.message);
				} else {
					setError('An error occurred while saving the page.');
				}
				console.error(err);
			});
	};

	/**
	 * Handle title change
	 *
	 * @param {object} e - Event object
	 */
	const onTitleChange = (e) => {
		const newTitle = e.target.value;
		setEditedPage({ ...editedPage, title: newTitle });

		if (nameRegex.pattern.test(newTitle)) {
			setTitleError('');
		} else {
			setTitleError(nameRegex.err);
		}
	};

	/**
	 * Handle slug change
	 *
	 * @param {object} e - Event object
	 */
	const onSlugChange = (e) => {
		const newSlug = e.target.value;
		setEditedPage({ ...editedPage, slug: newSlug });

		if (slugRegex.pattern.test(newSlug)) {
			setSlugError('');
		} else {
			setSlugError(slugRegex.err);
		}
	};

	/**
	 * Handle description change
	 *
	 * @param {object} e - Event object
	 */
	const onDescChange = (e) => {
		const newDesc = e.target.value;
		setEditedPage({ ...editedPage, desc: newDesc });

		if (descRegex.pattern.test(newDesc)) {
			setDescError('');
		} else {
			setDescError(descRegex.err);
		}
	};

	/**
	 * Move monitor within the list
	 *
	 * @param {number} fromIndex - Index of the monitor being moved
	 * @param {number} toIndex   - Index where the monitor should be moved to
	 */
	const moveMonitor = (fromIndex, toIndex) => {
		const updated = [...editedPage.monitors];
		const [moved] = updated.splice(fromIndex, 1);
		updated.splice(toIndex, 0, moved);
		setEditedPage({ ...editedPage, monitors: updated });
	};

	useEffect(() => {
		// Check if page data is the same as edited page data
		if (pageData && editedPage) {
			const isBlocked = titleError || slugError || descError;

			const isEdited =
				pageData.title !== editedPage.title ||
				pageData.slug !== editedPage.slug ||
				pageData.description !== editedPage.desc ||
				pageData.isPublic !== editedPage.isPublic ||
				JSON.stringify(editedPage.monitors) !==
					JSON.stringify(
						pageData.monitors.map((m) => ({
							id: m.id,
							name: m.name,
							url: m.url,
							status: m.status,
						}))
					);

			setEdited(isBlocked || isEdited);

			/**
			 * Warn user about unsaved changes before leaving the page
			 *
			 * @returns {string|undefined} - Warning message if there are unsaved changes
			 */
			window.onbeforeunload = () => {
				if (isEdited) {
					return 'You have unsaved changes. Are you sure you want to leave?';
				}
			};
		}
	}, [editedPage, pageData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Fetch page data
		getPageData();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return <Page heading="Loading..." title="PW | Loading..." />;
	}

	return (
		<>
			{addMonitorModalOpen && (
				<AddMonitorModal
					onClose={() => setAddMonitorModalOpen(false)}
					existing={editedPage.monitors}
					onAdd={(monitor) => {
						setEditedPage((prev) => ({
							...prev,
							monitors: [...prev.monitors, monitor],
						}));
						setEdited(true);
					}}
				/>
			)}
			{deletePageModalOpen && (
				<DeleteStatusPageModal
					onClose={() => setDeletePageModalOpen(false)}
					pageId={id}
					pageSlug={editedPage.slug}
					pageName={editedPage.title}
				/>
			)}
			<Page className="edit-page" title={`PW | Edit ${pageData.title} Page`}>
				<Button
					variant="text"
					onClick={() => {
						if (edited) {
							const confirmLeave = window.confirm(
								'You have unsaved changes. Are you sure you want to leave?'
							);
							if (!confirmLeave) return;
						}
						navigate(`/page/${id}`);
					}}
					className="edit-page__back-button"
				>
					<h4>← Back</h4>
				</Button>
				{error && (
					<Notice
						variant="error"
						message={error}
						onDismiss={() => setError('')}
					/>
				)}
				{success && (
					<Notice
						variant="success"
						message={success}
						onDismiss={() => setSuccess('')}
					/>
				)}
				{information && (
					<Notice
						variant="info"
						message={information}
						onDismiss={() => setInformation('')}
					/>
				)}
				<div className="edit-page__actions">
					<div className="edit-page__actions-edit-title">
						<input
							type="text"
							value={editedPage.title}
							onChange={onTitleChange}
							placeholder="Page Title"
							className="bg-primary-light edit-page__title-input text-h2"
							maxLength={32}
							size={32}
							id="edit-page-title-input"
						/>
						<label
							htmlFor="edit-page-title-input"
							className="edit-page__title-label"
						>
							<Icon icon="edit" className="edit-page__title-edit-icon" />
						</label>
					</div>
					<div className="edit-page__actions-buttons">
						<Button
							variant="primary"
							onClick={onSave}
							disabled={!edited}
							className="edit-page__save-button"
						>
							Save Changes
						</Button>
						<Button
							variant="dangerous"
							onClick={() => setDeletePageModalOpen(true)}
							className="edit-page__delete-button"
						>
							Delete Page
						</Button>
						<Button
							variant="secondary"
							onClick={() => window.open(`/status/${pageData.slug}`, '_blank')}
						>
							<Icon icon="eye" />
						</Button>
					</div>
				</div>
				<div className="edit-page__actions-edit-title">
					<label
						htmlFor="edit-page-slug-input"
						className="edit-page__slug-label"
					>
						<h3>Slug:</h3>
						<p>/status/</p>
					</label>
					<input
						type="text"
						value={editedPage.slug}
						onChange={onSlugChange}
						placeholder="Page Slug"
						className="bg-primary-light edit-page__slug-input"
						maxLength={32}
						size={32}
						id="edit-page-slug-input"
					/>
					<label
						htmlFor="edit-page-slug-input"
						className="edit-page__slug-label"
					>
						<Icon icon="edit" className="edit-page__slug-edit-icon" />
					</label>
				</div>
				<VisibilityToggle
					isVisible={editedPage.isPublic}
					onToggle={(isVisible) => {
						setEditedPage({ ...editedPage, isPublic: isVisible });
					}}
				/>
				{titleError && (
					<Notice
						variant="error"
						message={titleError}
						className="edit-page__title-error"
					/>
				)}
				{slugError && (
					<Notice
						variant="error"
						message={slugError}
						className="edit-page__slug-error"
					/>
				)}
				<Section className="edit-page__section">
					<label
						className="edit-page__section-label"
						htmlFor="edit-page-desc-input"
					>
						<h2>Description</h2>
						<Icon icon="edit" className="edit-page__desc-edit-icon" />
					</label>
					<textarea
						value={editedPage.desc}
						onChange={onDescChange}
						placeholder="Page Description"
						className="bg-primary-light edit-page__desc-input"
						maxLength={512}
						rows={5}
						id="edit-page-desc-input"
					/>
					<span className="edit-page__char-count">
						({editedPage.desc.length} / 512)
					</span>
					{descError && (
						<Notice
							variant="error"
							message={descError}
							className="edit-page__desc-error"
						/>
					)}
				</Section>
				<Section className="edit-page__section">
					<div className="edit-page__section-header">
						<h2>Monitors</h2>
						<Button
							variant="primary"
							onClick={() => {
								setAddMonitorModalOpen(true);
							}}
						>
							Add Monitor
						</Button>
					</div>
					{editedPage.monitors.length > 0 ? (
						<ul className="edit-page__monitors-list">
							{editedPage.monitors.map((monitor, index) => (
								<MonitorItem
									key={monitor.id}
									index={index}
									monitor={monitor}
									moveMonitor={moveMonitor}
								>
									<Icon icon="menu" className="edit-page__monitor-menu-icon" />
									<div className="edit-page__monitor-title">
										<span
											className={`edit-page__monitor-status ${monitor.status === 'up' ? 'bg-green' : monitor.status === 'down' ? 'bg-red' : ''}`}
											title={`Status: ${monitor.status}`}
										/>
										<h3 className="edit-page__monitor-name">{monitor.name}</h3>
									</div>
									<Button
										variant="text"
										className="text-red edit-page__monitor-remove-button"
										onClick={() => {
											const updatedMonitors = editedPage.monitors.filter(
												(m) => m.id !== monitor.id
											);
											setEditedPage({
												...editedPage,
												monitors: updatedMonitors,
											});
										}}
									>
										Remove
									</Button>
								</MonitorItem>
							))}
						</ul>
					) : (
						<p>No monitors added yet.</p>
					)}
				</Section>
			</Page>
		</>
	);
};

export default Edit;
