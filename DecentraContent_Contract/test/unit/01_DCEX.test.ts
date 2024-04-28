import { ethers } from "hardhat";
import { DCEXwithEscrowTest } from "../../typechain";
import { expect } from "chai";

describe("DCEXwithEscrow Contract - Unit Tests", () => {
 let DCEXwithEscrowTest: DCEXwithEscrowTest;
 const customerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
 const customerWallet = new ethers.Wallet(customerPrivateKey, ethers.provider);
 const editorPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
 const editorWallet = new ethers.Wallet(editorPrivateKey, ethers.provider);
 const customerAddress = customerWallet.address;
 const editorAddress = editorWallet.address;
 const amountSent = ethers.parseEther("10");

 beforeEach(async () => {
    const DCEXwithEscrowTestFactory = await ethers.getContractFactory("DCEXwithEscrowTest");
    DCEXwithEscrowTest = await DCEXwithEscrowTestFactory.deploy();
 });

 it("should initialize a token correctly", async () => {
    // Call the initializeToken function
    const tx = await DCEXwithEscrowTest.initializeToken(customerAddress, editorAddress, { value: amountSent });
    await tx.wait();

    // Retrieve the token information
    const tokenInfo = await DCEXwithEscrowTest.getTokenInfo(1);
    const tokenCustomer = tokenInfo[1];
    const tokenEditor = tokenInfo[0];
    const amountReceivedInEscrow = await DCEXwithEscrowTest.getAmountReceivedInEscrow(1);

    // Assert that the token information is as expected
    expect(tokenCustomer).to.equal(customerAddress);
    expect(tokenEditor).to.equal(editorAddress);
    expect(amountReceivedInEscrow.toString()).to.equal(amountSent.toString());
 });
});
