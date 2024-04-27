// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721URIStorage for URI storage functionality.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./EscrowTest.sol";

/**
 * @title DigitalContentExchange
 * @dev Contract for managing digital content tokens with escrow functionality.
 */
contract DCEXwithEscrowTest is ERC721URIStorage {
    // Token counter for unique token identification.
    uint256 private s_tokenCounter;

    // Events
    event AmountReceivedInEscrow(uint256 amount);
    event ProjectTrailAmountSentInEscrow(uint256 amount);
    event ConfirmationAmountSentInEscrow(uint256 amount);
    event TransferOfToken(address from, address to, uint256 tokenId);

    // Struct to hold editor and customer addresses for each token.
    struct TokenInfo {
        address editor;    // Editor's address.
        address customer; // Customer's address.
        EscrowTest escrow; // Store the escrow contract instance for each token
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

    /**
     * @dev Initializes a new token with editor and customer addresses, returns token ID.
     * @param _customer The address of the customer.
     * @param _editor The address of the editor.
     * @return The token ID and the amount received in escrow.
     */
    function initializeToken(address _customer, address _editor) public payable returns(uint256,uint256) {
        require(msg.value > 1 ether, "Value must be greater than 1 ether");
        s_tokenCounter++;
        EscrowTest newEscrow = new EscrowTest();
        newEscrow.InitializePayment{value:msg.value}(_customer, payable(_editor));
        s_tokenInfo[s_tokenCounter] = TokenInfo({editor: _editor, customer: _customer, escrow: newEscrow});
        uint256 amountReceived = newEscrow.amountReceived();
        emit AmountReceivedInEscrow(amountReceived);
        return (s_tokenCounter,newEscrow.amountReceived());
    }

    /**
     * @dev Sets the initial file location of the customer.
     * @param _fileLocation The location of the initial file.
     * @param _tokenCounter The token ID.
     * @return Returns true if the operation was successful.
     */
    function initialFileLocation(string memory _fileLocation, uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) returns(bool) {
        s_fileLocation[_tokenCounter] = _fileLocation;
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectConfirmation();
        return payment;
    }

    /**
     * @dev Sets the preview of the edited file by the editor.
     * @param _editedFileLocation The location of the edited file preview.
     * @param _tokenCounter The token ID.
     */
    function previewOfEditedFile(string memory _editedFileLocation, uint256 _tokenCounter) public onlyTokenEditor(_tokenCounter){
        s_editedFileLocation[_tokenCounter] = _editedFileLocation;
    }

    /**
     * @dev Function to approve the edited file preview by the customer.
     * @param _tokenCounter The token ID.
     * @return Returns true if the operation was successful.
     */
    function approveEditedPreview(uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) returns(bool){
        require(!s_customerApproval[_tokenCounter], "Customer has already approved");
        s_customerApproval[_tokenCounter] = true;
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectPreview();
        return payment;
    }

    /**
     * @dev Minting the token using ID and URI to customer address.
     * @param _tokenCounter The token ID.
     * @param _editedFileURI The URI of the edited file.
     * @return Returns true if the operation was successful.
     */
    function mintEditedToken(uint256 _tokenCounter, string memory _editedFileURI) public onlyTokenEditor(_tokenCounter) returns(bool){
        require(s_customerApproval[_tokenCounter], "Customer approval is required");
        uint256 newTokenId = _tokenCounter; // Use the existing token counter as the new token ID
        _safeMint(s_tokenInfo[newTokenId].customer, newTokenId);
        _setTokenURI(newTokenId, _editedFileURI);
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectDelivery();
        return payment;
    }

    /**
     * @dev Checks if the caller is the owner of the token.
     * @param _tokenCounter The token ID.
     * @return Returns true if the caller is the owner of the token.
     */
    function isCustomerOwner(uint256 _tokenCounter) public view returns (bool) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        address customerAddress = s_tokenInfo[_tokenCounter].customer;
        return ownerOf(_tokenCounter) == customerAddress;
    }

    /**
     * @dev Retrieves editor and customer addresses for a given token ID.
     * @param _tokenCounter The token ID.
     * @return The editor's address, the customer's address, and the escrow contract address.
     */
    function getTokenInfo(uint256 _tokenCounter) public view returns(address, address,address) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return (info.editor, info.customer, address(info.escrow));
    }
    
    /**
     * @dev Retrieves the initial file location of the customer, callable by the editor.
     * @param _tokenCounter The token ID.
     * @return The location of the initial file.
     */
    function getInitialFileLocation(uint256 _tokenCounter) public view onlyTokenEditor(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_fileLocation[_tokenCounter];
    }

    /**
     * @dev Retrieves the preview of the edited file, callable by the customer.
     * @param _tokenCounter The token ID.
     * @return The location of the edited file preview.
     */
    function getPreviewOfEditedFile(uint256 _tokenCounter) public view onlyTokenCustomer(_tokenCounter) returns(string memory) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        return s_editedFileLocation[_tokenCounter];
    }

    /**
     * @dev Transfer token ownership.
     * @param _tokenCounter The token ID.
     * @param _to The address to transfer the token to.
     */
    function transferToken(uint256 _tokenCounter, address _to) public onlyTokenCustomer(_tokenCounter) {
        require(_tokenCounter <= s_tokenCounter, "Invalid token ID");
        require(ownerOf(_tokenCounter) == msg.sender, "You are not the owner of this token");
        emit TransferOfToken(msg.sender, _to, _tokenCounter);
        _transfer(msg.sender, _to, _tokenCounter);
    }

    /**
     * @dev Returns the total number of tokens.
     * @return The total number of tokens.
     */
    function totalSupply() public view returns (uint256) {
        return s_tokenCounter;
    }

    /**
     * @dev Checks if a token exists.
     * @param _tokenCounter The token ID.
     * @return Returns true if the token exists.
     */
    function tokenExists(uint256 _tokenCounter) public view returns (bool) {
        return _tokenCounter <= s_tokenCounter && _tokenCounter > 0 && ownerOf(_tokenCounter) != address(0);
    }

    /**
     * @dev Burns a token.
     * @param tokenId The ID of the token to burn.
     */
    function burnToken(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Caller is not owner nor approved");
        _burn(tokenId);
    }

    /**
     * @dev Retrieves the owner of a token.
     * @param _tokenCounter The token ID.
     * @return The owner's address.
     */
    function getOwnerOf(uint256 _tokenCounter) public view returns(address){
        return ownerOf(_tokenCounter);
    }

    // For test purposes
    function getAmountReceivedInEscrow(uint256 _tokenCounter) public view returns    (uint256){
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return info.escrow.amountReceived();
    }

    /**
     * @dev Retrieves the confirmation amount received in escrow for a token.
     * @param _tokenCounter The token ID.
     * @return The confirmation amount received in escrow.
     */
    function getConfirmationAmountReceivedInEscrow(uint256 _tokenCounter) public view returns(uint256){
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return info.escrow.confirmationAmount();
    }

    /**
     * @dev Retrieves the preview amount received in escrow for a token.
     * @param _tokenCounter The token ID.
     * @return The preview amount received in escrow.
     */
    function getPreviewAmountReceivedInEscrow(uint256 _tokenCounter) public view returns(uint256){
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return info.escrow.previewAmount();
    }

    /**
     * @dev Retrieves the total amount sent to the editor in escrow for a token.
     * @param _tokenCounter The token ID.
     * @return The total amount sent to the editor in escrow.
     */
    function getTotalAmountSentToEditorInEscrow(uint256 _tokenCounter) public view returns(uint256){
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return info.escrow.amountSentToEditor();
    }
}

