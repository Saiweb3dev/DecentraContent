// Public_Functions/GetTokenInfo.tsx
import React from "react";
import Web3 from "web3";
import useViewContract from "../../../hooks/useViewContract"; // Import useViewContract instead of useContract

interface TokenInfo {
  editor: string | null;
  customer: string | null;
  escrow: string | null;
}

interface GetTokenInfoProps {
  tokenId: string | null;
}

const GetTokenInfo: React.FC<GetTokenInfoProps> = ({ tokenId }) => {
  const { callViewContractFunction } = useViewContract(); // Use useViewContract
  const [tokenInfo, setTokenInfo] = React.useState<TokenInfo>({
    editor: null,
    customer: null,
    escrow: null,
  });

  const handleGetTokenInfo = async () => {
    try {
      if (tokenId) {
        console.log("Calling getTokenInfo with tokenId:", tokenId);
        const tokenIdBN = Web3.utils.toBigInt(tokenId);
        // Call the view function using callViewContractFunction
        const result = await callViewContractFunction(
          "getTokenInfo",
          [tokenIdBN], // Pass the token ID as a BigNumber
          undefined, // No Ether value is sent for view functions
          true // Indicating this is a view function
        );

        console.log("Result In Get Token Info:", result);

        // Assuming result is an array with the expected values
        if (Array.isArray(result) && result.length === 3) {
          const [editor, customer, escrow] = result;
          console.log("Token Info:", editor, customer, escrow);
          setTokenInfo({ editor, customer, escrow });
        } else {
          console.error("Unexpected return value from getTokenInfo");
        }
      } else {
        console.log("tokenId is null or undefined");
      }
    } catch (error) {
      console.error("Error getting token info:", error);
    }
  };

  React.useEffect(() => {
    if (tokenId) {
      handleGetTokenInfo();
    }
  }, [tokenId]);

  return (
    <div>
      <span>Token Id: {tokenId} Information In Contract</span>
      {tokenInfo.editor && <p>Editor: {tokenInfo.editor}</p>}
      {tokenInfo.customer && <p>Customer: {tokenInfo.customer}</p>}
      {tokenInfo.escrow && <p>Escrow: {tokenInfo.escrow}</p>}
    </div>
  );
};

export default GetTokenInfo;
