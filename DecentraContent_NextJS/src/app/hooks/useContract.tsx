import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { abi, contractAddressVar } from "../../../constant/index";
import { WalletContext } from "../../contexts/WalletContext";

const contractAddress = contractAddressVar as { [key: string]: string };

const useInitializeContract = () => {
  const { accountDetails } = useContext(WalletContext);
  const [contract, setContract] = useState<any>(null);

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
    };

    initializeContract();
  }, [accountDetails.account]);

  return contract;
};

const useContract = () => {
  const contract = useInitializeContract();
  const { accountDetails } = useContext(WalletContext);

  const callContractFunction = async (
    functionName: string,
    params?: any[],
    value?: string
  ) => {
    if (contract && accountDetails.account) {
      try {
        const tx = await contract.methods[functionName](...(params || [])).send(
          { from: accountDetails.account, value: value || "0" }
        );
        return tx;
      } catch (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
    } else {
      console.error("Contract or account not initialized");
    }
  };

  return { callContractFunction };
};

export default useContract;
