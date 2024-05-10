import React from 'react';
import InitializeContract from '../Contract/InitializeToken';

const LandingPage = () => {
 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-6xl font-bold text-white">Decentralized Content Exchange</h1>
        <p className="mt-3 text-lg text-center max-w-3xl font-semibold text-gray-400">
        Our platform uses blockchain for secure, efficient trading of unique digital assets, ensuring transparency and tamper-proof transactions.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a
            href="https://github.com/yourusername/dcex-contract"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-bold text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-colors duration-300"
          >
            Explore the Contract
          </a>
          <a
            href="#features"
            className="px-6 py-3 font-bold text-pink-600 bg-transparent border-2 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
      <InitializeContract/>
    </div>
 );
};

export default LandingPage;
