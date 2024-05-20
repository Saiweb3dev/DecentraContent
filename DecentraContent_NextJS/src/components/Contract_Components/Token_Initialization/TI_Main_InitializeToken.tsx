// Import necessary libraries and components
"use client";
import React, { useState } from "react";
import Web3 from "web3"; // Used for converting ETH to Wei
import useContract from "../../../hooks/useContract"; // Custom hook for interacting with the smart contract
import GetTokenInfo from "../Public_Functions/GetTokenInfo"; // Component to display token info
import Get_TokenInfo_Button from "./TI_GetTokenInfoButton"; // Updated import path
import Token_InformationDisplay from "./TI_InformationDisplay"; // Updated import path
import Token_InputForm from "./TI_InputForm"; // Updated import path

// Define TypeScript interface for the expected return values from the TokenAssigned event
interface TokenAssignedReturnValues {
  0: string; // tokenId
  1: string; // address1 (editor)
  2: string; // address2 (customer)
}

// Main component for initializing tokens
const InitializeContract: React.FC = () => {
  const { callContractFunction } = useContract(); // Destructure callContractFunction from custom hook
  const [editorAddress, setEditorAddress] = useState<string>(""); // State for storing editor's address
  const [customerAddress, setCustomerAddress] = useState<string>(""); // State for storing customer's address
  const [amountInEth, setAmountInEth] = useState<string>(""); // State for storing the amount in ETH
  const [tokenData, setTokenData] = useState<{
    // State for storing token data
    tokenId: string | null;
    address1: string | null;
    address2: string | null;
  }>({ tokenId: null, address1: null, address2: null });
  const [showTokenInfo, setShowTokenInfo] = useState<boolean>(false); // State for toggling token info visibility

  // Function to handle the contract call for initializing the token
  // Function to handle the contract call for initializing the token
  const handleContractCall = async () => {
    // Check if all required fields are filled
    if (!editorAddress || !customerAddress || !amountInEth) {
      let missingFields = [];
      if (!editorAddress) missingFields.push("Editor Address");
      if (!customerAddress) missingFields.push("Customer Address");
      if (!amountInEth) missingFields.push("Amount in ETH");

      alert(
        `Please fill out the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const isValidAddress = (address: string): boolean => {
      const addressPattern = /^0x[0-9a-fA-F]{40}$/;
      return addressPattern.test(address);
    };

    // Usage
    if (!isValidAddress(editorAddress)) {
      alert("Invalid Editor Address. Please enter a valid Ethereum address.");
      return;
    }
    if (!isValidAddress(customerAddress)) {
      alert("Invalid Customer Address. Please enter a valid Ethereum address.");
      return;
    }

    if (customerAddress == editorAddress) {
      alert("Customer Address cannot be same as Editor Address");
      return;
    }

    try {
      const valueInWei = Web3.utils.toWei(amountInEth, "ether"); // Convert ETH to Wei

      const result = await callContractFunction(
        // Call the smart contract function
        "initializeToken",
        [editorAddress, customerAddress], // Pass editor and customer addresses as arguments
        valueInWei // Send the specified amount in Wei
      );

      // Extract data from the TokenAssigned event
      const tokenIdFromEvent = result.events.TokenAssigned
        .returnValues as TokenAssignedReturnValues;
      const tokenIdBigInt = BigInt(tokenIdFromEvent[0]); // Convert tokenId to BigInt
      const tokenIdString = tokenIdBigInt.toString(); // Convert tokenId to string for display
      const receivedEditorAddress = tokenIdFromEvent[1]; // Extract editor address
      const receivedCustomerAddress = tokenIdFromEvent[2]; // Extract customer address

      setTokenData({
        // Update state with new token data
        tokenId: tokenIdString,
        address1: receivedEditorAddress,
        address2: receivedCustomerAddress,
      });

      console.log("Token Id -> ", tokenIdString);
      console.log("Address 1 -> ", receivedEditorAddress);
      console.log("Address 2 -> ", receivedCustomerAddress);
      console.log("Result:", result);
    } catch (error) {
      console.error("Error calling contract function:", error);
    }
  };

  // Function to toggle the display of token info
  const handleGetTokenInfo = () => {
    setShowTokenInfo(true);
  };

  // Render the component UI
  return (
    <div className="flex flex-col max-w-5xl mx-auto h-fit bg-black rounded-lg border-2 p-6 justify-center items-center space-y-6 my-12">
      {/* Title and description */}
      <h1 className="text-center">
        <span className="text-3xl font-bold">Initialize Token</span>
        <p>
          Enter the Amount and Enter the Address of Editor and Customer and
          click the button to initialize the token
        </p>
      </h1>
      {/* Input fields and buttons */}
      <div className="flex flex-row justify-center items-center space-x-6">
        {/* Section for inputting editor and customer addresses, and amount */}
        <Token_InputForm
          editorAddress={editorAddress}
          setEditorAddress={setEditorAddress}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
          amountInEth={amountInEth}
          setAmountInEth={setAmountInEth}
          handleContractCall={handleContractCall}
        />
        {/* Section for displaying token information */}
        <div className="flex flex-col justify-center items-left bg-black space-y-6 p-4 border-2 rounded-lg">
          <Token_InformationDisplay tokenData={tokenData} />
          <Get_TokenInfo_Button
            handleGetTokenInfo={handleGetTokenInfo}
            tokenId={tokenData.tokenId}
          />
          {showTokenInfo && tokenData.tokenId && (
            <GetTokenInfo tokenId={tokenData.tokenId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InitializeContract;
