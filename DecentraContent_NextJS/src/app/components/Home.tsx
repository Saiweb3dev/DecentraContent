"use client";
import { useState } from "react";
import { FileUploader } from "./FileUploader";
import { FileUploadAPI } from "./FileUploadAPI";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  return (
    <main className="w-full min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="bg-black border-4 border-pink-600 rounded-3xl shadow-2xl p-16">
        <FileUploader onFileChange={handleFileChange} />
        <FileUploadAPI file={file} />
      </div>
    </main>
  );
}