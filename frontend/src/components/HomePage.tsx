import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Sastagram</h1>
      <p className="text-lg text-gray-600 mb-4">
        Sastagram is your space to connect, share, and explore moments with friends and the world. 
        Capture your life with photos, follow your favorite people, and join a vibrant community.
      </p>
      <p className="text-md text-gray-500">
        Ready to get started? Sign up or log in to begin your journey!
      </p>
      <div className="mt-6 space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Sign In
        </a>
        <a href="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default HomePage;