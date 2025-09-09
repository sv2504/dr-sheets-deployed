
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
        Dr. Sheets
      </h1>
      <p className="mt-2 text-lg text-emerald-600 font-medium">
        Your AI-Powered Google Sheets Formula Expert
      </p>
    </header>
  );
};
