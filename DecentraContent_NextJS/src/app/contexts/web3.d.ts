import Web3 from 'web3';

interface Window {
  ethereum?: {
    enable: () => Promise<void>;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
  web3?: {
    currentProvider: Web3.Provider;
  };
}

interface Window {
  ethereum: Web3.provider;
}
export interface AccountDetails {
  account: string;
  network: string;
  balance: string;
}

export interface WalletContextValue {
  accountDetails: AccountDetails;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}