"use client"
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import Web3 from 'web3';
import { AccountDetails, WalletContextValue } from './web3';
// Interface to define the shape of the account details

// Create the WalletContext with default values
export const WalletContext = createContext<WalletContextValue>({
  accountDetails: {
    account: '',
    network: '',
    balance: '',
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

// WalletProvider component to manage the wallet state
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    account: '',
    network: '',
    balance: '',
  });
  const [web3, setWeb3] = useState<Web3 | null>(null);

  // Check if a wallet is already connected when the component mounts
  useEffect(() => {
    const initializeWallet = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            const networkId = await web3Instance.eth.net.getId();
            const networkName = getNetworkName(Number(networkId));
            const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
            const balanceEther = web3Instance.utils.fromWei(balanceWei, 'ether');
            setAccountDetails({ account: accounts[0], network: networkName, balance: balanceEther });
          }
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      }
    };
    initializeWallet();
  }, []);

  // Connect the wallet when the user clicks the "Connect Wallet" button
  const connectWallet = async () => {
    if (window.ethereum) {
      console.log("Wallet connection triggered")
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const networkName = getNetworkName(Number(networkId));
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
        const balanceEther = web3Instance.utils.fromWei(balanceWei, 'ether');
        setAccountDetails({ account: accounts[0], network: networkName, balance: balanceEther });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('No Web3 provider detected');
    }
  };

  // Disconnect the wallet when the user clicks the "Disconnect Wallet" button
  const disconnectWallet = () => {
    setAccountDetails({ account: '', network: '', balance: '' });
    setWeb3(null);
  };

  // Update the account balance whenever the web3 instance or account changes
  useEffect(() => {
    if (web3 && accountDetails.account) {
      const fetchBalance = async () => {
        const balanceWei = await web3.eth.getBalance(accountDetails.account);
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        setAccountDetails((prevDetails) => ({ ...prevDetails, balance: balanceEther }));
      };
      fetchBalance();
    }
  }, [web3, accountDetails.account]);

  // Helper function to get the network name based on the network ID
  const getNetworkName = (networkId: number): string => {
    switch (networkId) {
      case 1:
        return 'Mainnet';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 5:
        return 'Goerli';
      case 42:
        return 'Kovan';
      case 80002:
        return 'Polygon Amoy Testnet';
      default:
        return 'Unknown Network';
    }
  };

  // Provide the accountDetails, connectWallet, and disconnectWallet functions to the children components
  return (
    <WalletContext.Provider value={{ accountDetails, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};