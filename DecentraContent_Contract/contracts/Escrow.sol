// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    // Define custom errors for state and transfer failures
    error WrongState(State);
    error TransferFailed();

    // Enum to represent the current state of the escrow process
    enum State {AWAITING_PAYMENT, AWAITING_PREVIEW, AWAITING_DELIVERY, COMPLETE}
    State public currState;

    // Addresses for the i_customer and i_editor
    // address private i_customer = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // address private i_editor = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    // Amount received by the contract, made public for external access
    address immutable i_customer;
    address immutable i_editor;
    uint256 public amountReceived;
    uint256 public amountSentToEditor;
    uint256 public confirmationAmount;

    event ConfirmationAmountSent(address indexed editor, uint256 amount);
    event ProjectTrailAmountSent(uint256 amount);

    constructor(address _customer, address payable _editor) payable {
        i_customer = _customer;
        i_editor = _editor;
    }

    // Modifier to restrict access to the i_customer
    modifier onlycustomer() {
        require(msg.sender == i_customer, "Only i_customer can call this method");
        _;
    }
    
    function InitializePayment() payable external{
      amountReceived = msg.value;
    }
    // Function to confirm the project and transfer a confirmation amount to the i_editor
    function ProjectConfirmation() payable external returns(bool) {
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PAYMENT){
            revert WrongState(currState);
        }
       
        // Calculate the confirmation amount
        confirmationAmount = (amountReceived*10)/100;
        
        // Transfer the confirmation amount to the i_editor
        bool success = payable(i_editor).send(confirmationAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        amountReceived -= confirmationAmount;
        amountSentToEditor += confirmationAmount;
        // Update the contract state
        currState = State.AWAITING_PREVIEW;
        emit ConfirmationAmountSent(i_editor, confirmationAmount);
        return success;
    }

    // Function to request a trial and transfer a trial amount to the i_editor
    function ProjectTrial() payable external returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PREVIEW){
            revert WrongState(currState);
        }
        // Calculate the trial amount
        uint trialAmount = (amountReceived*20)/100;
        // Transfer the trial amount to the i_editor
        bool success = payable(i_editor).send(trialAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        amountReceived -= trialAmount;
         amountSentToEditor += trialAmount;
        // Update the contract state
        currState = State.AWAITING_DELIVERY;
        emit ProjectTrailAmountSent( trialAmount);
        return success;
    }

    // Function to finalize the project and transfer the remaining amount to the i_editor
    function ProjectDelivery() payable onlycustomer external returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_DELIVERY){
            revert WrongState(currState);
        }
        // Transfer the remaining amount to the i_editor
        bool success = payable(i_editor).send(amountReceived);
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

