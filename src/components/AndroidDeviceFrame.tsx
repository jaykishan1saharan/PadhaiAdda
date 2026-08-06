import React from 'react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full transition-colors duration-200">
      {children}
    </div>
  );
};