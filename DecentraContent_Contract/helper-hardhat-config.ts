
import { BigNumberish } from "ethers";
import { ethers } from "ethers";
type NetworkConfigItem = {
  name: string
  fundAmount: BigNumberish
  fee?: string
  keyHash?: string
  interval?: string
  linkToken?: string
  vrfCoordinator?: string
  keepersUpdateInterval?: string
  oracle?: string
  jobId?: string
  ethUsdPriceFeed?: string
}
type NetworkConfigMap = {
  [chainId: string]: NetworkConfigItem
}

export const NetworkConfig: NetworkConfigMap ={
  default:{
    name:"hardhat",
    fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: ethers.toBigInt("1000000000000000000"),
        keepersUpdateInterval: "30",
  },
  31337: {
    name: "localhost",
    fee: "100000000000000000",
    keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fundAmount: ethers.toBigInt("1000000000000000000"),
    keepersUpdateInterval: "30",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
},   11155111: {
  name: "sepolia",
  linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
  vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
  oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
  jobId: "ca98366cc7314957b8c012c72f05aeeb",
  fee: "100000000000000000",
  fundAmount:ethers.toBigInt("1000000000000000000"),
  keepersUpdateInterval: "30",
},
}
export const developmentChains: string[] = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6