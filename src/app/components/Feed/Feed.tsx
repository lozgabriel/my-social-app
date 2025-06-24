import React, { useEffect, useState } from 'react';
import FeedItem from './FeedItem';
import FeedSkeleton from './FeedSkeleton';
import FeedEmpty from './FeedEmpty';
import { getFeed } from '@/lib/api';
import { FeedPost } from './types';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  if (posts === null) return <FeedSkeleton />;
  if (posts.length === 0) return <FeedEmpty />;

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
