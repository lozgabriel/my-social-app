import React from 'react';
import { FeedPost } from '@components/Feed/types';
import Image from "next/image";

type FeedItemProps = {
  post: FeedPost;
};

const FeedItem: React.FC<FeedItemProps> = ({ post }) => (
  <article className="rounded-2xl shadow p-4 bg-white flex gap-3 items-start">
    {post.userImage && (
      <Image src={post.userImage} alt={post.user} width={140} height={140} className="w-10 h-10 rounded-full" />
    )}
    <div>
      <div className="font-semibold">{post.user}</div>
      <div className="text-gray-600 text-sm">
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <p className="mt-2">{post.content}</p>
      {post.imageUrl && (
        <Image src={post.imageUrl} alt="" width={400} height={250} className="mt-2 w-full h-auto max-w-xs rounded-xl" />
      )}
    </div>
  </article>
);

export default FeedItem;
