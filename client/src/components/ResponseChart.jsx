import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

import { Section } from './';

ChartJS.register(
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	TimeScale
);

/**
 * ResponseChart component
 *
 * @param {object} props            - The component props
 * @param {Array}  props.heartbeats - The heartbeats data to be displayed in the chart
 *
 * @returns {JSX.Element} - The rendered component
 */
const ResponseChart = ({ heartbeats }) => {
	/**
	 * Function to determine if a segment should be skipped
	 *
	 * @param {object} ctx   - The context object
	 * @param {string} value - The value to return if the segment is not skipped
	 *
	 * @returns {string|undefined} - The value if the segment is not skipped, otherwise undefined
	 */
	const skipped = (ctx, value) =>
		ctx.p0.skip || ctx.p1.skip ? value : undefined;

	const data = {
		datasets: [
			{
				label: 'Response Time (ms)',
				data: heartbeats.map((heartbeat) => ({
					x: new Date(heartbeat.createdAt),
					y: heartbeat.responseTime,
				})),
				borderColor: '#4faa4f', // var(--colour-green)
				spanGaps: true,
				pointRadius: 2,
				segment: {
					/**
					 * @param {object} ctx - The context object
					 *
					 * @returns {string|undefined} - The value if the segment is not skipped, otherwise undefined
					 */
					borderColor: (ctx) => skipped(ctx, 'grey' || '#4faa4f'),
					/**
					 * @param {object} ctx - The context object
					 *
					 * @returns {Array} - The array of border dash values
					 */
					borderDash: (ctx) => skipped(ctx, [6, 6]),
				},
			},
		],
	};

	const options = {
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'minute',
					displayFormats: {
						minute: 'MMM d, HH:MM',
					},
				},
				title: {
					display: false,
					text: 'Time',
				},
				ticks: {
					autoSkip: true,
					maxTicksLimit: 5,
				},
			},
			y: {
				title: {
					display: true,
					text: 'Response Time (ms)',
				},
				beginAtZero: true,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	return (
		<Section variant="dark" className="response-chart">
			<Line data={data} options={options} />
		</Section>
	);
};
export default ResponseChart;
