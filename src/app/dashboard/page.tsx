'use client'
import React, { useState, useEffect } from "react";
import SidebarLeft from "@components/SidebarLeft";
import { Feed } from '@components/Feed';
import NewPostForm from "@components/Post/NewPostForm";
import Profile from "@components/Profile/Profile";
import Image from "next/image";
import { getProfile } from "@/lib/api";

const Dashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    image?: string;
    bio?: string;
  }>(null);

  useEffect(() => {
    getProfile().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-tr from-blue-50 to-blue-100">
      <SidebarLeft />
      <div className="flex-1 flex flex-col">
        <header className="w-full flex items-center justify-between px-8 py-6 relative">
          <div />

          <div className="flex items-center gap-3 relative">
            {user && (
              <>
                <span className="font-semibold">{user.name}</span>
                <button
                  className="focus:outline-none"
                  onClick={() => setShowProfile((prev) => !prev)}
                  title="Ver perfil"
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover cursor-pointer border-2 bg-white border-blue-200 hover:scale-105 transition"
                    priority
                  />
                </button>
              </>
            )}

            {/* Popover flutuante */}
            {showProfile && user && (
              <div className="absolute right-0 top-16 z-50">
                <div className="bg-white rounded-2xl shadow p-4 w-80 flex flex-col items-center animate-fadeIn">
                  <Profile
                    name={user.name}
                    email={user.email}
                    image={user.image}
                    bio={user.bio}
                  />
                </div>
              </div>
            )}
          </div>
        </header>
        {/* Conteúdo do feed */}
        <main className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
          <NewPostForm onSuccess={() => setRefresh((r) => r + 1)} />
          <Feed key={refresh} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;