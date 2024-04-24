// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721URIStorage for URI storage functionality.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// DigitalContentExchange contract for managing digital content tokens.
contract DigitalContentExchange is ERC721URIStorage {

    // Token counter for unique token identification.
    uint256 private s_tokenCounter;

    // Struct to hold editor and customer addresses for each token.
    struct TokenInfo {
        address editor; // Editor's address.
        address customer; // Customer's address.
    }

    // Mapping from token ID to TokenInfo.
    mapping(uint256 => TokenInfo) private s_tokenInfo;

    // Constructor initializes the token counter.
    constructor() ERC721("DigitalContentExchange", "DCEX") {
        s_tokenCounter = 0;
    }

    // Initializes a new token with editor and customer addresses, returns token ID.
    function initializeToken(address _customer, address _editor) public returns(uint256) {
        s_tokenCounter++;
        s_tokenInfo[s_tokenCounter] = TokenInfo({editor: _editor, customer: _customer});
        return s_tokenCounter;
    }

    // Retrieves editor and customer addresses for a given token ID.
    function getTokenInfo(uint256 _tokenCounter) public view returns(address, address) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return (info.editor, info.customer);
    }
}
