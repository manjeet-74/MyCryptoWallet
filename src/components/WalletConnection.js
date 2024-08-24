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
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Connect Your Crypto Wallet</h1>
      <select onChange={(e) => setChain(e.target.value)} value={chain}>
        <option value="ethereum">Ethereum</option>
        <option value="solana">Solana</option>
      </select>
      <br />
      <br />
      <button
        onClick={connectWallet}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Connect Wallet
      </button>
      {balance && (
        <div style={{ marginTop: "20px", fontSize: "20px" }}>
          <p>Balance: {balance}</p>
        </div>
      )}
      {error && (
        <div style={{ marginTop: "20px", color: "red", fontSize: "16px" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
