"use client"
import React, { useState } from 'react';
import useContract from '@/hooks/useContract'; // Adjust the import path as necessary

// Need to collect the preivew data from the event and it is not done yet

const FilePreview: React.FC = () => {
  const [tokenCounter, setTokenCounter] = useState<number>(0);
  const { callContractFunction } = useContract();
  const [preview, setPreview] = useState<string>('');

  const getFilePreview = async () => {
    try {
      const result = await callContractFunction(
        'getPreviewOfEditedFile', // Name of the smart contract function
        [tokenCounter], // Parameters passed to the function
        "0" // No ether needed for this operation
      );
      

      if (result) {
        setPreview(result);
      } else {
        alert('No preview found for the given token counter.');
      }
    } catch (error) {
      console.error('Error fetching file preview:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-6 max-w-5xl mx-auto bg-black border-pink-600 rounded-lg border-2 p-6">
      <span className="text-3xl font-bold">Get Edited File Preview</span>
      <p className="text-white">Enter the token counter to get the edited file preview.</p>
      <input
        type="number"
        placeholder="Token Counter"
        value={tokenCounter}
        onChange={(e) => setTokenCounter(Number(e.target.value))}
        className="text-pink-600 border border-pink-600 placeholder:text-white bg-black p-2 rounded-lg mb-4"
        required
      />
      <button
        type="button"
        onClick={getFilePreview}
        className="text-xl bg-pink-600 hover:bg-pink-500 duration-200 py-2 px-4 rounded-lg w-fit"
      >
        Fetch Preview
      </button>
      {preview && <p className="text-white mt-4">Edited File Preview: {preview}</p>}
    </div>
  );
};

export default FilePreview;
