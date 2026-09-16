import React from 'react';

export const LP3ILogo = ({ height = 58 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/lp3i-logo.png"
        alt="Logo Politeknik LP3I Jakarta Kampus Depok"
        className="lp3i-logo-img"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))'
        }}
      />
    </div>
  );
};

