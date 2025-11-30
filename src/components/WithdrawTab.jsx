import React, { useState } from 'react';

function WithdrawTab() {
  const [secret, setSecret] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const connectPetra = async () => {
    if (!window.aptos) {
      alert('Please install Petra Wallet!');
      window.open('https://petra.app/', '_blank');
      return;
    }

    try {
      const response = await window.aptos.connect();
      setAccount(response.address);
    } catch (error) {
      console.error('Error connecting Petra:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        try {
          const data = JSON.parse(content);
          setSecret(data.secret || content.trim());
        } catch {
          setSecret(content.trim());
        }
      };
      reader.readAsText(file);
    }
  };

//   const withdraw = async () => {
//     if (!secret || !account) {
//       alert('Upload secret and connect wallet first!');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Request transaction from bridge
//       const response = await fetch(`${process.env.REACT_APP_BRIDGE_API}/withdraw`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ secret, recipientAddress: account }),
//       });

//       const result = await response.json();
      
//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       // For now, show success (in production, user would sign the transaction)
//       alert('Withdrawal initiated! In production, you would sign with Petra wallet.');
//       setSuccess(true);
//     } catch (error) {
//       console.error('Withdrawal failed:', error);
//       alert('Withdrawal failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

const withdraw = async () => {
  if (!secret || !account) {
    alert('Upload secret and connect wallet first!');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_BRIDGE_API}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, recipientAddress: account }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }

    // Show success
    setSuccess(true);
  } catch (error) {
    console.error('Withdrawal failed:', error);
    alert('Withdrawal failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="card card-mint success-message">
        <div className="checkmark">✅</div>
        <h2>Withdrawal Successful!</h2>
        <p style={{ margin: '16px 0', color: 'var(--gray-dark)' }}>
          APT has been sent to your Aptos wallet.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSuccess(false);
            setSecret('');
          }}
          style={{ marginTop: '16px' }}
        >
          Make Another Withdrawal
        </button>
      </div>
    );
  }

  return (
    <div className="card card-peach">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <h2 style={{ marginBottom: '24px', fontSize: '28px' }}>
        🎁 Withdraw APT
      </h2>

      <div className="secret-warning">
        <div className="warning-icon">⚠️</div>
        <div>
          <strong>Privacy Notice:</strong> Use a NEW Aptos wallet that has never been linked to your Ethereum address for maximum privacy.
        </div>
      </div>

      {!account ? (
        <button className="btn btn-primary" onClick={connectPetra} style={{ width: '100%', padding: '20px' }}>
          Connect Petra Wallet
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
            <label className="input-label">Upload Secret File</label>
            <input 
              type="file" 
              accept=".txt,.json"
              onChange={handleFileUpload}
              className="input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Or Paste Secret</label>
            <input 
              type="text" 
              className="input" 
              placeholder="0x..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </div>

          {secret && (
            <div className="secret-box">
              Secret: {secret.substring(0, 20)}...
            </div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={withdraw}
            disabled={loading || !secret}
            style={{ width: '100%', padding: '20px', fontSize: '16px' }}
          >
            {loading ? '⏳ Withdrawing...' : '💸 Withdraw APT'}
          </button>
        </>
      )}
    </div>
  );
}

export default WithdrawTab;