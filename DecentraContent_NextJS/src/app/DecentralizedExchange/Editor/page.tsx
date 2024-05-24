"use client"
import React from 'react';

import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const route = useRouter();
  const handleViewDetail = () => {
    route.push('/DecentralizedExchange/Editor/EditorContractDashboard')
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="bg-pink-600 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Editor Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-black text-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Deals Done</h2>
            <p className="text-4xl">25</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Orders Pending</h2>
            <p className="text-4xl">8</p>
          </div>
          <div className="bg-black text-white rounded-lg p-4 flex items-center justify-center">
            <button onClick={handleViewDetail} className="bg-pink-500 text-white font-bold py-2 px-4 rounded">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;