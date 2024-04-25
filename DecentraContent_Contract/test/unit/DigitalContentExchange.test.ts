import { expect } from "chai";
import { ethers } from "hardhat";
import { DigitalContentExchange } from "../../typechain";
import { Address } from "hardhat-deploy/dist/types";

describe("DigitalContentExchange Contract", () => {
 let DCX: DigitalContentExchange;
 let tokenCounter = 0;
 let fileLocation = "ipfs://QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU";

 // Create wallet instances with the customer and editor private keys
 const customerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
 const customerWallet = new ethers.Wallet(customerPrivateKey, ethers.provider);

 const editorPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
 const editorWallet = new ethers.Wallet(editorPrivateKey, ethers.provider);

 // Get the customer and editor addresses from the wallet instances
 const customerAddress: Address = customerWallet.address;
 const editorAddress: Address = editorWallet.address;

 beforeEach(async () => {
   // Deploy the DigitalContentExchange contract
   const DigitalContentExchangeFactory = await ethers.getContractFactory("DigitalContentExchange");
   DCX = await DigitalContentExchangeFactory.deploy();
   await DCX.waitForDeployment();

   // Initialize a new token with the customer and editor addresses
   await DCX.initializeToken(customerAddress, editorAddress);
 });

 it("Initialize the contract", async () => {
   expect(await DCX.getTokenCounter()).to.equal(1);
   tokenCounter = 1;
 });

 it("Token Info", async () => {
   const tokenInfo = await DCX.getTokenInfo(tokenCounter);
   const tokenCustomer = tokenInfo[1];
   const tokenEditor = tokenInfo[0];
   console.log(tokenInfo);
   expect(tokenCustomer).to.equal(customerAddress);
   expect(tokenEditor).to.equal(editorAddress);
 });

 it("File Location", async () => {

   // Create contract instances with the customer and editor wallets
   const DCXWithCustomer = DCX.connect(customerWallet);
   const DCXWithEditor = DCX.connect(editorWallet);

   // Set the initial file location as the customer
   const setFileLocationTx = await DCXWithCustomer.initialFileLocation(fileLocation, tokenCounter);
   await setFileLocationTx.wait();

   // Get the initial file location as the editor
   const fileLocationInfo = await DCXWithEditor.getInitialFileLocation(tokenCounter);
   console.log("File Location Info", fileLocationInfo);
   console.log("File Location", fileLocation);
   expect(fileLocationInfo).to.equal(fileLocation);
 });
});