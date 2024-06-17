import React from 'react';
import Link from 'next/link';

import delay from 'delay';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import IssueActions from './issueActions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { sessionAuth } from '@/lib/sessionAUth';
async function IssuesLoading() {
  const session = await sessionAuth();
  const issues = [1, 2, 3, 4, 5];

  return (
    <div className="container mx-auto p-4">
      {session && <IssueActions />}

      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-4xl mx-auto bg-white dark:bg-black shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-[100px] p-2">Issue</TableHead>
              <TableHead className="p-2">Status</TableHead>
              <TableHead className="p-2">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map((issue) => (
              <TableRow key={issue} className="border-b">
                <TableCell className="font-medium p-2">
                  <Skeleton />
                </TableCell>
                <TableCell className="p-2">
                  <Skeleton />
                </TableCell>
                <TableCell className="p-2">
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default IssuesLoading;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB8HtRLrAVzWjyguWwMM168ez9swmNuh1o",
//   authDomain: "issuetracker-4a6d1.firebaseapp.com",
//   projectId: "issuetracker-4a6d1",
//   storageBucket: "issuetracker-4a6d1.appspot.com",
//   messagingSenderId: "728110667533",
//   appId: "1:728110667533:web:453dfd8c323cc54fd84244"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
