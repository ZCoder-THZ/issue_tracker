'use client';
import React from 'react';
import axios from 'axios';
import IssueTable from './DashboardComponent/issueTable';
import { IssuePie } from './DashboardComponent/PieChart';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const fetchDashboardData = async () => {
  const res = await axios.get('/api/dashboard');
  return {
    barData: res.data.data,
    pieData: res.data.data2,
  };
};

const IssueChart = () => {
  const queryClient = useQueryClient(); // Get access to the query cache

  const { data, isPending, error } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isPending) {
    return <div className="text-center py-6 text-gray-600 dark:text-gray-300">⏳ Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">❌ Failed to load dashboard</div>;
  }

  return (
    <div className="p-6 w-3/4 mx-auto dark:bg-gray-700 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">AFCKINDashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="dark:bg-black bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data?.barData}
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
              <Bar dataKey="lowest" fill="#00ff00" name="Lowest Priority" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-black p-4 rounded-2xl shadow-lg">
          <IssuePie data={data?.pieData} />
        </div>
      </div>

      {/* Issues Table */}
      <div className="mt-6 bg-white dark:bg-black p-4 rounded-2xl shadow-lg">
        <IssueTable />
      </div>
    </div>
  );
};

export default IssueChart;
