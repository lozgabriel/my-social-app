import React from 'react';
import { FeedPost } from '@components/Feed/types';
import Image from "next/image";

type FeedItemProps = {
  post: FeedPost;
};

const FeedItem: React.FC<FeedItemProps> = ({ post }) => {
  const handleImage = () => {
    console.log("Image loaded:", post);
  }

  handleImage();
  return (
    <article className="rounded-2xl shadow p-4 bg-white flex gap-3 items-start">
      <Image 
        src={post.userImage || "/default-avatar.png"}
        alt={post.user} 
        width={40} 
        height={40} 
        className="w-10 h-10 rounded-full" 
      />
      <div className='w-full'>
        <div className="font-semibold">{post.user}</div>
        <div className="text-gray-600 text-sm">
          {new Date(post.createdAt).toLocaleString()}
        </div>
        <p className="mt-2">{post.content}</p>
        {post.imageUrl && (
          <Image 
            src={post.imageUrl} 
            alt="" 
            width={400} 
            height={250} 
            priority 
            className="mt-2 w-full h-auto rounded-xl max-w-[540px]" 
          />
        )}
      </div>
    </article>
  );
}

export default FeedItem;
