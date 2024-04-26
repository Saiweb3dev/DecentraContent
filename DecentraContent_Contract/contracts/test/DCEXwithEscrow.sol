// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721URIStorage for URI storage functionality.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./EscrowTest.sol";
// DigitalContentExchange contract for managing digital content tokens.
contract DCEXwithEscrowTest is ERC721URIStorage {
    // Token counter for unique token identification.
    uint256 private s_tokenCounter;

    // Struct to hold editor and customer addresses for each token.
    struct TokenInfo {
        address editor;    // Editor's address.
        address customer; // Customer's address.
        EscrowTest escrow;  // Store the escrow contract instance for each token
    }

    // Mapping from token ID to TokenInfo.
    mapping(uint256 => TokenInfo) private s_tokenInfo;
    mapping(uint256 => string) private s_fileLocation;
    mapping(uint256 => string) private s_editedFileLocation;
    mapping(uint256 => bool) private s_customerApproval;

    // Constructor initializes the token counter.
    constructor() ERC721("DigitalContentExchange", "DCEX") {
        s_tokenCounter = 0;
    }

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

    // Initializes a new token with editor and customer addresses, returns token ID.
    function initializeToken(address _customer, address _editor) public payable returns(uint256,uint256) {
      require(msg.value > 1 ether, "Value must be greater than 1 ether");
        s_tokenCounter++;
        EscrowTest newEscrow = new EscrowTest();
        newEscrow.InitializePayment{value:msg.value}(_customer, payable(_editor));
        s_tokenInfo[s_tokenCounter] = TokenInfo({editor: _editor, customer: _customer, escrow: newEscrow});
        return (s_tokenCounter,newEscrow.amountReceived());
    }

    // Sets the initial file location of the customer.
    function initialFileLocation(string memory _fileLocation, uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) returns(uint256) {
        s_fileLocation[_tokenCounter] = _fileLocation;
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectConfirmation();
        if(payment){
 return info.escrow.confirmationAmount();
        }
       return 0;
    }

    // Sets the preview of the edited file by the editor.
    function previewOfEditedFile(string memory _editedFileLocation, uint256 _tokenCounter) public onlyTokenEditor(_tokenCounter) returns(uint256){
        s_editedFileLocation[_tokenCounter] = _editedFileLocation;
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        uint256 payment = info.escrow.ProjectTrial();
        return payment;
    }

    // Function to approve the edited file preview by the customer.
    function approveEditedPreview(uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) {
        s_customerApproval[_tokenCounter] = true;
    }

    // Minting the token using ID and URI to customer address.
    function mintEditedToken(uint256 _tokenCounter, string memory _editedFileURI) public onlyTokenEditor(_tokenCounter) returns(bool){
        require(s_customerApproval[_tokenCounter], "Customer approval is required");
        uint256 newTokenId = _tokenCounter; // Use the existing token counter as the new token ID
        _safeMint(s_tokenInfo[newTokenId].customer, newTokenId);
        _setTokenURI(newTokenId, _editedFileURI);
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectDelivery();
        return payment;
    }

    // Checks if the caller is the owner of the token.
    function isCustomerOwner(uint256 _tokenCounter) public view returns (bool) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        address customerAddress = s_tokenInfo[_tokenCounter].customer;
        return ownerOf(_tokenCounter) == customerAddress;
    }

    // Retrieves editor and customer addresses for a given token ID.
    function getTokenInfo(uint256 _tokenCounter) public view returns(address, address,address) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return (info.editor, info.customer, address(info.escrow));
    }
    
    // Retrieves the initial file location of the customer, callable by the editor.
    function getInitialFileLocation(uint256 _tokenCounter) public view onlyTokenEditor(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_fileLocation[_tokenCounter];
    }

    // Retrieves the preview of the edited file, callable by the customer.
    function getPreviewOfEditedFile(uint256 _tokenCounter) public view onlyTokenCustomer(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_editedFileLocation[_tokenCounter];
    }

    // Transfer token ownership.
    function transferToken(uint256 _tokenCounter, address _to) public onlyTokenCustomer(_tokenCounter) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        require(ownerOf(_tokenCounter) == msg.sender, "You are not the owner of this token");
        _transfer(msg.sender, _to, _tokenCounter);
    }

    // Returns the total number of tokens.
    function totalSupply() public view returns (uint256) {
        return s_tokenCounter;
    }

    // Checks if a token exists.
    function tokenExists(uint256 _tokenCounter) public view returns (bool) {
        return _tokenCounter <= s_tokenCounter && _tokenCounter > 0 && ownerOf(_tokenCounter) != address(0);
    }
}
