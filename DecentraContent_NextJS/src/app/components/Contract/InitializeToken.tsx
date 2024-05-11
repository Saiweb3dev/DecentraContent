"use client";
import React, { useState } from "react";
import Web3 from "web3";
import useContract from "../../hooks/useContract";
import GetTokenInfo from "./Public_Functions/GetTokenInfo";

// Adjust the type for the return values of the TokenAssigned event
interface TokenAssignedReturnValues {
  0: string; // tokenId
  1: string; // address1
  2: string; // address2
}

const InitializeContract: React.FC = () => {
  const { callContractFunction } = useContract();
  const [tokenData, setTokenData] = useState<{
    tokenId: string | null;
    address1: string | null;
    address2: string | null;
  }>({ tokenId: null, address1: null, address2: null });
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  const handleContractCall = async () => {
    try {
      const address1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const address2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

      const valueInWei = Web3.utils.toWei("1", "ether"); // Sending 1 Ether

      const result = await callContractFunction(
        "initializeToken",
        [address1, address2],
        valueInWei
      );

      // Extract data from the TokenAssigned event
      const tokenIdFromEvent = result.events.TokenAssigned
        .returnValues as TokenAssignedReturnValues;
      const tokenIdBigInt = BigInt(tokenIdFromEvent[0]); // Convert to BigInt for large numbers
      const tokenIdString = tokenIdBigInt.toString(); // Convert to string for display
      const editorAddress = tokenIdFromEvent[1];
      const customerAddress = tokenIdFromEvent[2];

      setTokenData({
        tokenId: tokenIdString,
        address1: editorAddress,
        address2: customerAddress,
      });

      console.log("Token Id -> ", tokenIdString);
      console.log("Address 1 -> ", editorAddress);
      console.log("Address 2 -> ", customerAddress);
      console.log("Result:", result);
    } catch (error) {
      console.error("Error calling contract function:", error);
    }
  };

  const handleGetTokenInfo = () => {
    setShowTokenInfo(true);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-6 mt-6">
      <h1 className="text-center">
        <span className="text-3xl font-bold">Initialize Token</span>
        <p>
          Enter the Amount and Enter the Address of Editor and Customer and
          click the button to initialize the token
        </p>
      </h1>
      <div className="flex flex-row justify-center items-center space-x-6">
        <div className="flex flex-col justify-center items-center space-y-6 bg-pink-600 rounded-lg border-2 p-6">
          <label className="text-xl font-semibold">Enter the Amount in ETH</label>
          <input
            className="text-white placeholder:text-white bg-black p-2 rounded-lg"
            type="number"
            step="any"
            min="0"
            placeholder="Enter Ether amount"
          />
          <button
            className="text-xl bg-black hover:bg-gray-900 duration-200 p-2 rounded-lg w-full"
            onClick={handleContractCall}
          >
            Initialize
          </button>
        </div>
        <div className="flex flex-col justify-center items-left bg-pink-600 space-y-6 p-4 border-2 rounded-lg">
          <span className="text-3xl font-bold">Token Information</span>
          {tokenData.tokenId && (
            <p className="text-white">Token ID: {tokenData.tokenId}</p>
          )}
          {tokenData.address1 && (
            <p className="text-white">Editor Address : {tokenData.address1}</p>
          )}
          {tokenData.address2 && (
            <p className="text-white">Customer Address : {tokenData.address2}</p>
          )}
          <button
            className="text-xl bg-black hover:bg-gray-900 duration-200 p-2 rounded-lg w-full"
            onClick={handleGetTokenInfo}
            disabled={!tokenData.tokenId}
          >
            Get Token Info
          </button>
          {showTokenInfo && tokenData.tokenId && (
            <GetTokenInfo tokenId={tokenData.tokenId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InitializeContract;