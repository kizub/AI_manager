import React from 'react';

export const LauncherButton: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => {
  return (
    <button 
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      {isOpen ? '✕' : '💬'}
    </button>
  );
};
