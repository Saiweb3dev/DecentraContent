"use client";
import useContract from "@/hooks/useContract";
import { useState } from "react";
const GetInitialFileLocation = () => {
  const { callContractFunction } = useContract();
  const [tokenCounter, setTokenCounter] = useState<number>(0);
  let initialFileLocation = "TODO";
  const getInitialFileLocation = async () => {
    try {
      const result = await callContractFunction(
        "getInitialFileLocation",
        [tokenCounter],
        "0"
      );
      if (result) {
        console.log(result);
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
        <h1 className="text-4xl font-bold">Get Initial File Location</h1>
        <label>Enter the token counter</label>
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
          onClick={getInitialFileLocation}
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
export default GetInitialFileLocation;
