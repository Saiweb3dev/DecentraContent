"use client";
import { useState, useRef } from "react";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
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
            src={URL.createObjectURL(file)}
            alt="File Preview"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};