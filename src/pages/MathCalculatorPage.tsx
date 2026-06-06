import React, { useState } from 'react';

export function MathCalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue == null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPreviousValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const handleEqual = () => {
    if (operator && previousValue != null) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operator);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="flex-1 w-full mx-auto">
      <div className="p-4 md:p-10 pb-24 md:pb-10 flex flex-col items-center justify-center min-h-full">
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-sm">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-150 dark:border-slate-800/80">
            <div className="text-right text-slate-400 dark:text-slate-550 h-6 text-xs font-semibold">
              {previousValue != null && operator ? `${previousValue} ${operator}` : ''}
            </div>
            <div className="text-right text-4xl font-mono text-slate-800 dark:text-white tracking-wider truncate mt-1">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button onClick={handleClear} className="col-span-2 py-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-lg font-bold hover:bg-red-500/20 transition-all cursor-pointer">C</button>
            <button onClick={() => setDisplay(String(parseFloat(display) * -1))} className="py-4 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 rounded-2xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">±</button>
            <button onClick={() => handleOperator('÷')} className="py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xl font-bold hover:bg-blue-500/20 transition-all cursor-pointer">÷</button>

            <button onClick={() => handleDigit('7')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">7</button>
            <button onClick={() => handleDigit('8')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">8</button>
            <button onClick={() => handleDigit('9')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">9</button>
            <button onClick={() => handleOperator('×')} className="py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xl font-bold hover:bg-blue-500/20 transition-all cursor-pointer">×</button>

            <button onClick={() => handleDigit('4')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">4</button>
            <button onClick={() => handleDigit('5')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">5</button>
            <button onClick={() => handleDigit('6')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">6</button>
            <button onClick={() => handleOperator('-')} className="py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xl font-bold hover:bg-blue-500/20 transition-all cursor-pointer">-</button>

            <button onClick={() => handleDigit('1')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">1</button>
            <button onClick={() => handleDigit('2')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">2</button>
            <button onClick={() => handleDigit('3')} className="py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">3</button>
            <button onClick={() => handleOperator('+')} className="py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xl font-bold hover:bg-blue-500/20 transition-all cursor-pointer">+</button>

            <button onClick={() => handleDigit('0')} className="col-span-2 py-4 bg-slate-100/60 text-slate-800 dark:bg-slate-800/40 dark:text-white rounded-2xl text-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer">0</button>
            <button onClick={handleDecimal} className="py-4 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 rounded-2xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">.</button>
            <button onClick={handleEqual} className="py-4 bg-blue-600 text-white rounded-2xl text-2xl font-bold hover:bg-blue-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]">=</button>
          </div>
        </div>
      </div>
    </div>
  );
}
