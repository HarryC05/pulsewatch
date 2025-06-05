import {
	Bell,
	Calendar,
	ClockActivity,
	Close,
	DollarCircle,
	Edit,
	Eye,
	FileChecked,
	Layers,
	LockClosed,
	LockOpen,
	Logo,
	Menu,
	Monitor,
	PlusCircle,
	Share,
	UserCheck,
	Users,
	Zap,
} from '../icons';

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
		bell: Bell,
		calendar: Calendar,
		clockActivity: ClockActivity,
		close: Close,
		dollarCircle: DollarCircle,
		edit: Edit,
		eye: Eye,
		fileChecked: FileChecked,
		layers: Layers,
		lockClosed: LockClosed,
		lockOpen: LockOpen,
		logoIcon: Logo,
		menu: Menu,
		monitor: Monitor,
		plusCircle: PlusCircle,
		share: Share,
		userCheck: UserCheck,
		users: Users,
		zap: Zap,
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
