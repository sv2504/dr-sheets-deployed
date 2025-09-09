import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface FormulaInputProps {
  onSubmit: (userRequest: string, brokenFormula: string) => void;
  isLoading: boolean;
}

const MAX_WORDS = 200;

export const FormulaInput: React.FC<FormulaInputProps> = ({ onSubmit, isLoading }) => {
  const [userRequest, setUserRequest] = useState<string>('');
  const [brokenFormula, setBrokenFormula] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // A simple word count logic, splits by whitespace
    const words = userRequest.trim().split(/\s+/).filter(Boolean);
    setWordCount(userRequest.trim() === '' ? 0 : words.length);
  }, [userRequest]);

  const isOverLimit = wordCount > MAX_WORDS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRequest.trim() && !isOverLimit) {
      onSubmit(userRequest, brokenFormula);
    }
  };

  const canSubmit = !isLoading && userRequest.trim() && !isOverLimit;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="user-request" className="block text-base font-medium text-slate-600 mb-1">
          Describe what you want to achieve*
        </label>
        <textarea
          id="user-request"
          rows={4}
          className="w-full p-3 text-base bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out"
          placeholder="e.g., 'Find the total sales for a specific product from another sheet'"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          required
          aria-describedby="word-count"
        />
        <p id="word-count" className="text-right text-sm text-slate-500 mt-1">
          <span className={isOverLimit ? 'font-bold text-red-600' : ''}>{wordCount}</span> / {MAX_WORDS} words
        </p>
      </div>
      <div>
        <label htmlFor="broken-formula" className="block text-base font-medium text-slate-600 mb-1">
          Paste your broken formula (optional)
        </label>
        <textarea
          id="broken-formula"
          rows={2}
          className="w-full p-3 font-mono text-base bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out"
          placeholder="=VLOOKUP(A2, Sheet2!A:B, 3, FALSE)"
          value={brokenFormula}
          onChange={(e) => setBrokenFormula(e.target.value)}
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Ask Dr. Sheets
            </>
          )}
        </button>
      </div>
    </form>
  );
};