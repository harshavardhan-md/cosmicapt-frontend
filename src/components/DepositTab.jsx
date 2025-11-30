import React, { useState } from 'react';
import { ethers } from 'ethers';
import SecretDisplay from './SecretDisplay';

// // OLD (WRONG)
// const CONTRACT_ABI = [
//   "function deposit(bytes32 commitment) payable",
//   "function DEPOSIT_AMOUNT() view returns (uint256)"
// ];

// NEW (CORRECT)
const CONTRACT_ABI = [
  "function deposit(bytes32 commitment) payable",
  "function DEPOSIT_AMOUNT() view returns (uint256)",
  "function getDepositCount() view returns (uint256)"
];

function DepositTab() {
  const [secret, setSecret] = useState('');
  const [commitment, setCommitment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [account, setAccount] = useState('');

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert('Please install MetaMask!');
//       return;
//     }

//     try {
//       const accounts = await window.ethereum.request({ 
//         method: 'eth_requestAccounts' 
//       });
//       setAccount(accounts[0]);
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//     }
//   };

const connectWallet = async () => {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return;
  }

  try {
    // Request accounts
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // Check if on Sepolia (chainId: 0xaa36a7 = 11155111)
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== '0xaa36a7') {
      // Switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }],
          });
        } else {
          throw switchError;
        }
      }
    }

    setAccount(accounts[0]);
  } catch (error) {
    console.error('Error connecting wallet:', error);
    alert('Failed to connect wallet: ' + error.message);
  }
};

  const generateSecret = () => {
    const randomSecret = ethers.hexlify(ethers.randomBytes(32));
    const hash = ethers.keccak256(randomSecret);
    setSecret(randomSecret);
    setCommitment(hash);
  };

//   const deposit = async () => {
    
    // Replace this entire deposit function:
const deposit = async () => {
  if (!secret || !account) {
    alert('Generate secret and connect wallet first!');
    return;
  }

  setLoading(true);
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.REACT_APP_ETHEREUM_CONTRACT,
      CONTRACT_ABI,
      signer
    );

    // Use hardcoded amount instead of reading from contract
    const depositAmount = ethers.parseEther("0.0001");
    const tx = await contract.deposit(commitment, { value: depositAmount });
    
    setTxHash(tx.hash);
    await tx.wait();
    
    setSuccess(true);
  } catch (error) {
    console.error('Deposit failed:', error);
    alert('Deposit failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="card card-mint success-message">
        <div className="checkmark">✅</div>
        <h2>Deposit Successful!</h2>
        <p style={{ margin: '16px 0', color: 'var(--gray-dark)' }}>
          Your funds are now mixing in the privacy pool.
        </p>
        <a 
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: '16px' }}
        >
          View on Etherscan →
        </a>
        <SecretDisplay secret={secret} commitment={commitment} />
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setSuccess(false);
            setSecret('');
            setCommitment('');
          }}
          style={{ marginTop: '16px', width: '100%' }}
        >
          Make Another Deposit
        </button>
      </div>
    );
  }

  return (
    <div className="card card-lavender">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <h2 style={{ marginBottom: '24px', fontSize: '28px' }}>
        💰 Deposit ETH
      </h2>

      {!account ? (
        <button className="btn btn-primary" onClick={connectWallet} style={{ width: '100%', padding: '20px' }}>
          Connect MetaMask
        </button>
      ) : (
        <>
          <div className="input-group">
            <label className="input-label">Connected Wallet</label>
            <input 
              type="text" 
              className="input input-readonly" 
              value={account} 
              readOnly 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Amount</label>
            <input 
              type="text" 
              className="input input-readonly" 
              value="0.0001 ETH (Fixed)" 
              readOnly 
            />
          </div>

          {!secret ? (
            <button 
              className="btn btn-primary" 
              onClick={generateSecret}
              style={{ width: '100%', padding: '20px', fontSize: '16px' }}
            >
              🎲 Generate Secret
            </button>
          ) : (
            <>
              <SecretDisplay secret={secret} commitment={commitment} />
              
              <button 
                className="btn btn-primary" 
                onClick={deposit}
                disabled={loading}
                style={{ width: '100%', padding: '20px', fontSize: '16px' }}
              >
                {loading ? '⏳ Depositing...' : '🚀 Deposit Now'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default DepositTab;