'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IssueTable from './DashboardComponent/issueTable';
import { IssuePie } from './DashboardComponent/PieChart';
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
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const res = await axios.get('/api/dashboard');
    setBarData(res.data.data);
    setPieData(res.data.data2);
  };

  return (
    <div className="p-6 dark:bg-gray-700 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dark:bg-black bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="highest" fill="#ff4c4c" name="Highest Priority" />
              <Bar dataKey="medium" fill="#ffcc00" name="Medium Priority" />
              <Bar dataKey="low" fill="#00ccff" name="Low Priority" />
              IssueTable<Bar dataKey="lowest" fill="#00ff00" name="Lowest Priority" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-black p-4 rounded-2xl shadow-lg">
          <IssuePie data={pieData} />
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-black p-4 rounded-2xl shadow-lg">
        <IssueTable />
      </div>
    </div>
  );
};

export default IssueChart;


