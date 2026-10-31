import React, { useState } from 'react';
import { X, Lock, Delete, Sparkles, AlertCircle } from 'lucide-react';

export default function PinModal({
  isOpen,
  onClose,
  expectedPin = '2026',
  onSuccess
}) {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      setErrorMessage('');

      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
    setErrorMessage('');
  };

  const handleClear = () => {
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  const validatePin = (inputPin) => {
    if (inputPin === expectedPin) {
      onSuccess();
      onClose();
      setPin('');
    } else {
      setError(true);
      setErrorMessage('PIN incorreto. Tente novamente.');
      setTimeout(() => {
        setPin('');
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200 border border-[#F5E2E6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#D86B88] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>

          <span className="text-xs font-bold text-[#8C6D75] uppercase tracking-wider">
            Acesso Master
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-serif font-bold text-lg text-[#3B2228]">
            Área da Calu
          </h3>
          <p className="text-xs text-[#755960] mt-1">
            Digite seu PIN de 4 números para gerenciar o cardápio
          </p>
        </div>

        {/* 4 Dots PIN Display */}
        <div className="flex items-center justify-center gap-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 scale-110 animate-shake'
                    : isFilled
                    ? 'bg-[#D86B88] scale-115 shadow-xs'
                    : 'bg-[#F2D7DD]'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs text-rose-600 font-semibold animate-pulse">
            {errorMessage}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-2xl bg-[#FFF9FA] hover:bg-[#FBE9ED] active:scale-92 text-[#3B2228] font-bold text-lg border border-[#F2D7DD] transition-all cursor-pointer shadow-2xs"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-white hover:bg-gray-50 active:scale-95 text-xs font-semibold text-[#8C6D75] transition-colors cursor-pointer"
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-[#FFF9FA] hover:bg-[#FBE9ED] active:scale-92 text-[#3B2228] font-bold text-lg border border-[#F2D7DD] transition-all cursor-pointer shadow-2xs"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-white hover:bg-gray-50 active:scale-95 flex items-center justify-center text-[#8C6D75] transition-colors cursor-pointer"
            aria-label="Apagar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-[#A68890] pt-1">
          Dica: o PIN padrão inicial é <span className="font-mono font-bold">2026</span>
        </p>
      </div>
    </div>
  );
}
