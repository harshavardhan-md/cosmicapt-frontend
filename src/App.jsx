import React, { useState, useEffect } from 'react';
import './App.css';
import DepositTab from './components/DepositTab';
import WithdrawTab from './components/WithdrawTab';
import StatsCard from './components/StatsCard';

function App() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [stats, setStats] = useState({ totalDeposits: '0', totalWithdrawals: '0' });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BRIDGE_API}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div>
          <h1>🌌 COSMIC_APT</h1>
          <div className="header-subtitle">Cross-Chain Privacy Bridge</div>
        </div>
        <div className="wallet-buttons">
          <span className="badge badge-new">TESTNET</span>
        </div>
      </header>

      <StatsCard stats={stats} />

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          💰 Deposit (Ethereum)
        </button>
        <button 
          className={`tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          🎁 Withdraw (Aptos)
        </button>
      </div>

      {activeTab === 'deposit' ? <DepositTab /> : <WithdrawTab />}

      <div className="card card-cream" style={{ textAlign: 'center', marginTop: '32px' }}>
        <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>
          🔐 Your privacy is protected. On-chain observers cannot link deposits to withdrawals.
        </p>
      </div>
    </div>
  );
}

export default App;