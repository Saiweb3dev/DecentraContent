"use client"
import React, { useState } from "react";
import useContract from "@/hooks/useContract";

const PreviewOfEditedFile = () => {
  const [tokenCounter, setTokenCounter] = useState<number>(0);
  const [initialFileLocation, setInitialFileLocation] = useState<string>("");
  const { callContractFunction } = useContract();

  const getPreviewOfEditedFile = async () => {
    try {
      const result = await callContractFunction(
        "getInitialFileLocation",
        [initialFileLocation,tokenCounter],
        "0"
      );
      if (result) {
        setInitialFileLocation(result);
      } else {
        alert("No initial file location found for the given token counter.");
      }
    } catch (error) {
      console.error("Error fetching initial file location:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-pink-600 p-6 rounded-lg">
      <div className="flex flex-col justify-center items-center space-y-6">
        <h1 className="text-4xl font-bold">Set Preview File Location</h1>
        <label>Enter the token counter</label>
        <input
          type="number"
          placeholder="Token Counter"
          value={tokenCounter}
          onChange={(e) => setTokenCounter(Number(e.target.value))}
          className="text-pink-600 border border-pink-600 placeholder:text-white bg-black p-2 rounded-lg mb-4"
          required
        />
        <label>Enter the File Location</label>
        <input
          type="text"
          placeholder="Initial File Location"
          value={initialFileLocation}
          onChange={(e) => setInitialFileLocation(e.target.value)}
          className="text-pink-600 border border-pink-600 placeholder:text-white bg-black p-2 rounded-lg mb-4"
          required
        />
        <button
          type="button"
          onClick={getPreviewOfEditedFile}
          className="text-xl bg-pink-600 hover:bg-pink-500 duration-200 py-2 px-4 rounded-lg w-fit border-2 border-black"
        >
          Get Initial File Location
        </button>
        {initialFileLocation && (
          <p className="text-white mt-4">
            Initial File Location: {initialFileLocation}
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewOfEditedFile;