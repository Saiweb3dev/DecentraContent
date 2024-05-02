"use client";
import { useState, useRef } from "react";
import { format } from "date-fns";

interface FileUploaderProps {
  onSubmit: (file: File | null, metadata: any) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    customerName: "",
    customerWalletAddress: "",
    editorName: "",
    editorWalletAddress: "",
    tokenNumber: "",
    currentDateTime: "",
    fileUrl: "",
  });
  const inputFile = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        fileUrl: URL.createObjectURL(selectedFile),
        currentDateTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      }));
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata((prevMetadata) => ({ ...prevMetadata, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(file, metadata);
  };


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 mr-4"
          onClick={() => inputFile.current?.click()}
        >
          Select File
        </button>
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {file && (
        <div className="mb-4">
          <p className="text-black font-semibold text-3xl mb-2">
            File Preview:
          </p>
          <img
            src={metadata.fileUrl}
            alt="File Preview"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4">
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
            onChange={handleMetadataChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            onChange={handleMetadataChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            onChange={handleMetadataChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            onChange={handleMetadataChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            onChange={handleMetadataChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          disabled={!file}
        >
          Save Metadata
        </button>
      </form>
    </div>
  );
};