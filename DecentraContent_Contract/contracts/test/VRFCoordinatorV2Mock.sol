// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";
/*
Steps to Use this Mock

step 1 :
Deployment Constructor
_BASEFEE=100000000000000000 and _GASPRICELINK=1000000000

step 2 :
call createSubscription() it gives a subId of 1 (initiallly)
call fundSubscription() and set _subidto 1 and _amount 1000000000000000000
also store the contract Address

step 3 :
deploy the main contract aka VRF Consumer Contract
the constructor require few value they are
1)subId -> 1
2)vrfCoordinator -> pass the mock contract address
3)Keyhash -> 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc
then deploy and call requestRandomeNumber()
also store the contract Address

step 4 :
In the Mock call addConsumer() pass parameter of (subId,consumerAddress)
Call requestRandomWords() it will send a request to the Mock with reqId
In Mock call fulfillRandomWords() with (reqId,consumerAddress) it will send the callback to the main
Now We will get the random number!!!!

*/