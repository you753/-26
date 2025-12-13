import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, X, Minimize2, Maximize2, GripVertical, Delete, Percent } from 'lucide-react';

type CalculatorSize = 'small' | 'medium' | 'large';

export default function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<CalculatorSize>('medium');
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForValue, setWaitingForValue] = useState(false);
  const [history, setHistory] = useState<string>('');

  const sizeConfig = {
    small: { width: 'w-56', buttonHeight: 'h-10', fontSize: 'text-lg', displayPadding: 'p-2' },
    medium: { width: 'w-72', buttonHeight: 'h-12', fontSize: 'text-2xl', displayPadding: 'p-3' },
    large: { width: 'w-96', buttonHeight: 'h-16', fontSize: 'text-4xl', displayPadding: 'p-4' }
  };

  const currentSize = sizeConfig[size];

  const calculate = useCallback((firstValue: string, secondValue: string, op: string) => {
    const first = parseFloat(firstValue);
    const second = parseFloat(secondValue);

    switch (op) {
      case '+':
        return (first + second).toString();
      case '-':
        return (first - second).toString();
      case '*':
        return (first * second).toString();
      case '/':
        return second !== 0 ? (first / second).toString() : 'خطأ';
      case '%':
        return ((first * second) / 100).toString();
      default:
        return secondValue;
    }
  }, []);

  const inputNumber = useCallback((num: string) => {
    if (waitingForValue) {
      setDisplay(num);
      setWaitingForValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForValue]);

  const inputOperation = useCallback((nextOperation: string) => {
    const inputValue = display;

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(`${inputValue} ${nextOperation === '*' ? '×' : nextOperation === '/' ? '÷' : nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(newValue);
      setPreviousValue(newValue);
      setHistory(`${newValue} ${nextOperation === '*' ? '×' : nextOperation === '/' ? '÷' : nextOperation}`);
    }

    setWaitingForValue(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation, calculate]);

  const performCalculation = useCallback(() => {
    const inputValue = display;

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(newValue);
      setHistory('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForValue(true);
    }
  }, [display, previousValue, operation, calculate]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForValue(false);
    setHistory('');
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const inputDecimal = useCallback(() => {
    if (waitingForValue) {
      setDisplay('0.');
      setWaitingForValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForValue]);

  const toggleSign = useCallback(() => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  }, [display]);

  const percentage = useCallback(() => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  }, [display]);

  const cycleSize = useCallback(() => {
    const sizes: CalculatorSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setSize(sizes[nextIndex]);
  }, [size]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        inputOperation('+');
      } else if (e.key === '-') {
        inputOperation('-');
      } else if (e.key === '*') {
        inputOperation('*');
      } else if (e.key === '/') {
        e.preventDefault();
        inputOperation('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        performCalculation();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === '%') {
        percentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inputNumber, inputDecimal, inputOperation, performCalculation, clearAll, backspace, percentage]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50" data-testid="calculator-button">
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-full px-5 py-6 transition-all duration-300 hover:scale-110"
          size="default"
        >
          <CalculatorIcon className="h-6 w-6 ml-2" />
          <span className="font-bold">آلة حاسبة</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50" data-testid="calculator-container">
      <Card className={`${currentSize.width} shadow-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalculatorIcon className="h-5 w-5 text-white" />
              <span className="text-white font-bold text-sm">آلة حاسبة</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleSize}
                className="h-7 w-7 p-0 text-white hover:bg-white/20 rounded-full"
                title={size === 'small' ? 'تكبير' : size === 'medium' ? 'تكبير للحد الأقصى' : 'تصغير'}
              >
                {size === 'large' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0 text-white hover:bg-red-500/80 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 space-y-3">
          <div className={`bg-black/60 ${currentSize.displayPadding} rounded-xl border border-emerald-500/30`}>
            <div className="text-emerald-400/70 text-xs text-left h-4 font-mono">
              {history}
            </div>
            <div 
              className={`text-white ${currentSize.fontSize} font-bold font-mono text-left break-all leading-tight`}
              style={{ direction: 'ltr' }}
              data-testid="calculator-display"
            >
              {parseFloat(display).toLocaleString('en-US', { maximumFractionDigits: 10 })}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button 
              onClick={clearAll} 
              className={`${currentSize.buttonHeight} bg-red-500/90 hover:bg-red-600 text-white font-bold text-base rounded-xl transition-all active:scale-95`}
              data-testid="button-clear"
            >
              AC
            </Button>
            <Button 
              onClick={clearEntry} 
              className={`${currentSize.buttonHeight} bg-orange-500/90 hover:bg-orange-600 text-white font-bold text-base rounded-xl transition-all active:scale-95`}
              data-testid="button-clear-entry"
            >
              CE
            </Button>
            <Button 
              onClick={backspace} 
              className={`${currentSize.buttonHeight} bg-amber-500/90 hover:bg-amber-600 text-white font-bold rounded-xl transition-all active:scale-95`}
              data-testid="button-backspace"
            >
              <Delete className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => inputOperation('/')} 
              className={`${currentSize.buttonHeight} bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-divide"
            >
              ÷
            </Button>

            {['7', '8', '9'].map(num => (
              <Button 
                key={num}
                onClick={() => inputNumber(num)} 
                className={`${currentSize.buttonHeight} bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
                data-testid={`button-${num}`}
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={() => inputOperation('*')} 
              className={`${currentSize.buttonHeight} bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-multiply"
            >
              ×
            </Button>

            {['4', '5', '6'].map(num => (
              <Button 
                key={num}
                onClick={() => inputNumber(num)} 
                className={`${currentSize.buttonHeight} bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
                data-testid={`button-${num}`}
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={() => inputOperation('-')} 
              className={`${currentSize.buttonHeight} bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-subtract"
            >
              −
            </Button>

            {['1', '2', '3'].map(num => (
              <Button 
                key={num}
                onClick={() => inputNumber(num)} 
                className={`${currentSize.buttonHeight} bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
                data-testid={`button-${num}`}
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={() => inputOperation('+')} 
              className={`${currentSize.buttonHeight} bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-add"
            >
              +
            </Button>

            <Button 
              onClick={toggleSign} 
              className={`${currentSize.buttonHeight} bg-slate-600 hover:bg-slate-500 text-white font-bold text-lg rounded-xl transition-all active:scale-95`}
              data-testid="button-toggle-sign"
            >
              ±
            </Button>
            <Button 
              onClick={() => inputNumber('0')} 
              className={`${currentSize.buttonHeight} bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-0"
            >
              0
            </Button>
            <Button 
              onClick={inputDecimal} 
              className={`${currentSize.buttonHeight} bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-decimal"
            >
              .
            </Button>
            <Button 
              onClick={performCalculation} 
              className={`${currentSize.buttonHeight} bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl transition-all active:scale-95`}
              data-testid="button-equals"
            >
              =
            </Button>

            <Button 
              onClick={percentage} 
              className={`col-span-2 ${currentSize.buttonHeight} bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-xl transition-all active:scale-95`}
              data-testid="button-percentage"
            >
              <Percent className="h-4 w-4 ml-1" />
              نسبة مئوية
            </Button>
            <Button 
              onClick={cycleSize}
              className={`col-span-2 ${currentSize.buttonHeight} bg-slate-600 hover:bg-slate-500 text-white font-bold text-sm rounded-xl transition-all active:scale-95`}
              data-testid="button-resize"
            >
              {size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'}
              <GripVertical className="h-4 w-4 mr-1" />
            </Button>
          </div>

          <div className="text-center text-emerald-400/50 text-xs">
            استخدم الأرقام من لوحة المفاتيح للإدخال السريع
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
