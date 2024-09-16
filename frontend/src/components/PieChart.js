import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        
        data: data.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E9ECEF', '#6C757D'],
      }
    ]
  };

  return <Pie data={chartData} />;
};

export default PieChart;
