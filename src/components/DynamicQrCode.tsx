import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface DynamicQrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const DynamicQrCode: React.FC<DynamicQrCodeProps> = ({
  value,
  size = 90,
  className = '',
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // 2x for sharp rendering
      margin: 1,
      color: {
        dark: '#1e293b', // slate-800 for soft contrast
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) {
          setQrSrc(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!qrSrc) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 animate-pulse rounded border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 ${className}`}
      >
        QR
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`bg-white p-0.5 rounded shadow-xs shrink-0 flex items-center justify-center ${className}`}
    >
      <img
        src={qrSrc}
        alt="Kode QR kartu nama digital, pindai untuk membuka kontak"
        width={size}
        height={size}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
