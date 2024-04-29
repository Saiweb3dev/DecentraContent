import hre from "hardhat";
//npx hardhat run scripts/01_deployDCEX_test.ts
const main = async () => {
  const DCEX_Factory =
    await hre.ethers.getContractFactory("DCEXwithEscrowTest");
  const DCEX = await DCEX_Factory.deploy();

  const tx = await DCEX.deploymentTransaction()?.wait()
  // console.log("Transaction -> ",tx)
  console.log("Gas used:", tx?.gasUsed.toString());
  const contractAddress: string = DCEX.target.toString();

  const DCEX_interface = DCEX.interface.formatJson();
  const abi = JSON.parse(DCEX_interface);
  // console.log("Contract Address -> ", contractAddress);
  // console.log("Contract Abi -> ", abi);
  await hre.deployments.save("DCEXwithEscrowTest", {
    abi: abi,
    address: contractAddress,
  });
};
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
