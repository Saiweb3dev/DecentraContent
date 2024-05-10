import { useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { WalletContext } from '../contexts/WalletContext';
import { abi, contractAddressVar } from '../../../constant/index';

const contractAddress = contractAddressVar as { [key: string]: string };

const useContract = () => {
  const { accountDetails } = useContext(WalletContext);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (accountDetails.account && window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const contractInstance = new web3.eth.Contract(abi, contractAddress["31337"]);
          setContract(contractInstance);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      }
    };

    initializeContract();
  }, [accountDetails.account]);

  const callContractFunction = async (
    functionName: string,
    params?: any[],
    value?: string
  ) => {
    if (contract && accountDetails.account) {
      try {
        const tx = await contract.methods[functionName](...(params || []))
          .send({ from: accountDetails.account, value: value || '0' });
        return tx;
      } catch (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
    } else {
      console.error('Contract or account not initialized');
    }
  };

  return { callContractFunction };
};

export default useContract;