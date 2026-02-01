import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthMetricsChart = ({ data, title, yLabel, color = '#4f46e5' }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: title,
        data: data.map(d => d.avg_value || d.value),
        borderColor: color,
        backgroundColor: `${color}20`, // 20 is hex for ~12% opacity
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default HealthMetricsChart;