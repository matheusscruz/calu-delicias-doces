/**
 * Comprime uma imagem no navegador antes de enviar,
 * reduzindo para no máximo 900px e formato WebP/JPEG leve (~40KB a 90KB).
 */
export function compressImage(file, maxWidth = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Gera em WebP (super compacto e suportado por todos celulares modernos)
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
