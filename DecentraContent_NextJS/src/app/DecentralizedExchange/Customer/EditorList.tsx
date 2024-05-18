// EditorList.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  name: string;
  address: string;
  dealsDone: number; // dealsDone is a number
}

interface CustomerDisplayProps {
  customer: Customer;
}

const EditorList: React.FC<CustomerDisplayProps> = ({ customer }) => {
  const router = useRouter();

  const handleViewDetailsClick = () => {
    // Navigate to the new route with the customer's address appended
    router.push(`/DecentralizedExchange/Customer/${encodeURIComponent(customer.address)}`);
  };

  return (
    <div
  className="relative bg-gradient-to-r from-pink-500 to-pink-700 rounded-lg p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
>
  <h3 className="text-2xl font-semibold mb-4 text-white">{customer.name}</h3>
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Address</label>
    <p className="text-white">{customer.address}</p>
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Total Deals Done</label>
    <p className="text-white">{customer.dealsDone}</p>
  </div>
  <button
    className="relative bg-white text-pink-600 font-semibold py-2 px-6 rounded-lg overflow-hidden transition-all duration-300 hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50"
    onClick={handleViewDetailsClick}
  >
    <span className="relative z-10">View Details</span>
    <div className="absolute top-0 left-0 w-full h-full bg-pink-600 opacity-0 transition-all duration-300 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0"></div>
  </button>
</div>
  );
};

export default EditorList;
