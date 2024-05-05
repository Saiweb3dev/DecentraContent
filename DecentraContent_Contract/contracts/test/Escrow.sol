// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    // Define custom errors for state and transfer failures
    error TransferFailed();
    error RefundFailed();

    // Enum to represent the current state of the escrow process
    enum State {AWAITING_PAYMENT, AWAITING_PREVIEW, AWAITING_DELIVERY, COMPLETE}
    State public currState;

    // Addresses for the customer and editor
    address private customer;
    address private editor;
    uint256 public amountReceived;
    uint256 public amountSentToEditor;
    uint256 public constant DELIVERY_DEADLINE = 30 days;
    uint256 public projectStartTime;

    event EscrowEvent(string functionName,State);

    modifier onlyCustomer() {
        require(msg.sender == customer, "Only customer can call this method");
        _;
    }
 
    /**
     * @dev Initializes the escrow process by setting the customer and editor addresses and recording the amount received.
     * @param _customer The address of the customer.
     * @param _editor The address of the editor.
     */
    function InitializePayment(address _customer, address payable _editor) payable external{
        customer = _customer;
        editor = _editor;
        amountReceived = msg.value;
        projectStartTime = block.timestamp;
    }

    /**
     * @dev Transfers a confirmation amount to the editor and updates the contract state to `AWAITING_PREVIEW`.
     */
    function ProjectConfirmation() payable external {
        // Ensure the contract is in the correct state
        require(currState == State.AWAITING_PAYMENT,"Confirm the Project");
        // Update the contract state
        currState = State.AWAITING_PREVIEW;
        emit EscrowEvent("ProjectConfirmationFunction", currState);
    }

    /**
     * @dev Transfers a preview amount to the editor and updates the contract state to `AWAITING_DELIVERY`.
     */
    function ProjectPreview() payable external{
        // Ensure the contract is in the correct state
        require(currState == State.AWAITING_PREVIEW,"Preview the Project");
        // Update the contract state
        currState = State.AWAITING_DELIVERY;
        emit EscrowEvent("ProjectPreviewFunction", currState);
    }

    /**
     * @dev Transfers the remaining amount to the editor and updates the contract state to `COMPLETE`.
     * @return success A boolean indicating the success of the transfer.
     */
    function ProjectDelivery() payable external returns(bool){
        // Ensure the contract is in the correct state
        require(currState == State.AWAITING_DELIVERY,"Delivery the Project");
        // Transfer the remaining amount to the editor
        (bool success, ) = payable(editor).call{value: amountReceived}("");
        // Check for transfer success
        require(success, "Transfer failed In Project Delivery");
        // Reset the amount received
        amountSentToEditor += amountReceived;
        // Update the contract state
        currState = State.COMPLETE;
        emit EscrowEvent("ProjectDeliveryFunction", currState);
        return success;
    }

    /**
     * @dev Allows the customer to request a refund if the editor fails to deliver within the specified time limit.
     * @return success A boolean indicating the success of the refund.
     */
    function RequestRefund() external onlyCustomer returns (bool) {
        // Check if the delivery deadline has passed
        require(block.timestamp >= projectStartTime + DELIVERY_DEADLINE, "Delivery deadline not reached");

        // Check if the project is still in the AWAITING_DELIVERY state
        require(currState == State.AWAITING_DELIVERY, "Project is not in delivery state");

        // Transfer the remaining amount back to the customer
        (bool success, ) = payable(customer).call{value: amountReceived}("");
        require(success, "Refund transfer failed");

        // Reset the contract state
        currState = State.COMPLETE;
        amountReceived = 0;

        return success;
    }
}