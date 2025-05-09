import '../styles/components/modal.css';

/**
 * Modal component
 *
 * @param {object}    props          - Props for the component
 * @param {string}    props.title    - Title of the modal
 * @param {Function}  props.onClose  - Function to close the modal
 * @param {ReactNode} props.children - Content to be displayed inside the modal
 *
 * @returns {JSX.Element} - Rendered component
 */
const Modal = ({ title, onClose, children }) => {
	return (
		<div
			className="modal__background"
			onClick={(e) =>
				e.target.classList.contains('modal__background') && onClose()
			}
		>
			<div className="modal">
				<div className="modal__header">
					<h2 className="modal__title">{title}</h2>
					<button className="modal__close" onClick={onClose}>
						&times;
					</button>
				</div>
				<div className="modal__content">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
