"use client";
import { useState, useRef } from "react";
import { copyToClipboard } from "./utils/copyToClipboard";
import Home from "./components/Home";
export default function main() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadSuccess(false);
      const data = new FormData();
      data.set("file", file);
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
  };

  return (
    // <main className="w-full min-h-screen bg-gradient-to-br from-pink-500 to-yellow-500 flex flex-col justify-center items-center">
    //   <div className="bg-white rounded-3xl shadow-2xl p-8">
    //     <div className="flex items-center justify-center mb-6">
    //       <button
    //         className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 mr-4"
    //         onClick={() => inputFile.current?.click()}
    //       >
    //         Select File
    //       </button>
    //       <button
    //         className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
    //         disabled={!file || uploading}
    //         onClick={uploadFile}
    //       >
    //         {uploading ? (
    //           <div className="flex items-center">
    //             <svg
    //               className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //             >
    //               <circle
    //                 className="opacity-25"
    //                 cx="12"
    //                 cy="12"
    //                 r="10"
    //                 stroke="currentColor"
    //                 strokeWidth="4"
    //               ></circle>
    //               <path
    //                 className="opacity-75"
    //                 fill="currentColor"
    //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //               ></path>
    //             </svg>
    //             Uploading...
    //           </div>
    //         ) : (
    //           "Upload"
    //         )}
    //       </button>
    //       <input
    //         type="file"
    //         id="file"
    //         ref={inputFile}
    //         onChange={handleChange}
    //         className="hidden"
    //       />
    //     </div>
    //     {file && (
    //       <div className="mb-4">
    //         <p className="text-black font-semibold text-3xl mb-2">
    //           File Preview:
    //         </p>
    //         <img
    //           src={URL.createObjectURL(file)}
    //           alt="File Preview"
    //           className="max-w-full h-auto rounded-2xl shadow-lg"
    //         />
    //       </div>
    //     )}
    //     {cid && (
    //       <div className="flex flex-col space-y-6 justify-center items-center">
    //         <h1 className="text-2xl font-bold text-black">Uploaded File:</h1>
    //         <img
    //           src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
    //           alt="Image from IPFS"
    //           className="max-w-full h-auto rounded-2xl shadow-lg"
    //         />
    //         <div className="flex items-center">
    //           <input
    //             type="text"
    //             value={`ipfs://${cid}`}
    //             readOnly
    //             className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-l-md"
    //           />
    //           <button
    //             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
    //             onClick={() => copyToClipboard(`ipfs://${cid}`)}
    //           >
    //             Copy
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //     {uploadSuccess && (
    //       <p className="mt-4 text-green-600 font-semibold">
    //         File uploaded successfully!
    //       </p>
    //     )}
    //   </div>
    // </main>
    <Home/>
  );
}