"use client";
import { useState } from "react";
import { copyToClipboard } from "../../utils/copyToClipboard";

interface FileUploadAPIProps {
  file: File | null;
  metadata: any;
}

export const FileUploadAPI: React.FC<FileUploadAPIProps> = ({
  file,
  metadata,
}) => {
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadSuccess(false);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(metadata));
      console.log("Data Sent to the API:", formData);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      console.log("Response data:", resData);
      setCid(resData.metadataIpfsHash);
      setUploadSuccess(true);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <button
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        disabled={!file || uploading}
        onClick={uploadFile}
      >
        {uploading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </div>
        ) : (
          "Upload"
        )}
      </button>
      {cid && (
        <div className="flex flex-col space-y-6 justify-center items-center">
          <h1 className="text-2xl font-bold text-black">Uploaded File:</h1>
          <div className="flex items-center">
            <input
              type="text"
              value={`ipfs://${cid}`}
              readOnly
              className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-l-md"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
              onClick={() => copyToClipboard(`ipfs://${cid}`)}
            >
              Copy
            </button>
          </div>
        </div>
      )}
      {uploadSuccess && (
        <p className="mt-4 text-green-600 font-semibold">
          File uploaded successfully!
        </p>
      )}
    </div>
  );
};
