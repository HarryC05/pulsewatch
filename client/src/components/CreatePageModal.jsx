import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { nameRegex, slugRegex, descRegex } from '../../../shared/regex';
import { Modal, Notice, Button, VisibilityToggle } from './';

const API = import.meta.env.VITE_API_URL;

/**
 * CreatePageModal component
 *
 * @param {object}   props         - Props for the component
 * @param {Function} props.onClose - Function to close the modal
 *
 * @returns {JSX.Element} - Rendered component
 */
const CreatePageModal = ({ onClose }) => {
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [slugEdited, setSlugEdited] = useState(false);
	const [desc, setDesc] = useState('');
	const [isPublic, setIsPublic] = useState(false);
	const [titleError, setTitleError] = useState('');
	const [slugError, setSlugError] = useState('');
	const [descError, setDescError] = useState('');

	const navigate = useNavigate();

	/**
	 * Handles the title input change
	 *
	 * @param {object} e              - Event object
	 * @param {object} e.target       - Target element
	 * @param {string} e.target.value - Value of the input
	 */
	const handleTitleChange = (e) => {
		const value = e.target.value;
		setTitle(value);

		if (nameRegex.pattern.test(value)) {
			setTitleError('');
			if (!slugEdited) {
				const slugValue = value
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '');
				setSlug(slugValue);
			}
		} else {
			setTitleError(nameRegex.err);
		}
	};

	/**
	 * Handles the slug input change
	 *
	 * @param {object} e              - Event object
	 * @param {object} e.target       - Target element
	 * @param {string} e.target.value - Value of the input
	 */
	const handleSlugChange = (e) => {
		const value = e.target.value;
		setSlug(value);
		setSlugEdited(value !== '');

		if (slugRegex.pattern.test(value)) {
			setSlugError('');
		} else {
			setSlugError(slugRegex.err);
		}
	};

	/**
	 * Handles the description input change
	 *
	 * @param {object} e              - Event object
	 * @param {object} e.target       - Target element
	 * @param {string} e.target.value - Value of the input
	 */
	const handleDescChange = (e) => {
		const value = e.target.value;
		setDesc(value);

		if (descRegex.pattern.test(value)) {
			setDescError('');
		} else {
			setDescError(descRegex.err);
		}
	};

	/**
	 * Handles the create page button click
	 */
	const onCreatePage = () => {
		if (!title || !slug) {
			return;
		}

		// Validate the title, slug, and description
		if (!nameRegex.pattern.test(title)) {
			setTitleError(nameRegex.err);
		}

		if (!slugRegex.pattern.test(slug)) {
			setSlugError(slugRegex.err);
		}

		if (desc && !descRegex.pattern.test(desc)) {
			setDescError(descRegex.err);
		}

		// If there are any errors, return early
		if (titleError || slugError || descError) {
			return;
		}

		// Create the page data object
		const pageData = {
			title,
			slug,
			description: desc,
			isPublic,
		};

		// Call the API to create the page
		axios
			.post(`${API}/api/v1/page/create`, pageData, {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status === 201) {
					// Redirect to the created page
					navigate(`/edit/${response.data.id}`);
				} else {
					// Handle error response
					console.error('Error creating page:', response.data);
				}
			})
			.catch((error) => {
				// Handle error response
				const errorMessage =
					error.response?.data?.message || 'An error occurred';
				console.error('Error creating page:', errorMessage);
			});

		// Close the modal
		onClose();
	};

	return (
		<Modal title="Create Page" onClose={onClose} className="create-page-modal">
			<div className="create-page-modal__content">
				<p className="create-page-modal__description">
					Create a new page to monitor.
				</p>
				<div className="create-page-modal__form">
					<div className="create-page-modal__form-group">
						<label htmlFor="title" title={nameRegex.err}>
							Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={handleTitleChange}
							maxLength={32}
							placeholder="My Status Page"
							title={nameRegex.err}
							required
						/>
						<span className="create-page-modal__form-group--char-count">
							({title.length} / 32)
						</span>
						{titleError && (
							<Notice
								message={titleError}
								variant="error"
								className="create-page-modal__form-group--error-notice"
							/>
						)}
					</div>
					<div className="create-page-modal__form-group">
						<label htmlFor="slug" title={slugRegex.err}>
							Slug
						</label>
						<input
							type="text"
							id="slug"
							value={slug}
							onChange={handleSlugChange}
							maxLength={32}
							placeholder="my-status-page"
							title={slugRegex.err}
							required
						/>
						<span className="create-page-modal__form-group--char-count">
							({slug.length} / 32)
						</span>
						{slugError && <Notice message={slugError} variant="error" />}
					</div>
					<div className="create-page-modal__form-group">
						<label htmlFor="desc" title={descRegex.err}>
							Description (optional)
						</label>
						<textarea
							id="desc"
							value={desc}
							onChange={handleDescChange}
							maxLength={512}
							placeholder="This is my status page."
							rows={6}
							title={descRegex.err}
						></textarea>
						<span className="create-page-modal__form-group--char-count">
							({desc.length} / 512)
						</span>
						{descError && <Notice message={descError} variant="error" />}
					</div>
					<div className="create-page-modal__form-group create-page-modal__form-group--toggle">
						<label
							htmlFor="isPublic"
							title="Make this page visible to the public"
						>
							Page visibility
						</label>
						<VisibilityToggle isVisible={isPublic} onToggle={setIsPublic} />
					</div>
					<div className="create-page-modal__form-group-buttons">
						<Button
							className="create-page-modal__form-group-button"
							variant="primary"
							onClick={onCreatePage}
							disabled={!title || !slug || titleError || slugError || descError}
						>
							Create Page
						</Button>
						<Button
							className="create-page-modal__form-group-button"
							variant="secondary"
							onClick={onClose}
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default CreatePageModal;
