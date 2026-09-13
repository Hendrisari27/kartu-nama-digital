import React, { useState } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { BusinessCardData } from '../types';
import {
  generateWhatsAppMessage,
  createWhatsAppUrl,
} from '../utils/whatsapp';
import { downloadVCard } from '../utils/vcard';
import {
  downloadCardImage,
  downloadCardPdf,
  copyCardImageToClipboard,
  shareCardImageNatively,
} from '../utils/exportImage';
import { useToast } from './Toast';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: BusinessCardData;
  cardElementRef: React.RefObject<HTMLDivElement | null>;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  cardData,
  cardElementRef,
}) => {
  const { showToast } = useToast();
  const [targetPhone, setTargetPhone] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'text' | 'image'>('direct');

  if (!isOpen) return null;

  const formattedMessage = generateWhatsAppMessage(cardData);

  const handleSendToTargetPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPhone.trim()) {
      showToast('Silakan masukkan nomor tujuan WhatsApp terlebih dahulu.', 'info');
      return;
    }
    const url = createWhatsAppUrl(cardData, targetPhone);
    window.open(url, '_blank');
  };

  const handleOpenGeneralWhatsApp = () => {
    const url = createWhatsAppUrl(cardData);
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyImage = async () => {
    if (!cardElementRef.current) return;
    setIsExporting(true);
    const success = await copyCardImageToClipboard(cardElementRef.current);
    setIsExporting(false);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
      showToast('Gambar kartu tersalin. Tekan Ctrl+V di WhatsApp Web/Desktop.', 'success');
    } else {
      showToast('Browser ini tidak mendukung salin gambar otomatis. Gunakan tombol "Unduh Gambar HD".', 'error');
    }
  };

  const handleDownloadImage = async () => {
    if (!cardElementRef.current) return;
    setIsExporting(true);
    try {
      const sanitizedName = cardData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadCardImage(cardElementRef.current, `Kartu-Nama-${sanitizedName}.png`, 2.5);
    } catch (e) {
      console.error(e);
      showToast('Gagal mengunduh gambar kartu.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardElementRef.current) return;
    setIsExporting(true);
    try {
      const sanitizedName = cardData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadCardPdf(cardElementRef.current, `Kartu-Nama-${sanitizedName}.pdf`);
    } catch (e) {
      console.error(e);
      showToast('Gagal mengunduh dokumen PDF kartu.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!cardElementRef.current) return;
    setIsExporting(true);
    await shareCardImageNatively(
      cardElementRef.current,
      `Kartu Nama Digital - ${cardData.fullName}`,
      formattedMessage
    );
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/80 flex items-center justify-center shadow-inner">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Kirim Kartu Nama ke WhatsApp
              </h3>
              <p className="text-xs text-emerald-100">
                Pilih metode pengiriman yang paling praktis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog kirim WhatsApp"
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'direct'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Kirim Langsung
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'image'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            PDF, Gambar & vCard
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'text'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pratinjau Pesan
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* TAB 1: Direct Send */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <form onSubmit={handleSendToTargetPhone} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Masukkan Nomor Tujuan WhatsApp Penerima:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={targetPhone}
                      onChange={(e) => setTargetPhone(e.target.value)}
                      placeholder="Contoh: 08123456789 atau 62812..."
                      className="w-full pl-3 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-medium text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Chat
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Format otomatis dikonversi ke internasional (contoh: 08... menjadi 628...).
                </p>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-xs text-slate-400 font-medium">atau</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* General WhatsApp Share */}
              <button
                onClick={handleOpenGeneralWhatsApp}
                type="button"
                className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                Pilih Kontak / Grup di WhatsApp (Share Dialog)
              </button>

              {/* Copy image fast button */}
              <button
                onClick={handleCopyImage}
                disabled={isExporting}
                type="button"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {copiedImage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Gambar Kartu Tersalin! Tekan Ctrl+V di WhatsApp</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    Salin Gambar Kartu (Bisa langsung Paste/Ctrl+V di WhatsApp Web)
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Image & vCard */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Copy Image Button */}
                <button
                  onClick={handleCopyImage}
                  disabled={isExporting}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    {copiedImage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                      {copiedImage ? 'Tersalin ke Clipboard!' : 'Salin Gambar Kartu'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tinggal tekan Ctrl+V (Paste) di chat WhatsApp Web atau Desktop.
                    </p>
                  </div>
                </button>

                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-300 text-left transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-800">
                      Unduh Dokumen PDF
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ukuran standar cetak (90x51.4mm), siap dicetak atau dikirim sebagai file dokumen PDF di WhatsApp.
                    </p>
                  </div>
                </button>

                {/* Download PNG Button */}
                <button
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-800">
                      Unduh Gambar HD (PNG)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Resolusi tinggi, siap dikirim sebagai lampiran foto/dokumen di WhatsApp.
                    </p>
                  </div>
                </button>

                {/* Download vCard (.vcf) */}
                <button
                  onClick={() => downloadVCard(cardData)}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                      Unduh File Kontak (.vcf)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kirim file ini ke WhatsApp agar penerima bisa simpan nomor 1 klik.
                    </p>
                  </div>
                </button>

                {/* Web Share API */}
                <button
                  onClick={handleNativeShare}
                  disabled={isExporting}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-800">
                      Bagikan via HP (Share Sheet)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Buka menu berbagi native untuk langsung mengirim ke aplikasi WhatsApp.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Message Text Preview */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Pratinjau Teks Format WhatsApp:
                </span>
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Teks
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Bubble Simulation */}
              <div className="p-4 bg-[#e7f8ee] border border-emerald-200/70 rounded-2xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                {formattedMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>RS Hermina Arcamanik • Kartu Nama Digital</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
