import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LockAbi from "../src/utils/Lock.json";

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const contractABI = LockAbi.abi;

function Lock() {
  const [account, setAccount] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);
  const [lockedAmount, setLockedAmount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (account) {
      fetchLockedAmount();
    }
  }, [account]);

  useEffect(() => {
    fetchLockedAmount();
  }, []);

  // Fetch Locked Amount Function
  async function fetchLockedAmount() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    try {
      const amount = await contract.getLockedAmount();
      setLockedAmount(ethers.formatUnits(amount, "ether")); // Convert from Wei to Ether using ethers.formatUnits
    } catch (error) {
      console.error("Error fetching locked amount:", error);
    }
  }

  // Connect Wallet
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      setUnlockTime(Number(await contract.unlockTime())); // ✅ Convert BigInt to Number

      fetchLockedAmount();
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Disconnect Wallet
  async function disconnectWallet() {
    setAccount(null);
  }

  // Withdraw Funds
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

  // Deposit Funds
  async function depositFunds() {
    if (!window.ethereum || depositAmount <= 0) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) });
      await tx.wait();
      alert("Deposited successfully!");
      setDepositAmount("");
      fetchLockedAmount();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔒 Lock Smart Contract</h1>
      <button style={styles.button} onClick={account ? disconnectWallet : connectWallet}>
        {account ? `🔌 Disconnect Wallet (${account.slice(0, 6)}...)` : "💳 Connect Wallet"}
      </button>

      {unlockTime && (
        <p style={styles.unlockTime}>
          ⏳ Unlock Time: <strong>{new Date(unlockTime * 1000).toLocaleString()}</strong>
        </p>
      )}

      {lockedAmount !== null && (
        <p style={styles.lockedAmount}>
          💰 Locked Amount: <strong>{lockedAmount} ETH</strong>
        </p>
      )}

      <div style={styles.depositContainer}>
        <input
          type="number"
          placeholder="Enter deposit amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          style={styles.input}
        />
        <button style={styles.depositButton} onClick={depositFunds}>
          💸 Deposit Funds
        </button>
      </div>

      <button style={styles.withdrawButton} onClick={withdrawFunds}>
        💰 Withdraw Funds
      </button>
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
  depositContainer: {
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
    width: "calc(100% - 130px)", // Adjust width to fit with the button
    boxSizing: "border-box",
  },
  depositButton: {
    background: "#ffc107",
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
  },
  lockedAmount: {
    fontSize: "16px",
    color: "#555",
    marginTop: "15px",
  }
};

export default Lock;
