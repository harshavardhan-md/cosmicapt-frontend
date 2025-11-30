import React, { useState } from 'react';

function SecretDisplay({ secret, commitment }) {
  const [copied, setCopied] = useState(false);

  const downloadSecret = () => {
    const data = JSON.stringify({ secret, commitment, timestamp: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmicapt-secret-${Date.now()}.json`;
    a.click();
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="secret-warning">
        <div className="warning-icon">🔐</div>
        <div>
          <strong>SAVE YOUR SECRET!</strong><br />
          Without this, you cannot withdraw your funds on Aptos.
        </div>
      </div>

      <div className="secret-box">
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Secret:</div>
        {secret}
        <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Commitment:</div>
        {commitment}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button className="btn btn-primary" onClick={downloadSecret} style={{ flex: 1 }}>
          📥 Download
        </button>
        <button className="btn btn-secondary" onClick={copySecret} style={{ flex: 1 }}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}

export default SecretDisplay;