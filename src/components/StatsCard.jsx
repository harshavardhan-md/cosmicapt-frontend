import React from 'react';

function StatsCard({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.totalDeposits}</div>
        <div className="stat-label">Total Deposits</div>
      </div>
      <div className="stat-card" style={{ background: 'var(--mint)' }}>
        <div className="stat-value">{stats.totalWithdrawals}</div>
        <div className="stat-label">Total Withdrawals</div>
      </div>
      <div className="stat-card" style={{ background: 'var(--peach)' }}>
        <div className="stat-value">
          {parseInt(stats.totalDeposits) - parseInt(stats.totalWithdrawals)}
        </div>
        <div className="stat-label">Anonymity Set</div>
      </div>
    </div>
  );
}

export default StatsCard;