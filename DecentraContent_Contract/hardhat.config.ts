import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import * as dotenv from "dotenv"
dotenv.config()

//Temporary URL and KEy
const SEPOLIA_RPC_URL ="https://eth-sepolia.g.alchemy.com/v2/8cAuHYtk5pZaV5S4z9QKIKLbAj3JEc3i"
const PRIVATE_KEY ='976ec26d8620bbdeff41ac071ad26407ee1bd7e03cf7b10d27067e91ccfc2ff9'
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"

const config: HardhatUserConfig = {
  defaultNetwork:"hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY!],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY
  // },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
 },
  solidity: "0.8.24",
};

export default config;
