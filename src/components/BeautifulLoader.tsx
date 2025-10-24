import React from "react";

const BeautifulLoader: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => (
  <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100'}`}>
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 animate-spin rounded-full border-8 border-pink-400 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full border-8 border-orange-400 border-b-transparent"></div>
        <div className="absolute inset-0 animate-spin-slow rounded-full border-8 border-rose-400 border-l-transparent"></div>
      </div>
      <h2 className={`mt-8 text-2xl font-bold ${darkMode ? 'text-white' : 'text-pink-600'} animate-fadeIn`}>Loading Hair Coaction...</h2>
      <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} animate-fadeIn`}>Bringing beauty and care to your dashboard</p>
    </div>
    <style>{`
      @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 2s linear infinite;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-in;
      }
    `}</style>
  </div>
);

export default BeautifulLoader;
