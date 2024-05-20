"use client";
import { useState } from "react";
import { FileUploadAPI } from "./FileUploadAPI";
import { FileUploader } from "./FileUploader";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const handleSubmit = (file: File | null, metadata: any) => {
    setFile(file);
    setMetadata(metadata);
  };

  return (
    <main className="w-full bg-black">
      <div className="flex flex-col justify-center items-center mx-auto max-w-5xl h-fit border-2">
        <div className="flex flex-col space-y-6 justify-center items-center p-6">
          <h1 className="text-6xl font-bold text-pink-500">Decentra Content</h1>
          <h3 className="text-xl font-semibold">Local Image to IPFS Convertor</h3>
        </div>
        <div className="flex flex-row space-x-6 justify-center items-center border-4 border-pink-600 rounded-3xl shadow-2xl p-16">
          <FileUploader onSubmit={handleSubmit} />
          {metadata && file && <FileUploadAPI file={file} metadata={metadata} />}
        </div>
      </div>
    </main>
  );
}