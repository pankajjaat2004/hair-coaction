
import React from "react";
import Home from "../components/Home";
import EventPage from "../components/EventPage";
import Education from "../components/Education";
import Consultation from "../components/Consultation";
import Community from "../components/Community";
import Profile from "../components/Profile";
import Tutorial from "../components/Tutorial";

import type { User as FirebaseUser } from "firebase/auth";

interface DashboardPageProps {
  user: FirebaseUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, activeTab, setActiveTab, darkMode, setDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100'}`}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] ${darkMode ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300'} rounded-full blur-3xl opacity-40 animate-blob3d`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] ${darkMode ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900' : 'bg-gradient-to-br from-orange-300 via-pink-300 to-rose-400'} rounded-full blur-3xl opacity-30 animate-blob3d animation-delay-2000`} />
        <div className={`absolute top-[30%] left-[60%] w-[25vw] h-[25vw] ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-br from-rose-300 via-pink-200 to-orange-200'} rounded-full blur-2xl opacity-20 animate-blob3d animation-delay-4000`} />
      </div>
      <div className="relative z-10 flex-1">
        {/* Render tab content with correct props */}
  {activeTab === "home" && <Home user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
  {activeTab === "event" && <EventPage user={user} />}
  {activeTab === "education" && <Education user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
  {activeTab === "consultation" && <Consultation user={user} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />}
  {activeTab === "community" && <Community user={user} />}
  {activeTab === "profile" && <Profile user={user} />}
  {activeTab === "tutorial" && <Tutorial darkMode={darkMode} />}
  {/* Default fallback */}
  {!["home","event","education","consultation","community","profile","tutorial"].includes(activeTab) && <Home user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>
      <style>{`
        @keyframes blob3d {
          0% { transform: scale(1) translate(0,0); }
          33% { transform: scale(1.1) translate(30px,-40px); }
          66% { transform: scale(0.95) translate(-20px,20px); }
          100% { transform: scale(1) translate(0,0); }
        }
        .animate-blob3d {
          animation: blob3d 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
