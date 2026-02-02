
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const cappedProgress = Math.min(100, Math.max(0, progress));

  // Softer, lighter stripes for a more subtle "wave" effect
  const animatedStripesStyle: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    )`,
    backgroundSize: '40px 40px',
    animation: 'move-stripes 2s linear infinite',
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mt-6 overflow-hidden">
      <div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out relative animate-pulse-glow"
        style={{
          width: `${cappedProgress}%`,
        }}
      >
        <div 
            className="absolute top-0 right-0 bottom-0 left-0"
            style={animatedStripesStyle}
        />
      </div>
    </div>
  );
};

export default ProgressBar;