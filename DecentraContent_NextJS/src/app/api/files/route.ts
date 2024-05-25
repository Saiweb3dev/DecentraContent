import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const metadata = data.get("metadata");
    const metadataString = metadata!== null? String(metadata) : null;

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

    const parsedMetadata = metadataString? JSON.parse(metadataString) : {};
    parsedMetadata.url = `ipfs://${fileIpfsHash}`;

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

    const metadataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`;

    return NextResponse.json({ fileIpfsHash, metadataIpfsHash, metadataGatewayUrl }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
