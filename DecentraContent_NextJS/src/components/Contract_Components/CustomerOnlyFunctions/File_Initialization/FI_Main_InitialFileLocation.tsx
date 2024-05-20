"use client"
import React from 'react';
import useContract from '@/hooks/useContract';
import FileInitializationForm from './FI_InputForm';

const InitialFileLocation = () => {
  const { callContractFunction } = useContract();

  const handleFormSubmit = async (fileLocation: string, tokenCounter: number) => {
    try {
      const success = await callContractFunction(
        'initialFileLocation',
        [fileLocation, tokenCounter],
        "0"
      );

      if (success) {
        alert('File location initialized successfully!');
      } else {
        alert('Failed to initialize file location.');
      }
    } catch (error) {
      console.error('Error initializing file location:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-6 max-w-5xl mx-auto rounded-lg border-2 p-6 m-6">
      <span className="text-3xl font-bold">File Initialization</span>
      <p className="text-white">Please enter the file location and token counter.</p>
      <FileInitializationForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default InitialFileLocation;
