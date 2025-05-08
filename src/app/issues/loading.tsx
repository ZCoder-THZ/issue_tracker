// components/loading/IssuesPageSkeleton.tsx

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const IssueActionsSkeleton = () => (
  <div className="flex gap-2">
    <Skeleton width={100} height={36} />
  </div>
);

const IssueCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton circle width={24} height={24} />
            <Skeleton width={60} />
          </div>
          <div className="mb-4">
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton circle width={16} height={16} />
                <Skeleton width={100} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton width={60} height={32} />
          <Skeleton width={60} height={32} />
        </div>
      </div>
    </div>
  </div>
);

const PaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-2 mt-8">
    <Skeleton width={32} height={32} />
    <Skeleton width={32} height={32} />
    <Skeleton width={60} height={32} />
    <Skeleton width={32} height={32} />
    <Skeleton width={32} height={32} />
  </div>
);

export default function IssuesPageSkeleton() {
  const MOCK_ISSUES_COUNT = 5;

  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base-color)"
      highlightColor="var(--skeleton-highlight-color)"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Skeleton height={28} width={200} className="mb-1" />
              <Skeleton height={16} width={100} />
            </div>
            <IssueActionsSkeleton />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Skeleton height={40} />
            </div>
            <div className="flex gap-2">
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(MOCK_ISSUES_COUNT)].map((_, index) => (
            <IssueCardSkeleton key={index} />
          ))}
        </div>
        <PaginationSkeleton />
      </div>
    </SkeletonTheme>
  );
}
