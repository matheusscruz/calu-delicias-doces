import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, Loader2, X, Camera } from 'lucide-react';
import { fazerUploadImagem } from '../services/supabase';

export default function ImageSelector({ value, onChange, label = "Foto do Doce" }) {
  const [mode, setMode] = useState('upload'); // 'upload' ou 'url'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await fazerUploadImagem(file);
      onChange(imageUrl);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      alert('Não foi possível processar a foto. Tente novamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-[#4A3238]">
          {label} *
        </label>

        {/* Mode Selector Toggle */}
        <div className="flex items-center bg-[#FFF0F3] p-0.5 rounded-lg border border-[#FCD5DE] text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-[#D86B88] text-white shadow-2xs'
                : 'text-[#8C6D75] hover:text-[#3B2228]'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Galeria / Câmera</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-[#D86B88] text-white shadow-2xs'
                : 'text-[#8C6D75] hover:text-[#3B2228]'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Colar Link</span>
          </button>
        </div>
      </div>

      {/* Preview if image exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#F3DEE3] bg-[#FFF9FA] group">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full max-h-44 overflow-hidden flex items-center justify-center bg-gray-50">
            <img
              src={value}
              alt="Prévia do doce"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (mode === 'upload') {
                  fileInputRef.current?.click();
                } else {
                  handleClearImage();
                }
              }}
              className="bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Trocar</span>
            </button>

            <button
              type="button"
              onClick={handleClearImage}
              className="bg-black/60 hover:bg-rose-600 text-white p-1 rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
              title="Remover foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div>
          {mode === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-2 ${
                isUploading
                  ? 'border-[#D86B88] bg-[#FFF0F3]'
                  : 'border-[#E8B4C0] hover:border-[#D86B88] bg-[#FFFDFE] hover:bg-[#FFF9FA]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-7 h-7 text-[#D86B88] animate-spin" />
                  <p className="text-xs font-bold text-[#A83253]">Otimizando e preparando foto...</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F3] text-[#D86B88] flex items-center justify-center shadow-2xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3B2228]">
                      Toque para escolher da galeria ou tirar foto
                    </p>
                    <p className="text-[10px] text-[#8C6D75] mt-0.5">
                      JPG, PNG ou WebP (comprime automaticamente para abrir rápido)
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="url"
                placeholder="Cole aqui o link da imagem (ex: https://...)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDD3D9] bg-white text-xs font-mono"
              />
              <p className="text-[10px] text-[#8C6D75]">
                Dica: você pode colar links do Unsplash, Imgur, Instagram ou qualquer site.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
