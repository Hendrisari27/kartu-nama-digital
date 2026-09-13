import React from 'react';
import { BackgroundStyleType } from '../types';
import { GeometricBackground } from './GeometricBackground';

interface CardBackgroundProps {
  style?: BackgroundStyleType;
  customBgUrl?: string;
  customBgColor?: string;
  opacity?: number;
}

export const CardBackground: React.FC<CardBackgroundProps> = ({
  style = 'hermina_geometric',
  customBgUrl,
  opacity = 100,
}) => {
  const normOpacity = Math.max(0, Math.min(100, opacity)) / 100;

  if (style === 'custom_image') {
    if (!customBgUrl) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 border-2 border-dashed border-slate-200/80 rounded-xl m-2 bg-slate-50/50">
          <p className="text-xs text-slate-400 font-medium">
            (Pilih atau Upload Gambar Latar Belakang di Panel Editor)
          </p>
        </div>
      );
    }
    // Unggahan pengguna berupa data URL (data:) tidak butuh crossOrigin dan
    // aman untuk diekspor. crossOrigin="anonymous" hanya relevan untuk URL
    // remote http(s) agar canvas tidak ter-taint saat html-to-image mengekspor.
    const isRemoteImage = /^https?:\/\//i.test(customBgUrl);

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ opacity: normOpacity }}
      >
        <img
          src={customBgUrl}
          alt="Custom Background"
          className="w-full h-full object-cover"
          crossOrigin={isRemoteImage ? 'anonymous' : undefined}
        />
      </div>
    );
  }

  if (style === 'clean_minimalist') {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transition-opacity"
        style={{ opacity: normOpacity }}
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full bg-slate-200/40 blur-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-slate-50 to-transparent" />
      </div>
    );
  }

  if (style === 'emerald_hospital') {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ opacity: normOpacity }}
      >
        <svg
          className="absolute right-0 top-0 w-full h-full"
          viewBox="0 0 700 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="emeraldWave1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="emeraldWave2" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M420,0 C520,70 480,180 700,160 L700,0 Z"
            fill="url(#emeraldWave1)"
          />
          <path
            d="M340,400 C430,280 540,320 700,240 L700,400 Z"
            fill="url(#emeraldWave2)"
          />
          <circle cx="620" cy="80" r="140" fill="#10b981" fillOpacity="0.04" />
          <circle cx="580" cy="320" r="180" fill="#059669" fillOpacity="0.03" />
        </svg>
      </div>
    );
  }

  if (style === 'navy_executive') {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ opacity: normOpacity }}
      >
        <svg
          className="absolute right-0 top-0 w-full h-full"
          viewBox="0 0 700 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="navyGrad1" x1="100%" y1="0%" x2="40%" y2="80%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#334155" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="450,0 700,0 700,250 560,180" fill="url(#navyGrad1)" />
          <polygon points="560,180 700,250 700,400 420,400" fill="#1e293b" fillOpacity="0.05" />
          <polygon points="380,400 420,400 560,180 480,240" fill="#0f172a" fillOpacity="0.03" />
          <polygon points="520,0 700,0 700,120" fill="#3b82f6" fillOpacity="0.04" />
        </svg>
      </div>
    );
  }

  if (style === 'modern_dots') {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ opacity: normOpacity }}
      >
        <svg
          className="absolute right-0 top-0 w-full h-full"
          viewBox="0 0 700 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.8" fill="#64748b" fillOpacity="0.35" />
            </pattern>
            <linearGradient id="dotsFade" x1="100%" y1="50%" x2="40%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <mask id="dotsMask">
              <rect x="0" y="0" width="700" height="400" fill="url(#dotsFade)" />
            </mask>
          </defs>
          <rect
            x="300"
            y="0"
            width="400"
            height="400"
            fill="url(#dotPattern)"
            mask="url(#dotsMask)"
          />
          <circle cx="600" cy="200" r="150" fill="#059669" fillOpacity="0.03" />
        </svg>
      </div>
    );
  }

  if (style === 'warm_gold') {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ opacity: normOpacity }}
      >
        <svg
          className="absolute right-0 top-0 w-full h-full"
          viewBox="0 0 700 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad1" x1="100%" y1="0%" x2="30%" y2="80%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="100%" y1="100%" x2="30%" y2="20%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M450,0 C540,80 500,180 700,140 L700,0 Z"
            fill="url(#goldGrad1)"
          />
          <path
            d="M380,400 C470,290 560,330 700,220 L700,400 Z"
            fill="url(#goldGrad2)"
          />
        </svg>
      </div>
    );
  }

  // Default: hermina_geometric
  return (
    <div style={{ opacity: normOpacity }}>
      <GeometricBackground />
    </div>
  );
};
