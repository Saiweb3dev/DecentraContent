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
    address private customer;
    address private editor;
    uint256 public amountReceived;
    uint256 public confirmationAmount;
    uint256 public previewAmount;
    uint256 public amountSentToEditor;

    event ConfirmationAmountSent(address indexed editor, uint256 amount);
    event ProjectTrailAmountSent(uint256 amount);


    // Modifier to restrict access to the customer
    modifier onlycustomer() {
        require(msg.sender == customer, "Only i_customer can call this method");
        _;
    }
    
    /*
     * @dev Initializes the escrow process by setting the customer and editor addresses and recording the amount received.
     * @params _customer The address of the customer.
     * @params _editor The address of the editor.
     */
    function InitializePayment(address _customer, address payable _editor) payable external{
        customer = _customer;
        editor = _editor;
        amountReceived = msg.value;
    }

    /**
     * @dev Transfers a confirmation amount to the editor and updates the contract state to `AWAITING_PREVIEW`.
     * @return success A boolean indicating the success of the transfer.
     */
    function ProjectConfirmation() payable external returns(bool) {
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PAYMENT){
            revert WrongState(currState);
        }
       
        // Calculate the confirmation amount
        confirmationAmount = (amountReceived*10)/100;
        
        // Transfer the confirmation amount to the editor
       (bool success, ) = payable(editor).call{value: confirmationAmount}("");
        // Check for transfer success
        require(success, "Transfer failed In Project Confirmation");
        // Update the remaining amount
        amountReceived -= confirmationAmount;
        amountSentToEditor += confirmationAmount;
        // Update the contract state
        currState = State.AWAITING_PREVIEW;
        emit ConfirmationAmountSent(editor, confirmationAmount);
        return success;
    }

    /**
     * @dev Transfers a preview amount to the editor and updates the contract state to `AWAITING_DELIVERY`.
     * @return success A boolean indicating the success of the transfer.
     */
    function ProjectPreview() payable external returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_PREVIEW){
            revert WrongState(currState);
        }
        // Calculate the trial amount
         previewAmount = (amountReceived*20)/100;
        // Transfer the trial amount to the editor
        (bool success, ) = payable(editor).call{value: previewAmount}("");
        // Check for transfer success
        require(success, "Transfer failed In Project Preview");
        // Update the remaining amount
        amountReceived -= previewAmount;
         amountSentToEditor += previewAmount;
        // Update the contract state
        currState = State.AWAITING_DELIVERY;
        emit ProjectTrailAmountSent( previewAmount);
        return success;
    }

    /**
     * @dev Transfers the remaining amount to the editor and updates the contract state to `COMPLETE`.
     * @return success A boolean indicating the success of the transfer.
     */
    function ProjectDelivery() payable external returns(bool){
        // Ensure the contract is in the correct state
        if(currState != State.AWAITING_DELIVERY){
            revert WrongState(currState);
        }
        // Transfer the remaining amount to the editor
         (bool success, ) = payable(editor).call{value: amountReceived}("");
        // Check for transfer success
        require(success, "Transfer failed In Project Delivery");
        // Reset the amount received
        amountSentToEditor += amountReceived;
        amountReceived = 0;
        // Update the contract state
        currState = State.COMPLETE;
        return success;
    }
}
