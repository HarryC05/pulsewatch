import { useEffect, useRef, useState } from 'react';

import '../styles/components/uptimeChart.css';

/**
 * @description: A React component that displays an uptime chart.
 * 
 * @param {Object} props       - The component props
 * @param {Array}  props.data - The data to be displayed in the chart
 * 
 * @returns {JSX.Element} - The rendered component
 */
const UptimeChart = ({ data }) => {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const BLOCK_WIDTH = 20;
  const BLOCK_GAP = 4;

  const visibleData = data.slice(-visibleCount);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      setVisibleCount(Math.floor(width / (BLOCK_WIDTH + BLOCK_GAP)));
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="uptime-chart">
      <div className="uptime-chart__data" ref={containerRef}>
        {visibleData.map((item, index) => (
          <span
            key={index}
            className={`uptime-chart__data-item ${item.status === 'up' ? 'background-colour-green' : item.status === 'down' ? 'background-colour-red' : ''}`}
            title={`${new Date(item.createdAt).toLocaleString()} - ${item.responseTime ? `${item.responseTime} ms` : 'N/A'}`}
          />
        ))}
      </div>
      <div className="uptime-chart__labels">
        <span className="uptime-chart__label">
          {visibleData.length > 0 ? new Date(visibleData[0].createdAt).toLocaleTimeString() : 'N/A'}
        </span>
        <span className="uptime-chart__label">Now</span>
        </div>
    </div>
  );
}

export default UptimeChart;
