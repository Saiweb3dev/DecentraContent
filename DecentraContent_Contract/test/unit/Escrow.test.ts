import { expect } from "chai";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { Escrow,Escrow__factory } from "../../typechain";
import { ConfirmationAmountSentEvent } from "../../typechain/contracts/Escrow";

describe("Escrow Contract", () => {
 let escrow: Escrow;
 let customer: Address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
 let editor: Address = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
 let amountSent: number = 10;
 let amountSentToEditor: number = 0;
 let amount = ethers.parseEther("10"); // Corrected to use ethers.utils.parseEther

 beforeEach(async () => {
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(customer, editor);
    await escrow.waitForDeployment(); // Corrected to use await escrow.deployed()
 });

 it("Initialize Payment", async function () {
    await escrow.InitializePayment({ value: amount });
    const amountReceivedInContract = await escrow.amountReceived();
    console.log("Amount Sent to contract ->", amountSent.toString());
    console.log("Amount Received In Contract ->", amountReceivedInContract.toString());
    expect(amountReceivedInContract).to.equal(ethers.parseEther(amountSent.toString()));
    // Listen for the ConfirmationAmountSent event
    escrow.on("ConfirmationAmountSent", (editor, amount, event) => {
      console.log(`Confirmation amount sent to ${editor} for ${amount} wei`);
    });

    await escrow.ProjectConfirmation();
    amountSentToEditor += (amountSent * 10) / 100;
    amountSent -= amountSentToEditor;
    const confirmationAmountInContract = await escrow.confirmationAmount();
    console.log("Amount Sent To Editor ->", amountSentToEditor.toString());
    console.log("Confirmation Amount In Contract ->", confirmationAmountInContract.toString());
    expect(confirmationAmountInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));

    const amountSentToEditorInContract = await escrow.amountSentToEditor();
    console.log("Amount Sent To Editor In Contract ->", amountSentToEditorInContract.toString());
    expect(amountSentToEditorInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));

    
    await escrow.on("ProjectTrailAmountSent", ( val,amount, event) => {
      console.log(`Project trial amount sent to ${val} for ${amount} wei`);
     });
     console.log("Event listener set up for ProjectTrailAmountSent.");
     
    console.log("Calling ProjectTrial...");
    await escrow.ProjectTrial();
    console.log("ProjectTrial called.");
    const currentState = await escrow.currState();
console.log("Current contract state:", currentState);

    
        amountSentToEditor += (amountSent * 20) / 100;
        const projectTrialInContract = await escrow.amountSentToEditor();
        console.log("Amount Sent To Editor In Contract ->", projectTrialInContract.toString());
        expect(projectTrialInContract).to.equal(ethers.parseEther(amountSentToEditor.toString()));
    
 });
});
