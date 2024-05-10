// global.d.ts
declare global {
  interface Window {
    web3?: any;
    ethereum: any;  // or a more specific type if you have one
  }
}

interface Window {
  ethereum: Web3.provider;
}
