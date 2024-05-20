"use client"
import React, { useState } from 'react';

interface FileInitializationFormProps {
  onSubmit: (fileLocation: string, tokenCounter: number) => void;
}

const FileInitializationForm: React.FC<FileInitializationFormProps> = ({ onSubmit }) => {
  const [fileLocation, setFileLocation] = useState('');
  const [tokenCounter, setTokenCounter] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileLocation.startsWith('ipfs://')) {
      setErrorMessage('Please enter a valid IPFS location starting with ipfs://');
      return;
    }

    onSubmit(fileLocation, tokenCounter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fileLocation" className="block text-sm font-medium text-white">IPFS File Location:</label>
        <input
          id="fileLocation"
          type="text"
          value={fileLocation}
          onChange={(e) => setFileLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 placeholder-gray-500 text-white bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="ipfs://Qm..."
          required
        />
        {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>
      <div>
        <label htmlFor="tokenCounter" className="block text-sm font-medium text-white">Token Counter:</label>
        <input
          id="tokenCounter"
          type="number"
          value={tokenCounter}
          onChange={(e) => setTokenCounter(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 placeholder-gray-500 text-white bg-black border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Initialize Location
      </button>
    </form>
  );
};

export default FileInitializationForm;
