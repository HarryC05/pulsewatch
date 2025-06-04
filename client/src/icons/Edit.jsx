/**
 * Edit Component
 *
 * @param {object} props           - Component properties
 * @param {string} props.className - Additional class names
 *
 * @returns {JSX.Element} - Rendered Edit icon
 */
const Edit = ({ className }) => {
	return (
		<svg
			width="800"
			height="800"
			viewBox="0 -.5 25 25"
			fill="none"
			stroke="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				clipRule="evenodd"
				d="M17.265 4.162l1.945 1.583a.965.965 0 01-.008 1.39l-1.478 1.8-5.03 6.137a.639.639 0 01-.335.207l-2.608.6a.661.661 0 01-.684-.585l.122-2.573a.6.6 0 01.148-.355l4.813-5.865 1.695-2.068c.33-.448.949-.566 1.42-.27z"
				stroke="currentcolor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.5 18.241a.75.75 0 000 1.5v-1.5zm13.7 1.5a.75.75 0 100-1.5v1.5zm-4.354-13.52a.75.75 0 00-1.392.561l1.391-.561zm3.043 3.449a.75.75 0 00-.33-1.463l.33 1.463zM5.5 19.74h13.7v-1.5H5.5v1.5zm7.954-12.959c.233.576.711 1.398 1.422 2.03.725.645 1.757 1.142 3.013.858l-.33-1.463c-.643.145-1.198-.081-1.686-.515a4.211 4.211 0 01-1.027-1.471l-1.392.561z"
				fill="currentColor"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Edit;
