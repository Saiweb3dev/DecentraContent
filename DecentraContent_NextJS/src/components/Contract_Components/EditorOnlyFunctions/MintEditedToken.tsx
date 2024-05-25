"use client"
import React, { useState } from "react";
import useContract from "@/hooks/useContract";
const MintEditedToken = () => {
  const {callContractFunction} = useContract();
  const [tokenCounter,setTokenCounter] = useState<number>(0);
  const [editedFileURL,setEditedFileURL] = useState<string>("");

  const mintEditedTokenHandler = async () => {
    try{
      const result = await callContractFunction("mintEditedToken",[tokenCounter,editedFileURL],"0")
      if(result){
        console.log(result)
      }else{
        alert("No initial file location found for the given token counter.");
      }
    }catch(error){
      console.error("Error fetching initial file location:", error)
      alert("An error occurred. Please try again later.");
    }
  }
  return(
    <div className="w-full h-fit mt-6">
      <div className="flex flex-col justify-center items-center bg-pink-600 p-6 rounded-lg max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Mint The Token</h1>
        <label>Enter the Token Counter</label>
        <input
          type="number"
          placeholder="Token Counter"
          value={tokenCounter}
          onChange={(e) => setTokenCounter(Number(e.target.value))}
          className="text-pink-600 border border-pink-600 placeholder:text-white bg-black p-2 rounded-lg mb-4"
          required
        />
        <label>Enter the Edited file URL</label>
        <input
          type="text"
          placeholder="Edited File URL"
          value={editedFileURL}
          onChange={(e) => setEditedFileURL(e.target.value)}
          className="text-pink-600 border border-pink-600 placeholder:text-white bg-black p-2 rounded-lg mb-4"
          required
        />
        <button
          type="button"
          onClick={mintEditedTokenHandler}
          className="text-xl bg-pink-600 hover:bg-pink-500 duration-200 py-2 px-4 rounded-lg w-fit border-2 border-black"
        >
          Mint
        </button>
      </div>
    </div>
  )
}
export default MintEditedToken;