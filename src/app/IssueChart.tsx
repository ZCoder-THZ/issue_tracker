'use client';
import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  ResponsiveContainer,
  Cell,
  PieChart,
} from 'recharts';

const data = [
  { day: 'Sun', highest: 5, medium: 10, low: 15, lowest: 20 },
  { day: 'Mon', highest: 3, medium: 8, low: 12, lowest: 16 },
  { day: 'Mon', highest: 8, medium: 12, low: 10, lowest: 5 },
  { day: 'Wed', highest: 3, medium: 8, low: 12, lowest: 16 },
  { day: 'Tue', highest: 8, medium: 12, low: 10, lowest: 5 },
  { day: 'Fri', highest: 3, medium: 8, low: 12, lowest: 16 },
  { day: 'Sat', highest: 8, medium: 12, low: 10, lowest: 5 },
  // Add more days as needed
];

const IssueChart = () => {
  return (
    <div className="chart-container">
      <div className="chart-item">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="highest" fill="#ff4c4c" name="Highest Priority" />
            <Bar dataKey="medium" fill="#ffcc00" name="Medium Priority" />
            <Bar dataKey="low" fill="#00ccff" name="Low Priority" />
            <Bar dataKey="lowest" fill="#00ff00" name="Lowest Priority" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-item">
        <IssuePie />
      </div>
    </div>
  );
};

export default IssueChart;

const data2 = [
  { name: 'Lowest', value: 20 },
  { name: 'Low', value: 15 },
  { name: 'Medium', value: 10 },
  { name: 'Highest', value: 5 },
];
const COLORS = ['#00ff00', '#00ccff', '#ffcc00', '#ff4c4c'];

export class IssuePie extends PureComponent {
  render() {
    return (
      <div className="pie-container">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={data2}
              cx="50%"
              cy="70%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data2.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="labels">
          {data2.map((entry, index) => (
            <div key={`label-${index}`} className="label">
              <span
                className="label-color"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="label-text">
                {entry.name + ' ' + entry.value}{' '}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
