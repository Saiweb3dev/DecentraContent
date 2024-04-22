// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract DigitalContentExchange is ERC721URIStorage {
    constructor() ERC721("DigitalContentExchange", "DCEX") {}

    // Your contract code here
}
