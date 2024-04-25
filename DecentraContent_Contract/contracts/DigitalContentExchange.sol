// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721URIStorage for URI storage functionality.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// DigitalContentExchange contract for managing digital content tokens.
contract DigitalContentExchange is ERC721URIStorage {

    /*Input Samples for testing
     customer Address = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
     editor Address   = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
     tokenCounter = 1
     fileLocation = ipfs://QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDzJrqDR23Y8YSkebLU
    */

    // Token counter for unique token identification.
    uint256 private s_tokenCounter;

    // Struct to hold editor and customer addresses for each token.
    struct TokenInfo {
        address editor; // Editor's address.
        address customer; // Customer's address.
    }

    // Mapping from token ID to TokenInfo.
    mapping(uint256 => TokenInfo) private s_tokenInfo;
    // Mapping from token ID to file location.
    mapping(uint256 => string) private s_fileLocation;

    // Modifiers
    // Restrict access to the editor of a specific token.
    modifier onlyTokenEditor(uint256 _tokenCounter) {
        require(msg.sender == s_tokenInfo[_tokenCounter].editor, "Caller is not the editor");
        _;
    }

    // Restrict access to the customer of a specific token.
    modifier onlyTokenCustomer(uint256 _tokenCounter) {
        require(msg.sender == s_tokenInfo[_tokenCounter].customer, "Caller is not the customer");
        _;
    }

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

    // The initial file location of the customer is set.
    function initialFileLocation(string memory _fileLocation, uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) {
        s_fileLocation[_tokenCounter] = _fileLocation;
    }

    // Retrieves editor and customer addresses for a given token ID.
    function getTokenInfo(uint256 _tokenCounter) public view returns(address, address) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return (info.editor, info.customer);
    }

    // The file location of the customer is callable by the editor.
    function getInitialFileLocation(uint256 _tokenCounter) public view onlyTokenEditor(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_fileLocation[_tokenCounter];
    }

function getTokenCounter() public view returns(uint256) {
    return s_tokenCounter;
}

}
