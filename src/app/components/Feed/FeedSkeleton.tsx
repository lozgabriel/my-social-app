import React from 'react';

const FeedSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse rounded-2xl bg-gray-200 h-24" />
    ))}
  </div>
);

export default FeedSkeleton;
