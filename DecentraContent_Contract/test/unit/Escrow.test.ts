import { expect } from "chai";
import {ethers} from "hardhat";  
import { Escrow } from "../../typechain";
import { Address } from "hardhat-deploy/dist/types";
describe("Escrow Contract", () => {
  let escrow:Escrow;
  let customer:Address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  let editor:Address = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2";
  beforeEach(async () => {
    
    const Escrow = await ethers.getContractFactory("Escrow");
    
    escrow = await Escrow.deploy();
    const wait = await escrow.waitForDeployment();
  });

  it("Should allow the customer to confirm the project and transfer the confirmation amount to the editor", async function () {
    // Set the contract state to AWAITING_PAYMENT

    // Customer confirms the project
    await escrow.connect(customer).ProjectConfirmation({ value: ethers.parseEther("1") });
   
    // Check the contract state
    expect(await escrow.currState()).to.equal(1); // Assuming 1 represents AWAITING_PREVIEW

    // Check the balance of the editor
    expect(await ethers.provider.getBalance(editor)).to.equal(ethers.parseEther("0.1"));
    
 });
})