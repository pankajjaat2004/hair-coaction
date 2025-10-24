import React from "react";

interface TutorialProps {
  darkMode: boolean;
}

const Tutorial: React.FC<TutorialProps> = ({ darkMode }) => {
  return (
    <div className={`max-w-4xl mx-auto py-12 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-3xl shadow-2xl border border-pink-100`}> 
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
        Hair Care Tutorials
      </h2>
      <p className="mb-8 text-lg text-center">
        Watch these expert videos to learn the best hair care routines, tips, and science behind healthy hair.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/6Z5gQJkFQbA"
            title="Hair Science: How to Care for Your Hair"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Hair Science: How to Care for Your Hair</h3>
            <p className="text-sm text-gray-600">A dermatologist explains the science of hair and scalp care, including routines and product recommendations.</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/1qGQ3J6QG6g"
            title="Expert Hair Care Tips"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Expert Hair Care Tips</h3>
            <p className="text-sm text-gray-600">Top trichologist shares practical tips for maintaining healthy hair and preventing common issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
