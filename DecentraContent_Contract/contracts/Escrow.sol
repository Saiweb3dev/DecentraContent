// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    // Define custom errors for state and transfer failures
    error WrongState(State);
    error TransferFailed();

    // Enum to represent the current state of the escrow process
    enum State {AWAITING_PAYMENT, AWAITING_PREVIEW, AWAITING_DELIVERY, COMPLETE}
    State public currState;

    // Addresses for the customer and editor
    address private customer = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address private editor = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    // Amount received by the contract, made public for external access
    uint256 public AmountReceived;

    // constructor(address _customer, address payable _editor) payable {
    //     customer = _customer;
    //     editor = _editor;
    // }

    // Modifier to restrict access to the customer
    modifier onlycustomer() {
        require(msg.sender == customer, "Only customer can call this method");
        _;
    }

    // Function to confirm the project and transfer a confirmation amount to the editor
    function ProjectConfirmation() onlycustomer external payable returns(bool) {
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PAYMENT){
            revert WrongState(currState);
        }
        // Update the amount received
        AmountReceived = msg.value;
        // Calculate the confirmation amount
        uint confirmationAmount = (AmountReceived*10)/100;
        // Transfer the confirmation amount to the editor
        bool success = payable(editor).send(confirmationAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        AmountReceived -= confirmationAmount;
        // Update the contract state
        currState = State.AWAITING_PREVIEW;
        return success;
    }

    // Function to request a trial and transfer a trial amount to the editor
    function ProjectTrial() onlycustomer external payable returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PREVIEW){
            revert WrongState(currState);
        }
        // Calculate the trial amount
        uint TrialAmount = (AmountReceived*20)/100;
        // Transfer the trial amount to the editor
        bool success = payable(editor).send(TrialAmount);
        // Check for transfer success
        require(success, "Transfer failed");
        // Update the remaining amount
        AmountReceived -= TrialAmount;
        // Update the contract state
        currState = State.AWAITING_DELIVERY;
        return success;
    }

    // Function to finalize the project and transfer the remaining amount to the editor
    function ProjectDelivery() onlycustomer external payable returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_DELIVERY){
            revert WrongState(currState);
        }
        // Transfer the remaining amount to the editor
        bool success = payable(editor).send(AmountReceived);
        // Check for transfer success
        require(success, "Transfer failed");
        // Reset the amount received
        AmountReceived = 0;
        // Update the contract state
        currState = State.COMPLETE;
        return success;
    }
}
