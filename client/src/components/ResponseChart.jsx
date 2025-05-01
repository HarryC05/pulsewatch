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

import '../styles/components/responseChart.css';

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
 * @description This component is used to display the response time of the server in a chart.
 * 
 * @param {Object} props            - The component props
 * @param {string} props.title      - The title of the chart
 * @param {Array}  props.heartbeats - The heartbeats data to be displayed in the chart
 * 
 * @returns {JSX.Element} - The rendered component
 */
const ResponseChart = ({ title, heartbeats }) => {
  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

  const data = {
    datasets: [
      {
        label: 'Response Time (ms)',
        data: heartbeats.map((heartbeat) => ({
            x: new Date(heartbeat.createdAt),
            y: heartbeat.responseTime,
          })),
        borderColor: '#4faa4f', // var(--colour-status-green)
        spanGaps: true,
        pointRadius: 2,
        segment: {
          borderColor: ctx => skipped(ctx, 'grey' || '#4faa4f'),
          borderDash: ctx => skipped(ctx, [6, 6]),
        },
      }
    ]
  }

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
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className='ResponseChart'>
      <h2>{title}</h2>
      <Line data={data} options={options} />
    </div>
  )
}
export default ResponseChart;