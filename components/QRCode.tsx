import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

// This is a simple placeholder component to visually represent a QR code
// without adding a full library for this mock application.
const QRCode: React.FC<QRCodeProps> = ({ value, size = 128 }) => {
  // A simple hashing function to generate a somewhat unique pattern for different URLs
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
  
  const hash = getHash(value);
  const gridSize = 15;
  
  const modules = Array.from({ length: gridSize * gridSize }).map((_, i) => {
      // Create a pseudo-random but deterministic pattern
      return (hash >> (i % 31)) & 1;
  });

  return (
    <div style={{ width: size, height: size, display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {modules.map((isBlack, i) => (
        <div key={i} style={{ backgroundColor: isBlack ? '#000' : '#FFF' }} />
      ))}
    </div>
  );
};

export default QRCode;
