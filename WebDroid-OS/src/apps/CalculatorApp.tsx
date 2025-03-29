import React, { useState } from 'react';
import AppContainer from '../components/AppContainer';
import { useSound } from '../hooks/useSound';

interface CalculatorAppProps {
  closeApp: () => void;
}

const CalculatorApp: React.FC<CalculatorAppProps> = ({ closeApp }) => {
  // State for calculator
  const [displayValue, setDisplayValue] = useState('0');
  const [operand1, setOperand1] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isWaitingForOperand2, setIsWaitingForOperand2] = useState(false);
  // Add state for operation display
  const [operationDisplay, setOperationDisplay] = useState<string>('');
  const { playSound } = useSound();

  // Helper function to perform calculations
  const calculate = (val1: number, val2: number, op: string): number => {
    switch (op) {
      case '+':
        return val1 + val2;
      case '-':
        return val1 - val2;
      case '*':
        return val1 * val2;
      case '/':
        // Handle division by zero
        return val2 === 0 ? 0 : val1 / val2;
      default:
        return val2;
    }
  };

  // Clear all calculator state
  const handleClearClick = () => {
    playSound('/sounds/click.mp3', 0.3);
    setDisplayValue('0');
    setOperand1(null);
    setOperator(null);
    setIsWaitingForOperand2(false);
    setOperationDisplay('');
  };

  // Toggle the sign of the current number
  const handleToggleSignClick = () => {
    playSound('/sounds/click.mp3', 0.3);
    const value = parseFloat(displayValue);
    setDisplayValue(String(-value));
  };

  // Convert number to percentage
  const handlePercentClick = () => {
    playSound('/sounds/click.mp3', 0.3);
    const value = parseFloat(displayValue);
    setDisplayValue(String(value / 100));
  };

  // Handle equals button
  const handleEqualsClick = () => {
    playSound('/sounds/click.mp3', 0.4);
    
    // Can't perform calculation without operand1 and operator
    if (operand1 === null || !operator) {
      return;
    }

    const inputValue = parseFloat(displayValue);
    
    // Calculate the result
    const result = calculate(operand1, inputValue, operator);
    
    // Update the operation display to show the completed calculation
    setOperationDisplay(`${operand1} ${operator} ${inputValue} =`);
    
    // Update the display with the result
    setDisplayValue(String(result));
    
    // Reset the calculator state
    setOperand1(null);
    setOperator(null);
    setIsWaitingForOperand2(false);
  };

  // Calculator button values
  const buttonValues = ['C', '+/-', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];
  
  // Handle number input
  const handleNumberClick = (digit: string) => {
    playSound('/sounds/click.mp3', 0.2);
    
    if (isWaitingForOperand2) {
      setDisplayValue(digit);
      setIsWaitingForOperand2(false);
    } else {
      // Handle initial '0' case
      if (displayValue === '0') {
        // Replace '0' with digit unless the digit is '.'
        setDisplayValue(digit === '.' ? '0.' : digit);
      } else {
        // Prevent multiple decimals
        if (digit === '.' && displayValue.includes('.')) {
          return;
        }
        // Append digit to display value
        setDisplayValue(displayValue + digit);
      }
    }
  };

  // Handle operator input
  const handleOperatorClick = (nextOperator: string) => {
    playSound('/sounds/click.mp3', 0.3);
    
    // Convert current display value to number
    const inputValue = parseFloat(displayValue);

    // If no first operand yet, store the input value
    if (operand1 === null) {
      setOperand1(inputValue);
      setOperator(nextOperator);
      setIsWaitingForOperand2(true);
      // Update operation display to show the operand and operator
      setOperationDisplay(`${inputValue} ${nextOperator}`);
      return;
    }

    // If we already have an operator, calculate the result
    if (operator) {
      const result = calculate(operand1, inputValue, operator);

      // Update the operation display to show the chained operation
      setOperationDisplay(`${result} ${nextOperator}`);
      
      // Update the state with the result
      setDisplayValue(String(result));
      setOperand1(result);
    }

    // Set the new operator
    setOperator(nextOperator);
    setIsWaitingForOperand2(true);
  };

  // Function to determine button class based on value
  const getButtonClass = (value: string) => {
    // Base button classes
    const baseClasses = "rounded-btn transition-all duration-100 text-2xl p-3 sm:p-4 shadow-sm border-b border-r border-outline-variant/20";
    
    // Number buttons (0-9) and decimal
    if (/[0-9.]/.test(value)) {
      return `${baseClasses} bg-surface hover:bg-surface-variant active:translate-y-px active:shadow-none active:brightness-95 text-on-surface`;
    }
    
    // Operator buttons (+, -, *, /, =)
    if (['+', '-', '*', '/', '='].includes(value)) {
      // Highlight the active operator
      const isActive = operator === value && value !== '=';
      return `${baseClasses} ${
        isActive 
          ? 'bg-tertiary' 
          : 'bg-tertiary hover:bg-tertiary-container active:translate-y-px active:shadow-none active:brightness-95'
      } text-on-tertiary font-medium`;
    }
    
    // Top row function buttons (C, +/-, %)
    return `${baseClasses} bg-secondary hover:bg-secondary-container active:translate-y-px active:shadow-none active:brightness-95 text-on-secondary`;
  };
  
  // Create app bar content
  const renderAppBar = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={() => {
              playSound('/sounds/click.mp3', 0.3);
              closeApp();
            }}
            className="p-2 rounded-btn mr-2 text-on-surface hover:bg-surface/20 active:scale-95 transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-on-surface font-sans">
            <span className="relative inline-block">
              <span className="invisible">Calculator</span>
              <span className="absolute inset-0 animate-reveal-text" aria-hidden="true">Calculator</span>
            </span>
          </h1>
        </div>
        
        {/* History button (currently just visual, functionality TBD) */}
        <button
          className="p-2 rounded-btn text-on-surface hover:bg-surface/20 active:scale-95 transition-all duration-200"
          aria-label="History"
          onClick={() => playSound('/sounds/click.mp3', 0.3)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>
    );
  };
  
  return (
    <AppContainer 
      appId="calculator" 
      showAppBar={true}
      appBarContent={renderAppBar()}
    >
      <div className="w-full h-full flex flex-col overflow-hidden bg-page-background backdrop-blur-sm">
        {/* Calculator Display - flex-grow but without shrink restrictions */}
        <div className="flex-grow flex flex-col items-end justify-end p-4 sm:p-6 bg-gradient-to-b from-page-background to-surface text-on-surface">
          {/* Operation display */}
          <div className="text-sm text-secondary/80 mb-2 min-h-[20px] font-medium font-sans">
            {operationDisplay}
          </div>
          <div className="text-5xl sm:text-6xl font-light overflow-x-auto max-w-full scrollbar-hide font-sans">
            {displayValue}
          </div>
        </div>
        
        {/* Calculator Button Pad - explicitly set to not shrink */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-surface border-t border-outline-variant/10">
          {buttonValues.map((value, index) => (
            <button
              key={index}
              className={`
                ${getButtonClass(value)}
                ${value === '0' ? 'col-span-2' : ''}
              `}
              onClick={() => {
                if (/[0-9.]/.test(value)) {
                  handleNumberClick(value);
                } else if (['+', '-', '*', '/'].includes(value)) {
                  handleOperatorClick(value);
                } else if (value === '=') {
                  handleEqualsClick();
                } else if (value === 'C') {
                  handleClearClick();
                } else if (value === '+/-') {
                  handleToggleSignClick();
                } else if (value === '%') {
                  handlePercentClick();
                }
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </AppContainer>
  );
};

export default CalculatorApp;
