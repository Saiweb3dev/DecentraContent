// FileUploaderForm.tsx
import React from 'react';
import { format } from 'date-fns';

interface FileUploaderFormProps {
 metadata: any;
 onMetadataChange: (name: string, value: string) => void;
 onSubmit: (e: React.FormEvent) => void;
}

export const FileUploaderForm: React.FC<FileUploaderFormProps> = ({ metadata, onMetadataChange, onSubmit }) => {
 return (
    <form onSubmit={onSubmit} className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <label
            htmlFor="customerName"
            className="block text-gray-700 font-bold mb-2"
          >
            Customer Name:
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={metadata.customerName}
            onChange={(e) => onMetadataChange(e.target.name, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="customerWalletAddress"
            className="block text-gray-700 font-bold mb-2"
          >
            Customer Wallet Address:
          </label>
          <input
            type="text"
            id="customerWalletAddress"
            name="customerWalletAddress"
            value={metadata.customerWalletAddress}
            onChange={(e) => onMetadataChange(e.target.name, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <label
            htmlFor="editorName"
            className="block text-gray-700 font-bold mb-2"
          >
            Editor Name:
          </label>
          <input
            type="text"
            id="editorName"
            name="editorName"
            value={metadata.editorName}
            onChange={(e) => onMetadataChange(e.target.name, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="editorWalletAddress"
            className="block text-gray-700 font-bold mb-2"
          >
            Editor Wallet Address:
          </label>
          <input
            type="text"
            id="editorWalletAddress"
            name="editorWalletAddress"
            value={metadata.editorWalletAddress}
            onChange={(e) => onMetadataChange(e.target.name, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <label
            htmlFor="tokenNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Token Number:
          </label>
          <input
            type="text"
            id="tokenNumber"
            name="tokenNumber"
            value={metadata.tokenNumber}
            onChange={(e) => onMetadataChange(e.target.name, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="currentDateTime"
            className="block text-gray-700 font-bold mb-2"
          >
            Current Date and Time:
          </label>
          <input
            type="text"
            id="currentDateTime"
            name="currentDateTime"
            value={metadata.currentDateTime}
            readOnly
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      >
        Save Metadata
      </button>
    </form>
 );
};
