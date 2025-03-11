
## **🔒 Reack Lock dApp**
This is a **simple decentralized application (dApp)** built with **React (frontend)** and **Solidity (backend)** that allows users to **lock Ether** in a smart contract and withdraw it after a specified unlock time.

---
![Basic-React-Lock-dApp](https://github.com/Dre-AsiliVentures/Basic-React-Lock-dApp/blob/master/img/Screenshot_2025-03-11_131511.png)

## **📌 Features**
✅ Lock Ether until a specific timestamp  
✅ Withdraw funds only after the unlock time  
✅ Deposit additional funds into the contract  
✅ Connect MetaMask to interact with the smart contract  
✅ Styled frontend without external libraries  

---

## **🛠 Tech Stack**
- ![Solidity](https://img.shields.io/badge/-Solidity-363636?style=flat&logo=solidity) **Solidity** (Smart contract development)
- ![Hardhat](https://img.shields.io/badge/-Hardhat-ff9b21?style=flat&logo=hardhat) **Hardhat** (Development and deployment framework)
- ![React](https://img.shields.io/badge/-React.js-61DAFB?style=flat&logo=react&logoColor=white) **React.js** (Frontend)
- ![Ethers.js](https://img.shields.io/badge/-ethers.js-303030?style=flat&logo=ethers.js) **ethers.js** (Blockchain interactions)
- ![MetaMask](https://img.shields.io/badge/-MetaMask-f6851b?style=flat&logo=metamask&logoColor=white) **MetaMask** (Wallet connection)


---

## **📂 Project Structure**
```
lock-dapp/
│── contracts/            # Solidity smart contracts
│   ├── Lock.sol          # Lock contract
│── scripts/              # Deployment scripts
│   ├── deploy.js         # Deploys contract to blockchain
│── test/                 # Test scripts for contract
│   ├── Lock.js           # Test cases using Hardhat
│── frontend/             # React frontend
│   ├── src/              # Source files
│   │   ├── Lock.js       # Main dApp component
│   │   ├── App.js        # Root component
│── hardhat.config.js     # Hardhat configuration
│── package.json          # Node.js dependencies
│── README.md             # Project documentation
```

---

## **🚀 Getting Started**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Dre-AsiliVentures/Basic-React-Lock-dApp.git
cd Basic-React-Lock-dApp
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Compile the Smart Contract**
```sh
npx hardhat compile
```

### **4️⃣ Deploy the Contract**
```sh
npx hardhat run scripts/deploy.js --network localhost
```
_This deploys the contract to a local Hardhat node._

### **5️⃣ Start the Frontend**
```sh
cd frontend
npm start
```
_This starts the React frontend._

---

## **💻 Smart Contract (`Lock.sol`)**
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);
    event Deposit(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function deposit() public payable {
        require(msg.value > 0, "Weka Deposit amount kubwa!!");

        emit Deposit(msg.value, block.timestamp);
    }

    function getLockedAmount() public view returns (uint) {
        return address(this).balance;
    }
}
```
🔹 **Users can deposit funds into the contract.**  
🔹 **Funds can only be withdrawn by the owner after unlock time.**  
🔹 **Events (`Deposit` & `Withdrawal`) track transactions.**  

---

## **🧪 Running Tests**
To test the smart contract:
```sh
npx hardhat test
```

---

## **🎨 Frontend (`Lock.js`)**
```javascript
import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
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
      const unlockTimeBigInt = await contract.unlockTime();
      setUnlockTime(Number(unlockTimeBigInt));
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
```

---

## **📝 Notes**
- Make sure your **MetaMask wallet is connected to the correct network**.
- You **must deploy the contract first** before using the frontend.
- Update `contractAddress` in `Lock.js` with the **deployed contract address**.

---

## **📜 License**
This project is **open-source** and available under the **MIT License**.

---

🎉 **Enjoy this React Lock dApp!** Let me know if you need any improvements. 🚀🔥
