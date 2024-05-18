"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { getEditorsData } from '../EditorsData_Address';
import { useRouter } from 'next/navigation';
const CustomerDetailsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const editorsAddress = pathname.split('/').pop();

  console.log(editorsAddress); // This will log only the customer address part of the URL
   const editorsData = getEditorsData(editorsAddress as string)
  // Fetch customer data based on the customerAddress
  // and pass it to the Customer component

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
  <div className="max-w-4xl w-full bg-pink-600 rounded-lg shadow-xl p-8">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">Editor's Profile</h1>
      <button className="relative bg-black text-pink-500 font-semibold py-2 px-6 rounded-lg overflow-hidden transition-all duration-300 hover:bg-pink-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50" onClick={() => {
       router.push("/DecentralizedExchange/Customer/ContractDashboard")
      }}>
        <span className="relative z-10">Start a new deal</span>
        <div className="absolute top-0 left-0 w-full h-full bg-pink-500 opacity-0 transition-all duration-300 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0"></div>
      </button>
    </div>
    {editorsData ? (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Name
          </label>
          <p className="text-xl font-semibold text-white">{editorsData.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Address
          </label>
          <p className="text-white">{editorsData.address}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Total Deals Done
          </label>
          <p className="text-white">{editorsData.dealsDone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Works Done by him
          </label>
          <p className="text-white">{editorsData.worksDone}</p>
        </div>
      </div>
    ) : (
      <p className="text-red-500">Editor not found</p>
    )}
  </div>
</div>
  );
};

export default CustomerDetailsPage;