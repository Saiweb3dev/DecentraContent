// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowTest {
    // Define custom errors for state and transfer failures
    error WrongState(State);
    error TransferFailed();

    // Enum to represent the current state of the escrow process
    enum State {AWAITING_PAYMENT, AWAITING_PREVIEW, AWAITING_DELIVERY, COMPLETE}
    State public currState;

    // Addresses for the i_customer and editor
    // address private i_customer = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // address private editor = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    // Amount received by the contract, made public for external access
    address private customer;
    address private editor;
    uint256 public amountReceived;
    uint256 public amountSentToEditor;
    uint256 public confirmationAmount;

    event ConfirmationAmountSent(address indexed editor, uint256 amount);
    event ProjectTrailAmountSent(uint256 amount);

    constructor() {
        
    }

    // Modifier to restrict access to the i_customer
    modifier onlycustomer() {
        require(msg.sender == customer, "Only i_customer can call this method");
        _;
    }
    
    function InitializePayment(address _customer, address payable _editor) payable external{
        customer = _customer;
        editor = _editor;
      amountReceived = msg.value;
    }
    // Function to confirm the project and transfer a confirmation amount to the editor
    function ProjectConfirmation() payable external returns(bool) {
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PAYMENT){
            revert WrongState(currState);
        }
       
        // Calculate the confirmation amount
        confirmationAmount = (amountReceived*10)/100;
        
        // Transfer the confirmation amount to the editor
        bool success = payable(editor).send(confirmationAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        amountReceived -= confirmationAmount;
        amountSentToEditor += confirmationAmount;
        // Update the contract state
        currState = State.AWAITING_PREVIEW;
        emit ConfirmationAmountSent(editor, confirmationAmount);
        return success;
    }

    // Function to request a trial and transfer a trial amount to the editor
    function ProjectTrial() payable external returns(uint256){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PREVIEW){
            revert WrongState(currState);
        }
        // Calculate the trial amount
        uint trialAmount = (amountReceived*20)/100;
        // Transfer the trial amount to the editor
        bool success = payable(editor).send(trialAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        amountReceived -= trialAmount;
         amountSentToEditor += trialAmount;
        // Update the contract state
        currState = State.AWAITING_DELIVERY;
        emit ProjectTrailAmountSent( trialAmount);
        return trialAmount;
    }

    // Function to finalize the project and transfer the remaining amount to the editor
    function ProjectDelivery() payable external returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_DELIVERY){
            revert WrongState(currState);
        }
        // Transfer the remaining amount to the editor
        bool success = payable(editor).send(amountReceived);
        // Check for transfer success
        require(success, "Transfer failed");
        // Reset the amount received
        amountSentToEditor += amountReceived;
        amountReceived = 0;
        // Update the contract state
        currState = State.COMPLETE;
        return success;
    }
}

