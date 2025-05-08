'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IssueTable from './DashboardComponent/issueTable';
import { IssuePie } from './DashboardComponent/PieChart';
import { useQuery } from '@tanstack/react-query';
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

// Interface for the expected structure of dashboard data
interface DashboardData {
  barData: Array<{ day: string; highest: number; medium: number; low: number; lowest: number }>;
  pieData: Array<{ name: string; value: number }>;
}

// Async function to fetch dashboard data from the API
const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get<{ data: DashboardData['barData']; data2: DashboardData['pieData'] }>('/api/dashboard');
  return {
    barData: res.data.data,
    pieData: res.data.data2,
  };
};

const IssueChart = () => {
  // State to track window size for dynamic chart height
  const [chartHeight, setChartHeight] = useState(350);

  // Adjust chart height based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Small mobile
        setChartHeight(250);
      } else if (window.innerWidth < 768) { // Larger mobile/small tablet
        setChartHeight(300);
      } else {
        setChartHeight(350); // Tablets and desktops
      }
    };

    // Set initial height
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetching data using React Query
  const { data, isPending, error } = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  // Display loading state
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600 dark:text-gray-300">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 dark:border-gray-300 mb-3"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md">
          <div className="text-3xl mb-3">❌</div>
          <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
          <p>{error.message || 'Failed to load dashboard data.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the dashboard if data is available
  return (
    <div className="p-3 md:p-6 w-full max-w-full mx-auto dark:bg-gray-800 min-h-screen">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {/* Bar Chart Section */}
        <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
            Priority Distribution
          </h3>

          {/* Mobile view warning for very small screens */}
          <div className="block sm:hidden text-xs text-amber-600 dark:text-amber-400 mb-2">
            ⚠️ Rotate device for a better chart view
          </div>

          {/* Responsive container for the bar chart */}
          <div className="w-full overflow-x-auto">
            <div style={{ width: '100%', minWidth: data?.barData?.length ? `${Math.max(data.barData.length * 60, 320)}px` : '320px', height: `${chartHeight}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.barData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                    className="fill-gray-600 dark:fill-gray-400"
                  />
                  <YAxis
                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                    className="fill-gray-600 dark:fill-gray-400"
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '8px',
                      fontSize: window.innerWidth < 640 ? '12px' : '14px',
                    }}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    itemStyle={{ color: '#374151' }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: window.innerWidth < 640 ? '11px' : '14px',
                      paddingTop: '10px'
                    }}
                    iconSize={window.innerWidth < 640 ? 8 : 10}
                  />
                  <Bar dataKey="highest" fill="#ef4444" name="Highest" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="medium" fill="#f59e0b" name="Medium" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="low" fill="#3b82f6" name="Low" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lowest" fill="#22c55e" name="Lowest" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
            Issue Distribution
          </h3>
          <div className="h-[300px] sm:h-[350px]">
            <IssuePie data={data?.pieData} />
          </div>
        </div>
      </div>

      {/* Issues Table Section */}
      <div className="mt-3 md:mt-6 bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
          Recent Issues
        </h3>
        <div className="overflow-x-auto">
          <IssueTable />
        </div>
      </div>
    </div>
  );
};

export default IssueChart;