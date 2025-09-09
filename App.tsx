
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FormulaInput } from './components/FormulaInput';
import { SolutionDisplay } from './components/SolutionDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getFormulaSolution } from './services/geminiService';
import { Solution } from './types';
import { Testimonials } from './components/Testimonials';
import { ShareButtons } from './components/ShareButtons';

const App: React.FC = () => {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (userRequest: string, brokenFormula: string) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await getFormulaSolution(userRequest, brokenFormula);
      setSolution(parseSolution(result));
    } catch (e) {
      if (e instanceof Error) {
        setError(`An error occurred: ${e.message}. Please check your connection or API key and try again.`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const parseSolution = (markdownText: string): Solution => {
    const lines = markdownText.split('\n');
    let formula = '';
    let explanation = '';
    let inCodeBlock = false;
    let foundFormula = false;

    // A simple parser to extract the formula from the first markdown code block
    // and the rest as the explanation.
    for (const line of lines) {
      if (line.startsWith('```')) {
        if (!foundFormula) {
            inCodeBlock = !inCodeBlock;
            if (!inCodeBlock) {
              foundFormula = true; // Once we exit the first code block, we're done with the formula
            }
        } else {
           explanation += line + '\n';
        }
        continue;
      }
      if (inCodeBlock) {
        formula += line + '\n';
      } else {
        explanation += line + '\n';
      }
    }

    // Clean up formula and explanation
    formula = formula.trim();
    explanation = explanation.trim();

    return {
      formula,
      explanation
    };
  };

  return (
    <div className="min-h-screen bg-slate-100/50 font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700">Describe Your Formula Problem</h2>
            <p className="mt-2 text-base text-slate-600">
              Explain what you want to achieve in plain English. For fixes, paste your broken formula.
            </p>
            <FormulaInput onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <LoadingSpinner />
              <p className="mt-4 text-lg font-semibold text-slate-600">Dr. Sheets is thinking...</p>
              <p className="text-slate-500">Crafting the perfect formula for you.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {solution && !isLoading && (
            <div className="mt-8">
              <SolutionDisplay solution={solution} />
              <ShareButtons />
            </div>
          )}

          <Testimonials />
        </main>

        <footer className="text-center mt-12 text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} dr-sheets.com. Powered by AI.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
