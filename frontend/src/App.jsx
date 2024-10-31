import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const CONTRACT_ABI =  [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidState",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyBuyer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlySeller",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ValueNotEven",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "Aborted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ItemReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "PurchaseConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "SellerRefunded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "abort",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyer",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmPurchase",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmReceived",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refundSeller",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "seller",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "internalType": "enum Escrow.State",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "value",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [contract, setContract] = useState(null);

  // Load last selected account from localStorage
  useEffect(() => {
    const lastSelectedAccount = localStorage.getItem('selectedAccount');
    if (lastSelectedAccount) {
      setSelectedAccount(lastSelectedAccount);
      fetchBalance(lastSelectedAccount);
    }
  }, []);

  // Connect to MetaMask and load accounts
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const allAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Connected Accounts:', allAccounts);
        setAccounts(allAccounts);

        // Automatically select the last or first account
        const accountToUse = localStorage.getItem('selectedAccount') || allAccounts[0];
        setSelectedAccount(accountToUse);
        fetchBalance(accountToUse);
        setupContract();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Set up contract instance
  const setupContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(escrowContract);
      console.log('Escrow contract loaded:', escrowContract);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  // Fetch the balance of the selected account
  const fetchBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balanceWei);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    }
  };

  // Handle account selection change
  const handleAccountChange = async (event) => {
    const account = event.target.value;
    setSelectedAccount(account);
    localStorage.setItem('selectedAccount', account);
    await fetchBalance(account);
  };

  // Confirm purchase (buyer function)
  const confirmPurchase = async () => {
    try {
      if (!contract) return alert('Contract not loaded');
      const tx = await contract.confirmPurchase({
        value: ethers.parseEther('2'), // 2 ETH purchase value
      });
      await tx.wait();
      alert('Purchase confirmed!');
    } catch (error) {
      console.error('Error confirming purchase:', error);
    }
  };

  // Abort purchase (seller function)
  const abortPurchase = async () => {
    try {
      if (!contract) return alert('Contract not loaded');
      const tx = await contract.abort();
      await tx.wait();
      alert('Purchase aborted!');
    } catch (error) {
      console.error('Error aborting purchase:', error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Escrow DApp</h1>
      <div>
        <label htmlFor="accountSelect">Select Account:</label>
        <select
          id="accountSelect"
          value={selectedAccount}
          onChange={handleAccountChange}
        >
          {accounts.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>
      <p>Selected Account: {selectedAccount}</p>
      <p>Balance: {balance} ETH</p>
      <button onClick={connectWallet}>Reconnect Wallet</button>

      <div style={{ marginTop: '20px' }}>
        <h2>Contract Actions</h2>
        <button onClick={confirmPurchase} style={{ marginRight: '10px' }}>
          Confirm Purchase
        </button>
        <button onClick={abortPurchase}>Abort Purchase</button>
      </div>
    </div>
  );
};

export default App;
