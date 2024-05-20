import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { abi, contractAddressVar } from "../../../constant/index";
import { WalletContext } from "../../contexts/WalletContext";

const contractAddress = contractAddressVar as { [key: string]: string };

const useInitializeContract = () => {
  const { accountDetails } = useContext(WalletContext);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state

  useEffect(() => {
    const initializeContract = async () => {
      if (
        accountDetails.account &&
        typeof window !== "undefined" &&
        window.ethereum
      ) {
        try {
          const web3 = new Web3(window.ethereum);
          const contractInstance = new web3.eth.Contract(
            abi,
            contractAddress["31337"]
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      } else {
        console.error("Web3 provider or account not available");
      }
      setLoading(false); // Set loading to false once the contract is initialized
    };

    initializeContract();
  }, [accountDetails.account]);

  return { contract, loading }; // Return both contract and loading state
};

const useViewContract = () => {
  const { contract, loading } = useInitializeContract(); // Destructure contract and loading
  const { accountDetails } = useContext(WalletContext);

  const callViewContractFunction = async (
    functionName: string,
    params?: any[],
    value?: string,
    isViewFunction: boolean = false
  ) => {
    if (!loading && contract && accountDetails.account) {
      // Check if not loading
      try {
        const method = isViewFunction ? "call" : "send";
        const options = {
          from: accountDetails.account,
          value: value || "0",
        } as { from?: string; value?: string };
        if (method === "call") {
          delete options.from;
        }
        const result = await contract.methods[functionName](
          ...(params || [])
        ).call(options);
        console.log("Function result:", result);
        return result;
      } catch (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
    } else {
      console.error("Contract or account not initialized");
      throw new Error("Contract or account not initialized");
    }
  };

  return { callViewContractFunction };
};

export default useViewContract;
