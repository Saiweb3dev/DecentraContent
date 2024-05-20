// Token_InformationDisplay.tsx
import React from 'react';

interface TokenData {
  tokenId: string | null;
  address1: string | null;
  address2: string | null;
}

interface TokenInformationDisplayProps {
  tokenData: TokenData;
}

const Token_InformationDisplay: React.FC<TokenInformationDisplayProps> = ({ tokenData }) => {
  return (
    <div className="flex flex-col justify-center items-left bg-black border-pink-600 space-y-6 p-4 border-2 rounded-lg">
      <span className="text-3xl font-bold">Token Information</span>
      {tokenData.tokenId && <p className="text-white">Token ID: {tokenData.tokenId}</p>}
      {tokenData.address1 && <p className="text-white">Editor Address : {tokenData.address1}</p>}
      {tokenData.address2 && <p className="text-white">Customer Address : {tokenData.address2}</p>}
    </div>
  );
};

export default Token_InformationDisplay;
