import React from 'react';
import { usePoolPrices } from '../hooks/usePoolPrices';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PoolPriceData = () => {
  const { processedData, dailyStats, isLoading, error } = usePoolPrices(
    '2025-01-09',
    '2025-02-09'
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Prepare data for the chart
  const chartData = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Average Price',
        data: dailyStats.map(stat => stat.average),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Min Price',
        data: dailyStats.map(stat => stat.min),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Max Price',
        data: dailyStats.map(stat => stat.max),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pool Price Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Line data={chartData} options={options} />
      </div>
      
      <h2>Daily Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Average Price</th>
            <th>Min Price</th>
            <th>Max Price</th>
          </tr>
        </thead>
        <tbody>
          {dailyStats.map(stat => (
            <tr key={stat.date}>
              <td>{stat.date}</td>
              <td>${stat.average.toFixed(2)}</td>
              <td>${stat.min.toFixed(2)}</td>
              <td>${stat.max.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoolPriceData; 