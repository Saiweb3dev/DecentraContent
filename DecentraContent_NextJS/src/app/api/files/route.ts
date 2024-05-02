import { NextResponse, NextRequest } from "next/server";

export const config = {
 api: {
    bodyParser: false,
 },
};

export async function POST(request: NextRequest) {
 try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const metadata = data.get("metadata"); // Assuming metadata is sent as a string
    const metadataString = metadata !== null ? String(metadata) : null;

    // Step 1: Upload the file to Pinata to get the IPFS hash
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    const { IpfsHash: fileIpfsHash } = await res.json();
    console.log("File IPFS Hash:", fileIpfsHash);

    // Step 2: Add the file's IPFS hash to the metadata as a URL
    const parsedMetadata = metadataString ? JSON.parse(metadataString) : {};
    parsedMetadata.url = `ipfs://${fileIpfsHash}`; // Assuming you want to add the URL in this format

    // Step 3: Upload the updated metadata to Pinata to get the IPFS hash for the JSON
    const metadataFormData = new FormData();
    metadataFormData.append("file", new Blob([JSON.stringify(parsedMetadata)], { type: "application/json" }));

    const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: metadataFormData,
    });

    const { IpfsHash: metadataIpfsHash } = await metadataRes.json();
    console.log("Metadata IPFS Hash:", metadataIpfsHash);

    // Construct the gateway URL for the JSON metadata
    const metadataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`;

    // Return both the file IPFS hash and the metadata IPFS hash
    return NextResponse.json({ fileIpfsHash, metadataIpfsHash, metadataGatewayUrl }, { status: 200 });
 } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
 }
}
