import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'MONITOR';

/**
 * MonitorItem component for displaying and managing individual monitor items
 *
 * @param {object}          props             - Component properties
 * @param {object}          props.monitor     - Monitor data
 * @param {number}          props.index       - Index of the monitor in the list
 * @param {Function}        props.moveMonitor - Function to handle moving monitors
 * @param {React.ReactNode} props.children    - Child components to render inside the item
 *
 * @returns {JSX.Element} - Rendered monitor item
 */
const MonitorItem = ({ monitor, index, moveMonitor, children }) => {
	const [, ref] = useDrop({
		accept: ItemType,
		/**
		 * Handles the drop event when a monitor item is dragged over another item
		 *
		 * @param {object} item - The dragged item containing its index
		 */
		hover(item) {
			if (item.index !== index) {
				moveMonitor(item.index, index);
				item.index = index;
			}
		},
	});

	const [, drag] = useDrag({
		type: ItemType,
		item: { index },
	});

	return (
		<li ref={(node) => drag(ref(node))} className="edit-page__monitor-item">
			{children}
		</li>
	);
};

export default MonitorItem;
