"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      setUploadSuccess(false);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setUploadSuccess(true);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-pink-500 to-yellow-500 flex flex-col justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <label
            htmlFor="file"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            {uploading ? "Uploading..." : "Upload"}
          </label>
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={handleChange}
            className="hidden"
          />
        </div>
        {cid && (
          <img
            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
            alt="Image from IPFS"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        )}
        {uploadSuccess && (
          <p className="mt-4 text-green-600 font-semibold">
            File uploaded successfully!
          </p>
        )}
      </div>
    </main>
  );
}