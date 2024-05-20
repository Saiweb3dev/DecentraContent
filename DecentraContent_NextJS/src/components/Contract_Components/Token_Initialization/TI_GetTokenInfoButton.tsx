// Get_TokenInfo_Button.tsx
import React from 'react';

interface GetTokenInfoButtonProps {
  handleGetTokenInfo: () => void;
  tokenId: string | null;
}

const Get_TokenInfo_Button: React.FC<GetTokenInfoButtonProps> = ({ handleGetTokenInfo, tokenId }) => {
  return (
    <button
      className="text-xl bg-pink-600 font-semibold hover:bg-pink-500 duration-200 p-2 rounded-lg w-full"
      onClick={handleGetTokenInfo}
      disabled={!tokenId}
    >
      Get Token Info
    </button>
  );
};

export default Get_TokenInfo_Button;
