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
    <div className='flex flex-col justify-center items-center space-y-2 bg-pink-600 rounded-lg p-4 text-white'>
      <h3 className='text-2xl text-black font-semibold'>{customer.name}</h3>
      <p>Address: {customer.address}</p>
      <p>Total Deals Done: {customer.dealsDone}</p>
      <button className='bg-white text-black px-4 py-2 rounded-lg' onClick={handleViewDetailsClick}>
        View Details
      </button>
    </div>
  );
};

export default EditorList;
