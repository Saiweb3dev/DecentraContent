"use client";
import { WalletContext } from "@/contexts/WalletContext";
import Link from "next/link";
import React, { useContext, useState } from "react";

const Navbar: React.FC = () => {
  const { accountDetails, connectWallet, disconnectWallet } =
    useContext(WalletContext);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <nav className="bg-pink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-black font-bold text-4xl">DCEX</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/IpfsConvertor"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  IpfsConvertor
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div>
            {accountDetails.account ? (
              <button
                onClick={handleShowModal}
                className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Show Wallet Details
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black ">
          <div className="bg-pink-600 text-black rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Wallet Details</h2>
            <p>Connected: {accountDetails.account}</p>
            <p>Network: {accountDetails.network}</p>
            <p>Balance: {accountDetails.balance} ETH</p>
            <div className="mt-4">
              <button
                onClick={disconnectWallet}
                className="bg-red-700 text-white px-4 py-2 rounded-md mr-2"
              >
                Disconnect Wallet
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
