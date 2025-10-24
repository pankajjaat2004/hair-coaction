import React from "react";
import { Link } from "react-router-dom";
import { Ghost, ArrowLeft } from "lucide-react";

const NotFound404: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100"}`}>
      <div className="flex flex-col items-center animate-fadeIn">
        <div className={`rounded-full p-8 shadow-2xl mb-8 ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-pink-500 to-rose-400"}`}>
          <Ghost className="w-20 h-20 text-white animate-bounce" />
        </div>
        <h1 className={`text-5xl font-extrabold mb-4 bg-clip-text text-transparent ${darkMode ? "bg-gradient-to-r from-gray-300 to-gray-500" : "bg-gradient-to-r from-pink-600 to-rose-600"}`}>404</h1>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-300" : "text-pink-700"}`}>Page Not Found</h2>
        <p className={`mb-8 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-pink-200 text-pink-900 hover:bg-pink-300"}`}>
          <ArrowLeft className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        .animate-bounce { animation: bounce 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default NotFound404;
