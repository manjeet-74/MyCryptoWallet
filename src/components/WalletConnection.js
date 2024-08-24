import { Web3Provider } from "@ethersproject/providers"; // Correct import for Web3Provider
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { formatEther } from "ethers/lib/utils";
import React, { useState } from "react";

const WalletConnection = () => {
  const [balance, setBalance] = useState(null);
  const [chain, setChain] = useState("ethereum"); // Default chain
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (chain === "ethereum") {
        if (!window.ethereum) {
          setError(
            "MetaMask is not installed. Please install it to use this feature."
          );
          return;
        }

        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setBalance(formatEther(balance) + " ETH");
        setError(null);
      } else if (chain === "solana") {
        if (!window.solana) {
          setError(
            "Solana wallet is not installed. Please install it to use this feature."
          );
          return;
        }

        const connection = new Connection(clusterApiUrl("devnet"));
        const wallet = window.solana;
        await wallet.connect();
        const publicKey = new PublicKey(wallet.publicKey.toString());
        const balance = await connection.getBalance(publicKey);
        setBalance((balance / 1e9).toFixed(2) + " SOL");
        setError(null);
      }
    } catch (err) {
      setError(`Error connecting wallet: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-12">
      <h1 className="text-6xl font-bold mb-8">Connect Your Crypto Wallet</h1>
      <div
        className="card h-[60%] w-[80%] flex flex-col items-center justify-center p-12
       bg-slate-800 border border-white rounded-lg shadow-md"
      >
        <select
          className="mb-4 p-2 border border-gray-300 rounded-md text-black"
          onChange={(e) => setChain(e.target.value)}
          value={chain}
        >
          <option value="ethereum" className="m-5">
            Ethereum
          </option>
          <option value="solana" className="m-5">
            Solana
          </option>
        </select>
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Connect Wallet
        </button>
        {balance && (
          <div className="mt-6 text-xl font-medium">
            <p>Balance: {balance}</p>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-6 text-red-500 text-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
