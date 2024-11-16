import { SiHiveBlockchain } from "react-icons/si";
import Section from './Components/Section';
import Button from './components/Button';
import Navigation from './components/Navigation';
import Input from './components/Input';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css'

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
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const lastSelectedAccount = sessionStorage.getItem('selectedAccount');
    if (lastSelectedAccount) {
      setSelectedAccount(lastSelectedAccount);
      fetchBalance(lastSelectedAccount);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const allAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Connected Accounts:', allAccounts);
        setAccounts(allAccounts);
  
        // Use the account from sessionStorage or the first connected account
        const accountToUse = sessionStorage.getItem('selectedAccount') || allAccounts[0];
        setSelectedAccount(accountToUse);
        sessionStorage.setItem('selectedAccount', accountToUse);
  
        fetchBalance(accountToUse);
        setupContract();
        setConnected(true);
  
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };
  const handleAccountsChanged = (newAccounts) => {
    if (newAccounts.length > 0) {
      console.log('Account changed:', newAccounts[0]);
      setSelectedAccount(newAccounts[0]);
      sessionStorage.setItem('selectedAccount', newAccounts[0]);
      fetchBalance(newAccounts[0]);
    } else {
      // No accounts connected
      disconnectWallet();
    }
  };
  const requestNewAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        console.log('Newly selected account:', accounts[0]);
        setSelectedAccount(accounts[0]);
        sessionStorage.setItem('selectedAccount', accounts[0]);
        fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Error requesting new account:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear session storage and app state
      setAccounts([]);
      setSelectedAccount(null);
      setConnected(false);
      //sessionStorage.removeItem('selectedAccount');
  
      // Remove the event listener
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      setMessage('')
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  

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

  const handleAccountChange = async (event) => {
    const account = event.target.value;
    setSelectedAccount(account);
    sessionStorage.setItem('selectedAccount', account);
    await fetchBalance(account);
  };

  const confirmPurchase = async () => {
    try {
      if (!contract) return setMessage('Contract not loaded');
/////////////
      const accnt = await window.ethereum.request({
          "method":"eth_requestAccounts",
          "params": [],
        });
        /*
        const transId = await window.ethereum.request({
          "method": "eth_sendTransaction",
          "params":[
            {
              to: contract.to,
              from: accnt,
              gas: contract.gas,
              value: contract.value,
              data: contract.data,
              gasPrice: contract.gasPrice
            }
          ]
        });
        */



      const tx = await contract.confirmPurchase({
        value: ethers.parseEther('2'),
      });

      console.log("TX OBJECT:",JSON.stringify(tx));
      await tx.wait();
     
      setMessage('Purchase confirmed!' + transId);
    } catch (error) {
      console.error('Error confirming purchase:', error);
    }
  };

  const confirmReceived = async () => {

    try{
      if(!contract) return alert('Contract not loaded');
      
      const tx = await contract.confirmReceived();
      await tx.wait();

      setMessage("Item received");


    }catch(error){
      console.log('Error confirming received', error);
    }
  }
  

  const abortPurchase = async () => {
    try {
      if (!contract) return alert('Contract not loaded');
      setMessage('Only seller can abort the purchase')
      const tx = await contract.abort();
      
      await tx.wait();
      setMessage('Purchase aborted')
    } catch (error) {
      console.error('Error aborting purchase:', error);
    }
  };

  /** 
  useEffect(() => {
    connectWallet();
  }, []);
*/
  return (
    <div className="mx-auto" >
      <Section>
      <h1 className="p-4 text-blue-300 font-semibold text-8xl">Escrow DApp</h1>
      {
        !connected &&  <Button onClick={connectWallet} caption='Connect Wallet'/> 
      }
      {
        connected && (<>
          <div className="text-2xl p-2 px-4 text-black bg-gradient-to-b from-blue-500 to-blue-800 w-fit border-8 border-blue-900 rounded-lg m-4">
            <div className=" border-b-2 p-8 border-b-black">
            <label className="font-bold px-4 " htmlFor="accountSelect">Choose Account:</label>
            <select
              id="accountSelect"
              value={selectedAccount}
              onChange={handleAccountChange}
              className="bg-blue-700 border-2 border-black rounded-lg p-2"
            >
              {accounts.map((account) => (
                <option className="bg-blue-400 m-4" key={account} value={account}>
                      <p className="p-4">{account}</p>
                </option>
              ))}
            </select>
            </div>
            <div className="pt-8 pb-4 w-3/4 ">
              <div className="grid grid-cols-2 text-left ">
              <p className="text-2xl text-right pr-4 font-bold">Selected Account: </p>
              <p className="text-2xl text-left font-bold"> {selectedAccount}</p>
              <p className="text-2xl text-right pr-4 font-bold">Balance: </p>
              <p className="text-2xl text-left font-bold"> <span className="font-bold text-green-300">{balance} </span></p>
              </div>

            </div>
           
            </div>
            <div className="mt-0  grid grid-cols-4 gap-4  pt-8 pr-4 justify-items-stretch text-black">
            <Button onClick={confirmPurchase} className='' caption='Confirm Purchase'/>
            <Button onClick={confirmReceived} className='' caption='Confirm Received' />
            <Button onClick={abortPurchase} caption='Abort Purchase' />
            <Button onClick={disconnectWallet} caption='Disconnect Wallet'/> 

            </div>
          
        </>)
      }
     
      <div className="p-2">
          {
            message && (            <p className="text-2xl font-bold p-2 text-blue-200">{message}</p>
            )
          }
        
      </div>
      </Section>
    </div>
  );
};

export default App;
