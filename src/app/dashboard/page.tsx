'use client'
import React, { useState } from "react";
import SidebarLeft from "@components/SidebarLeft";
import { Feed } from '@components/Feed';
import NewPostForm from "@components/Post/NewPostForm";

const Dashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100">
        <SidebarLeft />
        <section className="w-full max-w-2xl mx-auto">
            <NewPostForm onSuccess={() => setRefresh(r => r + 1)}/>
            <Feed key={refresh}/>
        </section>
    </div>
  );
}

export default Dashboard;