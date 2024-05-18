"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { getEditorsData } from '../EditorsData_Address';

const CustomerDetailsPage = () => {
  const pathname = usePathname();
  const editorsAddress = pathname.split('/').pop();

  console.log(editorsAddress); // This will log only the customer address part of the URL
   const editorsData = getEditorsData(editorsAddress as string)
  // Fetch customer data based on the customerAddress
  // and pass it to the Customer component

  return (
    <div>
      <h1>Customer Details</h1>
      {editorsData ? (
        <>
          <p>Name: {editorsData.name}</p>
          <p>Address: {editorsData.address}</p>
          <p>Total Deals Done: {editorsData.dealsDone}</p>
          {/* Render other customer properties */}
        </>
      ) : (
        <p>Customer not found</p>
      )}
    </div>
  );
};

export default CustomerDetailsPage;