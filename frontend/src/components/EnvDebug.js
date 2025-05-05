import React from 'react';

function EnvDebug() {
  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px 0' }}>
      <h3>Environment Variables Debug</h3>
      <p>REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'Not defined'}</p>
    </div>
  );
}

export default EnvDebug;