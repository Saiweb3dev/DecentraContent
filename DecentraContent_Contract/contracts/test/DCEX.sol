// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721URIStorage for URI storage functionality.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Escrow.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

/**
 * @title DigitalContentExchange
 * @dev Contract for managing digital content tokens with escrow functionality.
 */
 contract DCEX is ERC721URIStorage, VRFConsumerBaseV2 {

    //error
    error AccessDenied(string message);
    // Token counter for unique token identification.
    uint256 private s_tokenCounter;
    address payable immutable i_owner;

    //Chainlink VRF Variables
    VRFCoordinatorV2Interface private i_vrfCoordinator = VRFCoordinatorV2Interface(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625);
    bytes32 private i_keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint64 private i_subId = 11227;
    uint32 private i_callbackGasLimit = 100000;
    uint16 private constant REQ_CONFIRMATION = 3;
    uint32 private constant NUM_VALUE = 1;


    // Events
    event AmountReceivedInEscrow(uint256 amount);
    event ProjectTrailAmountSentInEscrow(uint256 amount);
    event ConfirmationAmountSentInEscrow(uint256 amount);
    event TransferOfToken(address from, address to, uint256 tokenId);
    event EditedFilePreview(uint256 indexed _tokenCounter, string indexed _tokenLocation);
    event TokenMinted(uint256 tokenId,address owner, string tokenURI);
    event TokenBurned(uint256 tokenId);
     event TokenAssigned(uint256 tokenId, address editor, address customer);
     event RefundStatus(uint256 tokenCounter,bool status);

     //Chainlink Events
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256 randomWord);


    // Struct to hold editor and customer addresses for each token.
    struct TokenInfo {
        address editor;    // Editor's address.
        address customer; // Customer's address.
        Escrow escrow; // Store the escrow contract instance for each token
    }

    // Mapping from token ID to TokenInfo.
    mapping(uint256 => TokenInfo) private s_tokenInfo;
    mapping(uint256 => string) private s_fileLocation;
    mapping(uint256 => string) private s_editedFileLocation;
    mapping(uint256 => bool) private s_customerApproval;

    //Chainlink VRF Mapping
    mapping(uint256 => uint256) public s_tokenCounterToRandomNumber;
    mapping(uint256 => uint256) public s_requestIdToTokenCounter;

    // Constructor initializes the token counter.
    constructor() ERC721("DigitalContentExchange", "DCEX")
     VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625) {
        s_tokenCounter = 0;
        i_owner = payable(msg.sender);
    }

    // Modifiers

    // Restrict access to the editor of a specific token.
    modifier onlyTokenEditor(uint256 _tokenCounter) {
        if(msg.sender != s_tokenInfo[_tokenCounter].editor){
            revert AccessDenied("Caller is not the editor");
        }
        _;
    }

    // Restrict access to the customer of a specific token.
    modifier onlyTokenCustomer(uint256 _tokenCounter) {
        if(msg.sender != s_tokenInfo[_tokenCounter].customer){
            revert AccessDenied("Caller is not the customer");
        }
        _;
    }

    /**
     * @dev Initializes a new token with editor and customer addresses, returns token ID.
     * @param _customer The address of the customer.
     * @param _editor The address of the editor.
     * @return The token ID and the amount received in escrow.
     */
    function initializeToken(address _customer, address _editor) public payable returns(uint256,uint256) {
        // require(msg.value > 1 ether, "Value must be greater than 1 ether");
        s_tokenCounter++;
        Escrow newEscrow = new Escrow();
        newEscrow.InitializePayment{value:msg.value}(_customer, payable(_editor));
        s_tokenInfo[s_tokenCounter] = TokenInfo({editor: _editor, customer: _customer, escrow: newEscrow});
        uint256 amountReceived = newEscrow.amountReceived();
        emit AmountReceivedInEscrow(amountReceived);
        emit TokenAssigned(s_tokenCounter, _editor, _customer);
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
        info.escrow.ProjectConfirmation();
        return true;
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
         info.escrow.ProjectPreview();
        requestRandomWords(_tokenCounter);
        return true;
    }

    /**
     * @dev Minting the token using ID and URI to customer address.
     * @param _tokenCounter The token ID.
     * @param _editedFileURI The URI of the edited file.
     * @return Returns true if the operation was successful.
     */
    function mintEditedToken(uint256 _tokenCounter, string memory _editedFileURI) public onlyTokenEditor(_tokenCounter) returns(bool){
        require(s_customerApproval[_tokenCounter], "Customer approval is required");
        uint256 randomWord = s_tokenCounterToRandomNumber[_tokenCounter];
        uint256 newTokenId = uint256(keccak256(abi.encodePacked(_tokenCounter, randomWord))); // Use the existing token counter as the new token ID
        _safeMint(s_tokenInfo[newTokenId].customer, newTokenId);
        _setTokenURI(newTokenId, _editedFileURI);
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool payment = info.escrow.ProjectDelivery();
        emit TokenMinted(newTokenId,s_tokenInfo[newTokenId].customer, _editedFileURI);
        return payment;
    }

    //Chainlink VRF Specific functions
    function requestRandomWords(uint256 _tokenCounter) internal returns(uint256 requestId){
        requestId = i_vrfCoordinator.requestRandomWords(i_keyHash,i_subId,REQ_CONFIRMATION,i_callbackGasLimit,NUM_VALUE);
        s_requestIdToTokenCounter[requestId] = _tokenCounter;
        emit RequestSent(requestId,NUM_VALUE);
        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        uint256 tokenCounter = s_requestIdToTokenCounter[_requestId];
        uint256 randomWord = _randomWords[0];
        s_tokenCounterToRandomNumber[tokenCounter] = randomWord;
        emit RequestFulfilled(_requestId, randomWord);
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

    function callForRefund(uint256 _tokenCounter) public onlyTokenCustomer(_tokenCounter) {
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        bool refund = info.escrow.RequestRefund();
        if(refund == true){
            emit RefundStatus(_tokenCounter,refund);
        }else{
             emit RefundStatus(_tokenCounter,refund);
        }
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
        emit EditedFilePreview(_tokenCounter, s_editedFileLocation[_tokenCounter]);
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
        emit TokenBurned(tokenId);
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
    function getAmountReceivedInEscrow(uint256 _tokenCounter) public view returns(uint256){
        TokenInfo memory info = s_tokenInfo[_tokenCounter];
        return info.escrow.amountReceived();
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
