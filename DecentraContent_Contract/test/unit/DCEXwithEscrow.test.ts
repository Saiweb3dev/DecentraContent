import { ethers } from "hardhat";
import { DCEXwithEscrowTest } from "../../typechain";
import { expect } from "chai";

describe("DCEXwithEscrow Contract", () => {
 let DCEXwithEscrowTest: DCEXwithEscrowTest;
 const customerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
 const customerWallet = new ethers.Wallet(customerPrivateKey, ethers.provider);
 const editorPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
 const editorWallet = new ethers.Wallet(editorPrivateKey, ethers.provider);
 const customerAddress = customerWallet.address;
 const editorAddress = editorWallet.address;

 let tokenCounter = 0;
 let fileLocation = "ipfs://QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU";
 let amountSent = ethers.parseEther("10");
 let tx: any;
 let DCEX_Customer: DCEXwithEscrowTest;
 let DCEX_Editor: DCEXwithEscrowTest;

 beforeEach(async () => {
    const DCEXwithEscrowTestFactory = await ethers.getContractFactory("DCEXwithEscrowTest");
    DCEXwithEscrowTest = await DCEXwithEscrowTestFactory.deploy();
    tx = await DCEXwithEscrowTest.initializeToken(customerAddress, editorAddress, { value: amountSent });
    await tx.wait();
    tokenCounter = 1;
    DCEX_Customer = DCEXwithEscrowTest.connect(customerWallet);
    DCEX_Editor = DCEXwithEscrowTest.connect(editorWallet);
 });

 it("TokenInfo in the contract and amount sent to Escrow", async () => {
    const tokenInfo = await DCEXwithEscrowTest.getTokenInfo(tokenCounter);
    const tokenCustomer = tokenInfo[1];
    const tokenEditor = tokenInfo[0];
    const amountReceivedInEscrow = await DCEXwithEscrowTest.getAmountReceivedInEscrow(tokenCounter);
    expect(tokenCustomer).to.equal(customerAddress);
    expect(tokenEditor).to.equal(editorAddress);
    console.log("Amount sent to Escrow -> ",ethers.formatEther(amountReceivedInEscrow.toString()))
    expect(amountReceivedInEscrow.toString()).to.be.equal(amountSent);
 });

 it("Initial File Location", async () => { 

  
   console.log("Initial File Location")
   console.log("----------------------")
    const setInitialFileLocation = await DCEX_Customer.initialFileLocation(fileLocation, tokenCounter);
    const getInitialFileLocation = await DCEX_Editor.getInitialFileLocation(tokenCounter);
    const amountSentToEditorForConfirmation = await DCEXwithEscrowTest.getConfirmationAmountReceivedInEscrow(tokenCounter);
    console.log("Amount Sent To Editor For Confirmation -> ", ethers.formatEther(amountSentToEditorForConfirmation.toString()));
    expect(getInitialFileLocation).to.equal(fileLocation);


    console.log("Sending Preview File")
    console.log("----------------------")
    const sendingPreviewOfEditedFile = await DCEX_Editor.previewOfEditedFile(fileLocation,tokenCounter);
    const getPreviewOfEditedFile = await DCEX_Customer.getPreviewOfEditedFile(tokenCounter);
    expect(getPreviewOfEditedFile).to.equal(fileLocation);


    console.log("Approving Preview")
    console.log("----------------------")
    const approveEditedPreview = await DCEX_Customer.approveEditedPreview(tokenCounter);
    const getPreviewAmountReceivedInEscrow = await DCEXwithEscrowTest.getPreviewAmountReceivedInEscrow(tokenCounter);
    console.log("Amount Sent to Editor for Preview -> ", ethers.formatEther(getPreviewAmountReceivedInEscrow.toString()));

    console.log("Minting the the final file")
    console.log("----------------------")
    const mintingTheEditedFile = await DCEX_Editor.mintEditedToken(tokenCounter,fileLocation);
    const totalAmountSentToEditor = await DCEXwithEscrowTest.getTotalAmountSentToEditorInEscrow(tokenCounter);
    console.log("Total Amount Sent to Editor -> ", ethers.formatEther(totalAmountSentToEditor.toString()));

    console.log("Check the customer is the owner of the token")
    console.log("----------------------")
    const isCustomerOwner = await DCEXwithEscrowTest.isCustomerOwner(tokenCounter);
    console.log(isCustomerOwner)
    expect(isCustomerOwner).to.be.true;

    console.log("Check the token supply and token Exist")
    console.log("----------------------")
    const totalSupply = await DCEXwithEscrowTest.totalSupply();
    expect(totalSupply).to.be.equal(tokenCounter);
    console.log("Supply -> ",totalSupply)
    const tokenExist = await DCEXwithEscrowTest.tokenExists(tokenCounter);
    expect(tokenExist).to.be.true;

    console.log("Transferring the token ownership")
    console.log("----------------------")
    const newOwner = editorAddress;
    const transferToken = await DCEX_Customer.transferToken(tokenCounter,newOwner)
    console.log("Checking the New owner")
    const isNewOwner = await DCEXwithEscrowTest.getOwnerOf(tokenCounter);
    console.log("New Owner Address -> ",isNewOwner)
    expect(isNewOwner).to.be.equal(editorAddress);
 });



});
