import React, { useRef } from 'react';
import {
  User,
  Briefcase,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  QrCode,
  RotateCcw,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Palette,
  Layers,
  UploadCloud,
  Trash2,
  Sliders,
} from 'lucide-react';
import { BusinessCardData, BackgroundStyleType, DEFAULT_CARD_DATA } from '../types';

interface CardEditorProps {
  data: BusinessCardData;
  onChange: (data: BusinessCardData) => void;
  onReset: () => void;
}

const BG_PRESETS: { id: BackgroundStyleType; name: string; desc: string; previewBg: string }[] = [
  {
    id: 'hermina_geometric',
    name: 'Hermina Facet (Asli)',
    desc: 'Geometris facet berlian poligon asli',
    previewBg: 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200',
  },
  {
    id: 'clean_minimalist',
    name: 'Clean Minimalis',
    desc: 'Putih bersih dengan ambient lembut',
    previewBg: 'bg-white border-slate-200',
  },
  {
    id: 'emerald_hospital',
    name: 'Emerald Waves',
    desc: 'Aksen kurva toska khas RS Hermina',
    previewBg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
  },
  {
    id: 'navy_executive',
    name: 'Navy Executive',
    desc: 'Geometris biru korporat profesional',
    previewBg: 'bg-gradient-to-br from-slate-100 to-blue-100',
  },
  {
    id: 'modern_dots',
    name: 'Modern Dot Grid',
    desc: 'Titik matriks grid presisi modern',
    previewBg: 'bg-gradient-to-br from-slate-50 to-slate-200',
  },
  {
    id: 'warm_gold',
    name: 'Champagne Gold',
    desc: 'Gradasi hangat emas berkelas',
    previewBg: 'bg-gradient-to-br from-amber-50 to-orange-100',
  },
  {
    id: 'custom_image',
    name: 'Upload Gambar Kustom',
    desc: 'Gunakan foto/desain dari perangkat Anda',
    previewBg: 'bg-gradient-to-br from-emerald-50 to-blue-50',
  },
];

const BASE_COLORS = [
  { label: 'Putih', value: '#ffffff' },
  { label: 'Soft Slate', value: '#f8fafc' },
  { label: 'Soft Mint', value: '#f0fdf4' },
  { label: 'Ice Blue', value: '#f0f9ff' },
  { label: 'Warm Ivory', value: '#fdfbf7' },
  { label: 'Soft Blush', value: '#fff1f2' },
];

export const CardEditor: React.FC<CardEditorProps> = ({ data, onChange, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof BusinessCardData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          ...data,
          logoType: 'custom',
          customLogoUrl: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          ...data,
          bgStyle: 'custom_image',
          customBgUrl: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 space-y-6">
      {/* Header with Quick Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Edit Data Kartu Nama
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuaikan informasi kartu nama digital Anda
          </p>
        </div>
        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
          title="Kembalikan ke data asli RS Hermina Arcamanik"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Contoh
        </button>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4">
        {/* Personal Details */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Identitas Pribadi
          </label>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Lengkap & Gelar
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Contoh: Wieke Novianti, S.Kep"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900 font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Jabatan / Posisi
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Contoh: Manager Marketing"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Company & Organization */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Perusahaan & Kontak
          </label>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Perusahaan / Instansi
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Contoh: PT Medikaloka Arcamanik"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900 font-medium"
              />
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Alamat Kantor
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Contoh: Jl. AH. Nasution No.50, Kota Bandung, 40291"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900 resize-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
              <span>Link Google Maps (Saat Alamat di-tap)</span>
              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-600 hover:underline"
              >
                Cek Link
              </a>
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.mapsUrl}
                onChange={(e) => handleChange('mapsUrl', e.target.value)}
                placeholder="https://share.google/yPSSdvbZ4LVIhJmqw"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ketika penerima mengklik alamat di kartu, link Google Maps ini akan langsung terbuka.
            </p>
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nomor WhatsApp / Telepon
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Contoh: 08986664140"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Otomatis terhubung ke chat WhatsApp saat di-tap, dan digunakan sebagai sumber scan QR Code otomatis.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Resmi
            </label>
            <div className="relative">
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Contoh: marketing.arcamanik@herminahospitals.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Website
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="Contoh: www.herminahospitals.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* QR Code & Logo Options */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fungsi QR Code & Logo
          </label>

          {/* QR Target Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              Tujuan Saat QR Code Di-scan
            </label>
            <select
              value={data.qrTargetType}
              onChange={(e) => handleChange('qrTargetType', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
            >
              <option value="whatsapp">Langsung Buka Chat WhatsApp Saya</option>
              <option value="vcard">Simpan Kontak ke HP (vCard)</option>
              <option value="website">Kunjungi Website Perusahaan</option>
              <option value="custom">Tautan / Link Kustom</option>
            </select>
          </div>

          {data.qrTargetType === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                URL Kustom QR Code
              </label>
              <input
                type="text"
                value={data.customQrUrl || ''}
                onChange={(e) => handleChange('customQrUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
              />
            </div>
          )}

          {/* Logo Selection */}
          <div className="pt-1">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Pilihan Logo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('logoType', 'hermina')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  data.logoType === 'hermina'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Hermina Arcamanik
              </button>

              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  data.logoType === 'custom'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                {data.customLogoUrl ? 'Ganti Logo Anda' : 'Upload Logo Lain'}
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Logo Alignment & Size adjustments */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Posisi Logo
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleChange('logoAlign', 'left')}
                    className={`py-1 text-xs font-medium rounded-md transition-all ${
                      (data.logoAlign || 'left') === 'left'
                        ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sejajar Nama (Kiri)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('logoAlign', 'center')}
                    className={`py-1 text-xs font-medium rounded-md transition-all ${
                      data.logoAlign === 'center'
                        ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tengah Area
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Ukuran Logo</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {data.logoSize || 120}px
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="165"
                  step="5"
                  value={data.logoSize || 120}
                  onChange={(e) => handleChange('logoSize', Number(e.target.value))}
                  aria-label="Ukuran logo dalam piksel"
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Greeting Message */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Pesan Pengantar WhatsApp
            </label>
            <input
              type="text"
              value={data.waGreeting}
              onChange={(e) => handleChange('waGreeting', e.target.value)}
              placeholder="Halo, salam hangat! Berikut kartu nama digital saya:"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-900"
            />
          </div>

          {/* Background & Card Design Customization */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                Latar Belakang & Desain Kartu
              </label>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                Kustomisasi
              </span>
            </div>

            {/* Background Presets Grid */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Pilihan Pola Latar (Presets)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BG_PRESETS.map((preset) => {
                  const isSelected = (data.bgStyle || 'hermina_geometric') === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (preset.id === 'custom_image' && !data.customBgUrl) {
                          bgFileInputRef.current?.click();
                        }
                        handleChange('bgStyle', preset.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold leading-tight flex items-center gap-1.5">
                          <span
                            className={`w-3 h-3 rounded-full border border-slate-300 ${preset.previewBg}`}
                          />
                          {preset.name}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-500 line-clamp-1">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Image Upload Panel */}
            {(data.bgStyle === 'custom_image' || data.customBgUrl) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    Gambar Latar Kustom
                  </span>
                  {data.customBgUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('customBgUrl', '');
                        handleChange('bgStyle', 'hermina_geometric');
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus Gambar
                    </button>
                  )}
                </div>

                {data.customBgUrl ? (
                  <div className="relative h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={data.customBgUrl}
                      alt="Latar Belakang Kustom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => bgFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded bg-white text-xs font-semibold text-slate-800 shadow-sm"
                      >
                        Ganti Gambar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => bgFileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-emerald-400/80 rounded-xl bg-emerald-50/40 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center gap-1 text-emerald-700"
                  >
                    <UploadCloud className="w-5 h-5" />
                    <span className="text-xs font-semibold">Pilih File Foto / Wallpaper Latar</span>
                    <span className="text-[10px] text-emerald-600/80">
                      JPG, PNG, WebP (Rekomendasi 700x400 px)
                    </span>
                  </button>
                )}
              </div>
            )}

            <input
              type="file"
              ref={bgFileInputRef}
              onChange={handleBgUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Base Background Color */}
            <div className="pt-1">
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Warna Dasar Kartu</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {data.customBgColor || '#ffffff'}
                </span>
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {BASE_COLORS.map((color) => {
                  const isSelected =
                    (data.customBgColor || '#ffffff').toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleChange('customBgColor', color.value)}
                      title={color.label}
                      className={`h-7 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/30 text-emerald-900 font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.label}</span>
                    </button>
                  );
                })}

                {/* Custom Color Picker input */}
                <label
                  title="Pilih Warna Kustom Lainnya"
                  className="h-7 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors text-xs text-slate-600"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="color"
                    value={data.customBgColor || '#ffffff'}
                    onChange={(e) => handleChange('customBgColor', e.target.value)}
                    className="w-4 h-4 p-0 border-0 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Opacity Slider for Background Pattern */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-slate-400" />
                  Ketebalan Pola Latar (Opacity)
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {data.bgOpacity ?? 100}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={data.bgOpacity ?? 100}
                onChange={(e) => handleChange('bgOpacity', Number(e.target.value))}
                aria-label="Ketebalan pola latar belakang (opacity) dalam persen"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
