'use client';
import React, { PureComponent, use, useEffect } from 'react';
import axios from 'axios';
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

const IssueChart = () => {
  const [pieData, setPieData] = React.useState([]);
  const [barData, setBarData] = React.useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const res = await axios.get('/api/dashboard');
    setBarData(res.data.data);
    setPieData(res.data.data2);
  };

  return (
    <div className="chart-container">
      <div className="chart-item">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barData}
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
        <IssuePie data={pieData} />
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

export const IssuePie = ({ data }) => {
  const [pieData, setPieData] = React.useState([]);
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <div className="pie-container">
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="labels">
        {data.map((entry, index) => (
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
};
