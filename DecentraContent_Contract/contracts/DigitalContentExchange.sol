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
    mapping(uint256 => string) private s_fileLocation;
    mapping(uint256 => string) private s_editedFileLocation;
    mapping(uint256 => bool) private s_customerApproval;
    //Modifiers

    //restrict access to the ediotr of a specific token.
    modifier onlyTokenEditor(uint256 _tokenCounter) {
        require(msg.sender == s_tokenInfo[_tokenCounter].editor, "Caller is not the editor");
        _;
    }

    //restrict access to the customer of a specific token.
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

    //The intial file location of the customer is set
    function initialFileLocation(string memory _fileLocation,uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) {
        s_fileLocation[_tokenCounter] = _fileLocation;
    }

    function previewOfEditedFile(string memory _editedFileLocation,uint256 _tokenCounter) public onlyTokenEditor(_tokenCounter){
       s_editedFileLocation[_tokenCounter] = _editedFileLocation;
    }

    // Function to approve the edited file preview by the customer
    function approveEditedPreview(uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) {
        s_customerApproval[_tokenCounter] = true;
    }

   //Minting the token using Id and URI to customer address
     function mintEditedToken(uint256 _tokenCounter, string memory _editedFileURI) public onlyTokenEditor(_tokenCounter) {
        require(s_customerApproval[_tokenCounter], "Customer approval is required");
        uint256 newTokenId = _tokenCounter; // Use the existing token counter as the new token ID
        _safeMint(s_tokenInfo[newTokenId].customer, newTokenId);
        _setTokenURI(newTokenId, _editedFileURI);
    }

    function isCustomerOwner(uint256 _tokenCounter) public view returns (bool) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        address customerAddress = s_tokenInfo[_tokenCounter].customer;
        return ownerOf(_tokenCounter) == customerAddress;
    }

    // Retrieves editor and customer addresses for a given token ID.
    function getTokenInfo(uint256 _tokenCounter) public view returns(address, address) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return (info.editor, info.customer);
    }
    
    //The file location of customer is callable by the editor
    function getInitialFileLocation(uint256 _tokenCounter) public view onlyTokenEditor(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_fileLocation[_tokenCounter];
    }

    function getPreviewOfEditedFile(uint _tokenCounter) public view onlyTokenCustomer(_tokenCounter) returns(string memory){
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_editedFileLocation[_tokenCounter];
    }
}
