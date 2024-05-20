// FileUploader.tsx
import React, { useState, useRef } from 'react';
import { FileUploaderForm } from './FileUploaderForm';
import { format } from 'date-fns';

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
 const [isFileSelected, setIsFileSelected] = useState(false);
 const [showPreview, setShowPreview] = useState(false); // New state for preview visibility

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        fileUrl: URL.createObjectURL(selectedFile),
        currentDateTime: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      }));
      setIsFileSelected(true);
    }
 };

 const handleMetadataChange = (name: string, value: string) => {
    setMetadata((prevMetadata) => ({ ...prevMetadata, [name]: value }));
 };

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(file, metadata);
 };

 const handleDiscard = () => {
    setFile(null);
    setMetadata({
      customerName: "",
      customerWalletAddress: "",
      editorName: "",
      editorWalletAddress: "",
      tokenNumber: "",
      currentDateTime: "",
      fileUrl: "",
    });
    setIsFileSelected(false);
 };

 const togglePreview = () => {
    setShowPreview(!showPreview);
 };

 return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center justify-center">
        {isFileSelected ? (
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 mr-4"
            onClick={handleDiscard}
          >
            Discard
          </button>
        ) : (
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 mr-4"
            onClick={() => inputFile.current?.click()}
          >
            Select File
          </button>
        )}
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {file && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-black font-semibold text-3xl mb-2">
            File Preview:
          </p>
          {showPreview ? (
            <>
              <img
                src={metadata.fileUrl}
                alt="File Preview"
                className="w-64 h-64 rounded-2xl shadow-lg"
              />
              <button
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={togglePreview}
              >
                Close Preview
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              onClick={togglePreview}
            >
              Show Preview
            </button>
          )}
        </div>
      )}
      <FileUploaderForm
        metadata={metadata}
        onMetadataChange={handleMetadataChange}
        onSubmit={handleSubmit}
      />
    </div>
 );
};
