import { expect } from "chai";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { Escrow, Escrow__factory } from "../../typechain";
import { ConfirmationAmountSentEvent } from "../../typechain/contracts/Escrow";

describe("Escrow Contract", () => {
 let escrow: Escrow;
 let customer: Address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
 let editor: Address = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
 let amountSent: number = 10;
 let amountSentToEditor: number = 0;
 let amount = ethers.parseEther("10"); // Corrected to use ethers.parseEther

 // Setup before each test
 beforeEach(async () => {
    const Escrow = await ethers.getContractFactory("EscrowTest");
    escrow = await Escrow.deploy(customer, editor);
    await escrow.waitForDeployment(); 
 });

 it("Initialize Payment", async function () {
    // Initialize payment
    await escrow.InitializePayment({ value: amount });
    const amountReceivedInContract = await escrow.amountReceived();
    console.log("Amount Sent to contract ->", amountSent.toString());
    console.log("Amount Received In Contract ->", amountReceivedInContract.toString());
    expect(amountReceivedInContract).to.equal(ethers.parseEther(amountSent.toString()));

    // Listen for the ConfirmationAmountSent event
    escrow.on("ConfirmationAmountSent", (editor, amount, event) => {
      console.log(`Confirmation amount sent to ${editor} for ${amount} wei`);
    });

    // Project Confirmation
    await escrow.ProjectConfirmation();
    amountSentToEditor = (amountSent * 10) / 100; // Calculate confirmation amount
    
    amountSent -= amountSentToEditor; // Update remaining amount
    const confirmationAmountInContract = await escrow.confirmationAmount();
    console.log("Amount Sent To Editor ->", amountSentToEditor.toString());
    console.log("Confirmation Amount In Contract ->", confirmationAmountInContract.toString());
    expect(confirmationAmountInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));

    // Setup event listener for ProjectTrailAmountSent
    await escrow.on("ProjectTrailAmountSent", (val, amount, event) => {
      console.log(`Project trial amount sent to ${val} for ${amount} wei`);
    });
    console.log("Event listener set up for ProjectTrailAmountSent.");

    // Project Trial
    await escrow.ProjectTrial();
    amountSentToEditor += (amountSent * 20) / 100; 
    const ConfirmationAmountInTest = (amountSent * 20) / 100;// Calculate trial amount
    amountSent -= ConfirmationAmountInTest; // Update remaining amount
    const projectTrialInContract = await escrow.amountSentToEditor();
    console.log("Amount Sent To Editor In Contract ->", projectTrialInContract.toString());
    expect(projectTrialInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));

    // Project Delivery
    const finalPayment = await escrow.amountReceived();
    await escrow.ProjectDelivery();
    amountSentToEditor += amountSent; // Final amount sent to editor
    const projectDeliveryInContract = await escrow.amountSentToEditor();
    console.log("Amount Sent To Editor In Contract ->", finalPayment.toString());
    expect(projectDeliveryInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));
    expect(finalPayment).to.equal(ethers.parseEther(amountSent.toString()));
 });
});
