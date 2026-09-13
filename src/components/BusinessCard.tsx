import { forwardRef } from 'react';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { BusinessCardData } from '../types';
import { HerminaLogo } from './HerminaLogo';
import { CardBackground } from './CardBackground';
import { DynamicQrCode } from './DynamicQrCode';
import { getQrCodeValue, getCardLinks } from '../utils/whatsapp';

interface BusinessCardProps {
  data: BusinessCardData;
  scale?: number;
  className?: string;
}

export const BusinessCard = forwardRef<HTMLDivElement, BusinessCardProps>(
  ({ data, scale = 1, className = '' }, ref) => {
    const qrValue = getQrCodeValue(data);
    const { waUrl, mapsUrl: mapsLink, websiteUrl: webUrl, mailUrl } = getCardLinks(data);

    return (
      <div
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'center center',
        }}
        className={`transition-transform duration-200 ${className}`}
      >
        {/* Card Canvas with standard business card aspect ratio (approx 1.75:1) */}
        <div
          ref={ref}
          id="digital-business-card"
          className="relative w-[700px] h-[400px] rounded-xl shadow-2xl overflow-hidden select-none border border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between p-9 transition-colors duration-200"
          style={{
            backgroundColor: data.customBgColor || '#ffffff',
            boxShadow:
              '0 20px 35px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Customizable Background Layer */}
          <CardBackground
            style={data.bgStyle || 'hermina_geometric'}
            customBgUrl={data.customBgUrl}
            customBgColor={data.customBgColor}
            opacity={data.bgOpacity ?? 100}
          />

          {/* Top Area: Logo aligned with left line of person's name */}
          <div className="relative z-10 flex-1 flex items-center">
            <div
              className={`flex-1 pr-5 flex items-center ${
                data.logoAlign === 'center' ? 'justify-center' : 'justify-start'
              }`}
            >
              {data.logoType === 'hermina' ? (
                <HerminaLogo size={data.logoSize || 120} />
              ) : data.customLogoUrl ? (
                <img
                  src={data.customLogoUrl}
                  alt={data.companyName}
                  style={{ maxHeight: `${(data.logoSize || 120) * 0.8}px` }}
                  className="max-w-[240px] object-contain"
                />
              ) : (
                <HerminaLogo size={data.logoSize || 120} />
              )}
            </div>

            {/* Spacer aligning with middle divider and right block */}
            <div className="w-[1.5px] shrink-0 mx-2 invisible pointer-events-none" />
            <div className="flex-1 pl-5 pointer-events-none" />
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 flex items-start justify-between pt-2">
            {/* Left Block: Personal Info + QR Code */}
            <div className="flex items-start justify-between flex-1 pr-5">
              {/* Name & Title */}
              <div className="flex-1 min-w-0 pr-3">
                <h1 className="text-[16.5px] font-bold text-slate-800 tracking-tight leading-snug break-words">
                  {data.fullName || 'Nama Lengkap'}
                </h1>
                <p className="text-[13px] italic text-slate-500 font-normal tracking-wide mt-1 break-words">
                  {data.jobTitle || 'Jabatan'}
                </p>
              </div>

              {/* QR Code (Tap to open WhatsApp) */}
              <a
                href={qrValue}
                target="_blank"
                rel="noopener noreferrer"
                title="Pindai atau Klik untuk Chat WhatsApp"
                className="shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 block"
              >
                <DynamicQrCode value={qrValue} size={72} />
              </a>
            </div>

            {/* Thin Vertical Divider Line */}
            <div className="h-28 w-[1.5px] bg-slate-400/60 shrink-0 mx-2 self-stretch rounded-full" />

            {/* Right Block: Company & Contact Details with Direct Tap Links */}
            <div className="flex-1 min-w-0 pl-5">
              <h2 className="text-[16.5px] font-bold text-slate-800 tracking-tight leading-snug mb-2.5 break-words">
                {data.companyName || 'Nama Perusahaan'}
              </h2>

              <div className="space-y-1.5 text-[11.5px] text-slate-600">
                {/* 1. Address -> Tap to Google Maps */}
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Klik untuk membuka lokasi di Google Maps"
                  className="flex items-start space-x-2 group cursor-pointer transition-colors text-slate-600 hover:text-emerald-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-700 group-hover:text-emerald-600 shrink-0 mt-0.5 transition-colors" />
                  <span className="leading-tight font-medium group-hover:underline underline-offset-2">
                    {data.address || 'Alamat Perusahaan'}
                  </span>
                </a>

                {/* 2. Email -> Tap to Mailto */}
                <a
                  href={mailUrl || undefined}
                  title={`Klik untuk mengirim email ke ${data.email}`}
                  className="flex items-start space-x-2 group cursor-pointer transition-colors text-slate-600 hover:text-emerald-700"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-700 group-hover:text-emerald-600 shrink-0 mt-0.5 transition-colors" />
                  <span className="min-w-0 break-all leading-tight font-medium group-hover:underline underline-offset-2">
                    {data.email || 'email@perusahaan.com'}
                  </span>
                </a>

                {/* 3. Phone -> Tap to WhatsApp / Phone */}
                <a
                  href={waUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Klik untuk chat WhatsApp atau telepon ${data.phone}`}
                  className="flex items-start space-x-2 group cursor-pointer transition-colors text-slate-600 hover:text-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-700 group-hover:text-emerald-600 shrink-0 mt-0.5 transition-colors" />
                  <span className="min-w-0 break-words leading-tight font-medium group-hover:underline underline-offset-2">
                    {data.phone || '08xxxxxxxxxx'}
                  </span>
                </a>

                {/* 4. Website -> Tap to Website */}
                <a
                  href={webUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Klik untuk mengunjungi website ${data.website}`}
                  className="flex items-start space-x-2 group cursor-pointer transition-colors text-slate-600 hover:text-emerald-700"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-700 group-hover:text-emerald-600 shrink-0 mt-0.5 transition-colors" />
                  <span className="min-w-0 break-all leading-tight font-medium group-hover:underline underline-offset-2">
                    {data.website || 'www.website.com'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BusinessCard.displayName = 'BusinessCard';
