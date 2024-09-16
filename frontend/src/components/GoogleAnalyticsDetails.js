import React, { useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { useLocation } from 'react-router-dom';
import './GoogleAnalyticsDetails.css'; 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF69B4', '#D4AF37', '#4B0082'];

const GoogleAnalyticsDetails = () => {
  const location = useLocation();
  const data = location.state
    ? Object.entries(location.state.data)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count) // Sort by count to display top results
    : [];

  // Limit to top 10 data points, others go to "Other"
  const topData = data.slice(0, 10);
  const otherCount = data.slice(10).reduce((sum, item) => sum + item.count, 0);
  if (otherCount > 0) {
    topData.push({ name: 'Other', count: otherCount });
  }

  if (topData.length === 0) {
    return (
      <div className="details-page-container">
        <h2 className="details-header">No Data Available</h2>
      </div>
    );
  }

  return (
    <div className="analytics-details-container">
      <h2 className="details-header">Details for {location.pathname.split("/").pop()}</h2>

      <div className="chart-container">
        <PieChart width={800} height={400}>
          <Pie
            data={topData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150} // Adjusted size for a smaller chart
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {topData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>

      <div className="list-container">
        <ul className="analytics-list">
          {data.map((item, index) => (
            <li key={index} className="analytics-list-item">
              <span className="item-name">{item.name}:</span>
              <span className="item-count">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDetails;
