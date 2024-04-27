import hre from "hardhat";
import fs from "fs";

// Move the function declarations above their usage
const updateAddress = async (contractAddress: string) => {
 console.log("Updating the contract Address...");
 try {
    const chainId = hre.network.config.chainId;
    if (chainId == undefined) {
      console.log("Chain ID is undefined. Cannot update contract addresses.");
      return;
    }
    const addressJson = JSON.stringify({ [chainId]: contractAddress }, null, 2);
    fs.writeFileSync(FTE_FILE_ADDRESS, addressJson);
 } catch (err) {
    console.log("Error while updating contract address. ", err);
 }
};

const updateAbi = async (contractAbi: any) => {
 console.log("Updating the contract Abi...");
 try {
    const chainId = hre.network.config.chainId;
    if (chainId == undefined) {
      console.log("Chain ID is undefined. Cannot update contract addresses.");
      return;
    }
    const addressJson = JSON.stringify({ [chainId]: contractAbi }, null, 2);
    fs.writeFileSync(FTE_FILE_ABI, addressJson);
 } catch (err) {
    console.log("Error while updating contract address. ", err);
 }
};

const main = async () => {
 if (process.env.UPDATE_FTE == "true") {
    console.log("Process Started.......");
    const contract = await hre.deployments.get("DCEXwithEscrowTest");
    const contractAddress = contract.address;
    await updateAddress(contractAddress);
    console.log("Contract Address Updated -> ", contractAddress);
    const contractAbi = contract.abi;
    console.log("Contract Abi Updated ");
    await updateAbi(contractAbi);
 }
};

main().then(() => process.exit(0)).catch((err) => {
 console.error(err);
 process.exit(1);
});