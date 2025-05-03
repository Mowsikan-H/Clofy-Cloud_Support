import React from 'react';

function LoadingSpinner({ size = 'md', color = 'primary' }) {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  return (
    <div className="d-flex justify-content-center p-3">
      <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;