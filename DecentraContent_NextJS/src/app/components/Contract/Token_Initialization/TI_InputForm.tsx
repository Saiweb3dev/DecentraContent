// Token_InputForm.tsx
import React from 'react';

// Define the props interface
interface InputFormProps {
  editorAddress: string;
  setEditorAddress: React.Dispatch<React.SetStateAction<string>>;
  customerAddress: string;
  setCustomerAddress: React.Dispatch<React.SetStateAction<string>>;
  amountInEth: string;
  setAmountInEth: React.Dispatch<React.SetStateAction<string>>;
  handleContractCall: () => Promise<void>;
}

const Token_InputForm: React.FC<InputFormProps> = ({
  editorAddress,
  setEditorAddress,
  customerAddress,
  setCustomerAddress,
  amountInEth,
  setAmountInEth,
  handleContractCall,
}) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 bg-pink-600 rounded-lg border-2 p-6">
      <label className="text-xl font-semibold">Enter the Address of Editor</label>
      <input
        className="text-white placeholder:text-white bg-black p-2 rounded-lg"
        type="text"
        placeholder="Enter Editor Address"
        value={editorAddress}
        onChange={(e) => setEditorAddress(e.target.value)}
      />
      <label className="text-xl font-semibold">Enter the Address of Customer</label>
      <input
        className="text-white placeholder:text-white bg-black p-2 rounded-lg"
        type="text"
        placeholder="Enter Customer Address"
        value={customerAddress}
        onChange={(e) => setCustomerAddress(e.target.value)}
      />
      <label className="text-xl font-semibold">Enter the Amount in ETH</label>
      <input
        className="text-white placeholder:text-white bg-black p-2 rounded-lg"
        type="number"
        step="any"
        min="0"
        placeholder="Enter Ether amount"
        value={amountInEth}
        onChange={(e) => setAmountInEth(e.target.value)}
      />
      <button
        className="text-xl bg-black hover:bg-gray-900 duration-200 p-2 rounded-lg w-full"
        onClick={handleContractCall}
      >
        Initialize
      </button>
    </div>
  );
};

export default Token_InputForm;
