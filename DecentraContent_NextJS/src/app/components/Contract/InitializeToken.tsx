"use client"
import { useState } from 'react';
import useContract from '../../hooks/useContract';

const InitializeContract = () => {
  const { callContractFunction } = useContract();
 

  const handleContractCall = async () => {
    try {
      // Replace these with the actual addresses you want to pass
      const address1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const address2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

      const result = await callContractFunction('initializeToken', [address1, address2]);
      
      console.log('Result:', result);
    } catch (error) {
      console.error('Error calling contract function:', error);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center space-y-6 bg-blue-500'>
      <button className='text-xl bg-green-500 p-4 rounded-lg' onClick={handleContractCall}>Call Contract Function</button>
      
    </div>
  );
};
export default InitializeContract;