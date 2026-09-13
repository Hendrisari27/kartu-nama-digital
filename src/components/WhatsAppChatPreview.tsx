import React from 'react';
import { CheckCheck, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { BusinessCardData } from '../types';
import { getCardLinks } from '../utils/whatsapp';
import { BusinessCard } from './BusinessCard';

interface WhatsAppChatPreviewProps {
  cardData: BusinessCardData;
}

export const WhatsAppChatPreview: React.FC<WhatsAppChatPreviewProps> = ({ cardData }) => {
  const { waUrl, mapsUrl: mapsLink, websiteUrl: webUrl, mailUrl } = getCardLinks(cardData);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#efeae2] rounded-2xl overflow-hidden shadow-xl border border-slate-300 flex flex-col font-sans">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-white text-sm shadow-xs">
            {cardData.fullName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('') || 'WA'}
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight">{cardData.fullName}</h4>
            <p className="text-[11px] text-emerald-200">Online • RS Hermina Arcamanik</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-emerald-100">
          <Video className="w-4 h-4 cursor-pointer hover:text-white" />
          <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Chat Messages Body */}
      <div
        className="p-4 space-y-3 overflow-y-auto max-h-[480px]"
        style={{
          backgroundColor: '#efeae2',
          backgroundImage:
            'radial-gradient(#d3cbbe 1px, transparent 1px), radial-gradient(#d3cbbe 1px, #efeae2 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      >
        {/* Date badge */}
        <div className="flex justify-center">
          <span className="bg-white/80 backdrop-blur-xs text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-md shadow-2xs">
            HARI INI
          </span>
        </div>

        {/* Outgoing WhatsApp Bubble */}
        <div className="flex justify-end">
          <div className="max-w-[92%] bg-[#d9fdd3] text-slate-900 rounded-2xl rounded-tr-xs p-2.5 shadow-sm border border-emerald-100/50 space-y-2">
            {/* Embedded Thumbnail of the Card */}
            <div className="rounded-xl overflow-hidden shadow-xs border border-emerald-950/10 bg-white relative">
              <div className="scale-[0.45] origin-top-left -mr-[385px] -mb-[220px]">
                <BusinessCard data={cardData} />
              </div>
            </div>

            {/* Accompanying Text Caption */}
            <div className="px-1 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
              <p className="font-bold text-slate-900">📇 KARTU NAMA DIGITAL</p>
              <p className="text-slate-600 italic text-[11px] mb-1">{cardData.waGreeting}</p>
              <p className="font-bold text-slate-900 text-sm">{cardData.fullName}</p>
              <p className="text-slate-700 font-medium">{cardData.jobTitle}</p>
              <p className="font-semibold text-emerald-800">{cardData.companyName}</p>

              <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] space-y-1.5">
                <p>
                  📍 <span className="font-medium">{cardData.address}</span>
                </p>
                <p>
                  🗺️ Google Maps:{' '}
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium underline hover:text-blue-800"
                  >
                    Buka di Google Maps ↗
                  </a>
                </p>
                <p>
                  📞 Telp/WA:{' '}
                  <a
                    href={waUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold underline hover:text-emerald-800"
                  >
                    {cardData.phone}
                  </a>
                </p>
                <p>
                  ✉️ Email:{' '}
                  <a
                    href={mailUrl || undefined}
                    className="text-slate-700 underline hover:text-emerald-700"
                  >
                    {cardData.email}
                  </a>
                </p>
                <p>
                  🌐 Web:{' '}
                  <a
                    href={webUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium underline hover:text-blue-800"
                  >
                    {cardData.website}
                  </a>
                </p>
              </div>
            </div>

            {/* Bubble Footer with Timestamp & Blue Double Checkmarks */}
            <div className="flex items-center justify-end space-x-1 pt-1 text-[10px] text-slate-500">
              <span>09:41</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Input Simulation */}
      <div className="bg-[#f0f2f5] p-2.5 px-3 flex items-center space-x-2 border-t border-slate-200">
        <Smile className="w-5 h-5 text-slate-500 shrink-0" />
        <Paperclip className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-xs text-slate-400 border border-slate-200 shadow-2xs">
          Ketik pesan...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xs">
          <Send className="w-4 h-4 ml-0.5" />
        </div>
      </div>
    </div>
  );
};
