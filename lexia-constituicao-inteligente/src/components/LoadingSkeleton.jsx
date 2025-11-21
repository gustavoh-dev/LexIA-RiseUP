import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="search-card animate-pulse">
      <div className="card-header mb-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
      <div className="card-actions mt-auto">
        <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
      </div>
    </div>
  );
};

export const ResultsSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CardSkeleton;