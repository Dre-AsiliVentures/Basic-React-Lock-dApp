import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  "function withdraw() public",
  "function owner() public view returns (address)",
  "function unlockTime() public view returns (uint256)"
];

function Lock() {
  const [account, setAccount] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      setUnlockTime(Number(await contract.unlockTime())); // ✅ Convert BigInt to Number
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function withdrawFunds() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Withdrawn successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔒 Lock Smart Contract</h1>
      <button style={styles.button} onClick={connectWallet}>
        {account ? `✅ Connected: ${account.slice(0, 6)}...` : "💳 Connect Wallet"}
      </button>

      {unlockTime && (
        <p style={styles.unlockTime}>
          ⏳ Unlock Time: <strong>{new Date(unlockTime * 1000).toLocaleString()}</strong>
        </p>
      )}

      <button style={styles.withdrawButton} onClick={withdrawFunds}>💰 Withdraw Funds</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    background: "#ffffff",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    background: "#007bff",
    color: "white",
    fontSize: "16px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  withdrawButton: {
    background: "#28a745",
    color: "white",
    fontSize: "16px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "15px",
    transition: "0.3s",
  },
  unlockTime: {
    fontSize: "16px",
    color: "#555",
    marginTop: "15px",
  }
};


export default Lock;
