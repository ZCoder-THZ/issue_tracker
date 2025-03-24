// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '../../../../prisma/client';
// import { startOfMonth, endOfMonth, format } from 'date-fns';
// import { revalidateTag } from 'next/cache';

// export const GET = async (request: NextRequest) => {
//   // Get the start and end dates of the current month
//   const startDate = startOfMonth(new Date());
//   const endDate = endOfMonth(new Date());

//   // Retrieve issues created within the current month
//   const issues = await prisma.issue.findMany({
//     where: {
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   if (!issues) {
//     return NextResponse.error('no issues found');
//   }
//   // Initialize an object to store the counts
//   const countsByDate = {};

//   // Iterate through the issues and count the occurrences of each priority level by date
//   issues.forEach((issue) => {
//     const date = format(new Date(issue.createdAt), 'yyyy-MM-dd');
//     const dayOfMonth = format(new Date(issue.createdAt), 'dd');

//     // If the date key doesn't exist in countsByDate, create it
//     if (!countsByDate[date]) {
//       countsByDate[date] = {
//         day: dayOfMonth,
//         lowest: 0,
//         low: 0,
//         medium: 0,
//         high: 0,
//         highest: 0,
//       };
//     }

//     // Increment the count for the corresponding priority level
//     countsByDate[date][issue.priority]++;
//   });

//   // Convert the object to an array of values
//   const dataArray = Object.values(countsByDate);

//   // Initialize an object to store the counts of each priority level
//   const priorityCounts = {
//     lowest: 0,
//     low: 0,
//     medium: 0,
//     high: 0,
//     highest: 0,
//   };

//   issues.forEach((issue) => {
//     if (priorityCounts[issue.priority] !== undefined) {
//       priorityCounts[issue.priority] += 1;
//     }
//   });

//   // Convert priorityCounts to the required data2 format
//   const data2 = [
//     { name: 'Lowest', value: priorityCounts.lowest },
//     { name: 'Low', value: priorityCounts.low },
//     { name: 'Medium', value: priorityCounts.medium },
//     { name: 'High', value: priorityCounts.high },
//     { name: 'Highest', value: priorityCounts.highest },
//   ];

//   revalidateTag('issue_dashboard');

//   return NextResponse.json({ data: dataArray, data2 });
// };
