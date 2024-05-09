import hre from "hardhat";
//npx hardhat run scripts/01_deployDCEX_test.ts
const main = async () => {
  const chainId = await hre.getChainId(); // Get the chain ID
  console.log("Chain ID:", chainId); // Log the chain ID

  const DCEX_Factory = await hre.ethers.getContractFactory("DCEX");
  const DCEX = await DCEX_Factory.deploy();
  const tx = await DCEX.deploymentTransaction()?.wait();
  console.log("Gas used:", tx?.gasUsed.toString());

  const contractAddress: string = DCEX.target.toString();
  const DCEX_interface = DCEX.interface.formatJson();
  const abi = JSON.parse(DCEX_interface);

  await hre.deployments.save("DCEX", {
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