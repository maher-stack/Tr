import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

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
        <div className="bg-[#111111] p-6 rounded-xl border border-[#1f1f1f] shadow-sm w-full max-w-sm">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 mb-6 border border-[#222]">
            <div className="text-right text-gray-500 h-6 text-sm">
              {previousValue != null && operator ? `${previousValue} ${operator}` : ''}
            </div>
            <div className="text-right text-4xl font-mono text-white tracking-wider truncate">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button onClick={handleClear} className="col-span-2 py-4 bg-red-500/10 text-red-500 rounded-2xl text-lg font-bold hover:bg-red-500/20 transition-colors">C</button>
            <button onClick={() => setDisplay(String(parseFloat(display) * -1))} className="py-4 bg-[#1a1a1a] text-white rounded-2xl text-lg font-bold hover:bg-[#222] transition-colors">±</button>
            <button onClick={() => handleOperator('÷')} className="py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-colors">÷</button>

            <button onClick={() => handleDigit('7')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">7</button>
            <button onClick={() => handleDigit('8')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">8</button>
            <button onClick={() => handleDigit('9')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">9</button>
            <button onClick={() => handleOperator('×')} className="py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-colors">×</button>

            <button onClick={() => handleDigit('4')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">4</button>
            <button onClick={() => handleDigit('5')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">5</button>
            <button onClick={() => handleDigit('6')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">6</button>
            <button onClick={() => handleOperator('-')} className="py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-colors">-</button>

            <button onClick={() => handleDigit('1')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">1</button>
            <button onClick={() => handleDigit('2')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">2</button>
            <button onClick={() => handleDigit('3')} className="py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">3</button>
            <button onClick={() => handleOperator('+')} className="py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-colors">+</button>

            <button onClick={() => handleDigit('0')} className="col-span-2 py-4 bg-[#161616] text-white rounded-2xl text-xl font-medium hover:bg-[#222] transition-colors">0</button>
            <button onClick={handleDecimal} className="py-4 bg-[#161616] text-white rounded-2xl text-lg font-bold hover:bg-[#222] transition-colors">.</button>
            <button onClick={handleEqual} className="py-4 bg-emerald-500 text-black rounded-2xl text-2xl font-bold hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors">=</button>
          </div>
        </div>
      </div>
    </div>
  );
}
