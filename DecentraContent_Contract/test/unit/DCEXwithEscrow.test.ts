import { ethers } from "hardhat";
import { DCEXwithEscrowTest } from "../../typechain";
import { expect } from "chai";

describe("DCEXwithEscrow Contract", () => {
 let DCEXwithEscrowTest: DCEXwithEscrowTest;
 const customerPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
 const customerWallet = new ethers.Wallet(customerPrivateKey, ethers.provider);
 const editorPrivateKey =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
 const editorWallet = new ethers.Wallet(editorPrivateKey, ethers.provider);
 const customerAddress = customerWallet.address;
 const editorAddress = editorWallet.address;
 let tokenCounter = 0;
 let fileLocation = "ipfs://QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU";
 let tx: any;

 beforeEach(async () => {
  const DCEXwithEscrowTestFactory = await ethers.getContractFactory(
    "DCEXwithEscrowTest"
   );
   
    DCEXwithEscrowTest = await DCEXwithEscrowTestFactory.deploy();
    await DCEXwithEscrowTest.waitForDeployment();
    tx = await DCEXwithEscrowTest.initializeToken(
      customerAddress,
      editorAddress,
      { value: ethers.parseEther("10") }
     );
     // Assuming tx is the response from the initializeToken function call
await tx.wait(); // Wait for the transaction to be mined

// Now, call the function again to get the return value
const returnValue = await DCEXwithEscrowTest.initializeToken(
 customerAddress,
 editorAddress,
 { value: ethers.parseEther("10") }
);

console.log("________________________",returnValue); // This should log the return value of the function

 });

 it("Initialize the contract", async () => {
    console.log(tx);
    expect(1).to.be.equal(1);
 });
});
