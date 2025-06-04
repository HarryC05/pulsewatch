import React from 'react';

import { LockClosed, LockOpen, Logo, Edit, Menu, Close } from '../icons';

/**
 * Icon component
 *
 * @param {object}  props           - Component properties
 * @param {string}  props.icon      - Icon name
 * @param {string=} props.className - Additional class names
 * @param {string=} props.alt       - Alt text for the icon
 *
 * @returns {JSX.Element} - Rendered icon component
 */
const Icon = ({ icon, className = '', alt = '' }) => {
	const icons = {
		close: Close,
		edit: Edit,
		lockClosed: LockClosed,
		lockOpen: LockOpen,
		logoIcon: Logo,
		menu: Menu,
	};

	if (!icons[icon]) {
		console.error(`Icon "${icon}" not found.`);
		return null;
	}

	const IconComponent = icons[icon];
	return (
		<IconComponent className={`icon icon-${icon} ${className}`} alt={alt} />
	);
};

export default Icon;
