import { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  MessageCircle,
  Eye,
  Sliders,
  Sparkles,
  FileDown,
  FileText,
  RotateCcw,
  Smartphone,
  CreditCard,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  LogOut,
  LogIn,
  Users,
  Lock,
} from 'lucide-react';
import { BusinessCardData, DEFAULT_CARD_DATA } from './types';
import { BusinessCard } from './components/BusinessCard';
import { CardEditor } from './components/CardEditor';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { WhatsAppChatPreview } from './components/WhatsAppChatPreview';
import { downloadCardImage, copyCardImageToClipboard, downloadCardPdf } from './utils/exportImage';
import { downloadVCard } from './utils/vcard';
import { createWhatsAppUrl } from './utils/whatsapp';
import { useToast } from './components/Toast';
import { useAuth } from './components/AuthContext';
import { AuthModal } from './components/LoginForm';
import { UserManagementModal } from './components/UserManagementModal';

export default function App() {
  const { showToast } = useToast();
  const { currentUser, isAdmin, loading, logout } = useAuth();
  const [cardData, setCardData] = useState<BusinessCardData>(DEFAULT_CARD_DATA);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'card' | 'whatsapp'>('card');
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [cardScale, setCardScale] = useState<number>(0.6);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit scale on mobile and window resize
  useEffect(() => {
    // Skala default tampilan kartu = 60%. Di layar sempit, sesuaikan agar tetap
    // muat tetapi tidak melebihi 60%.
    const DEFAULT_SCALE = 0.6;
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // padding
        if (containerWidth < 700) {
          const calculatedScale = Math.max(0.42, Math.min(DEFAULT_SCALE, containerWidth / 720));
          setCardScale(calculatedScale);
        } else {
          setCardScale(DEFAULT_SCALE);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleReset = () => {
    setCardData(DEFAULT_CARD_DATA);
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    const success = await copyCardImageToClipboard(cardRef.current);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
      showToast('Gambar kartu tersalin ke clipboard. Tekan Ctrl+V di WhatsApp.', 'success');
    } else {
      showToast('Salin gambar tidak didukung di perangkat ini. Gunakan "Unduh PNG" atau modal Kirim WhatsApp.', 'error');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const sanitizedName = cardData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadCardImage(cardRef.current, `Kartu-Nama-${sanitizedName}.png`, 2.5);
    } catch (e) {
      console.error(e);
      showToast('Gagal mengunduh kartu.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const sanitizedName = cardData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadCardPdf(cardRef.current, `Kartu-Nama-${sanitizedName}.pdf`);
    } catch (e) {
      console.error(e);
      showToast('Gagal mengunduh kartu dalam format PDF.', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleQuickWhatsApp = () => {
    const url = createWhatsAppUrl(cardData);
    window.open(url, '_blank');
  };

  const handleLogout = () => {
    logout();
    showToast('Anda telah keluar.', 'info');
  };

  // Splash singkat selama inisialisasi auth (seed admin & baca sesi).
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md animate-pulse">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base lg:text-lg leading-tight tracking-tight">
                  Kartu Nama Digital WhatsApp
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  RS Hermina Arcamanik
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Desain presisi sesuai kartu fisik, siap kirim dan bagikan langsung ke WhatsApp
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center justify-end flex-wrap gap-2">
            <button
              onClick={handleCopyImage}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
              title="Salin gambar kartu ke clipboard untuk dipaste (Ctrl+V) di WhatsApp Web"
            >
              {copiedImage ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gambar Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Gambar</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-200 shadow-2xs"
              title="Unduh format dokumen PDF standar cetak (90x51.4mm)"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label="Unduh kartu sebagai gambar PNG"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Unduh PNG</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs lg:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="sm:hidden">Kirim WA</span>
              <span className="hidden sm:inline">Kirim ke WhatsApp</span>
            </button>

            {/* Kelola Akun (khusus admin) */}
            {isAdmin && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200"
                title="Kelola akun pengguna"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Kelola Akun</span>
              </button>
            )}

            {/* Info user + logout / tombol masuk */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200">
                <div className="hidden sm:block text-right leading-tight">
                  <p className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Keluar dari akun"
                  title="Keluar"
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 ml-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
                title="Masuk untuk mengedit kartu"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Preview Stage (kartu / simulasi WhatsApp).
              Sticky langsung sebagai anak grid agar tetap menempel sepanjang scroll editor di mobile. */}
          <div className="w-full order-1 lg:order-none lg:col-span-7 self-start sticky top-[64px] sm:top-[72px] z-20 space-y-3 bg-slate-50/95 backdrop-blur-sm pb-3 -mx-1 px-1 rounded-b-2xl lg:top-20 lg:bg-transparent lg:backdrop-blur-none lg:pb-0 lg:mx-0 lg:px-0 lg:space-y-4">
            {/* View Switcher & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setActiveViewMode('card')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeViewMode === 'card'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Desain Kartu Asli</span>
                </button>
                <button
                  onClick={() => setActiveViewMode('whatsapp')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeViewMode === 'whatsapp'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulasi WhatsApp Chat</span>
                </button>
              </div>

              {/* Scale Zoom Controls */}
              {activeViewMode === 'card' && (
                <div className="flex items-center space-x-1 text-slate-500 text-xs px-2">
                  <button
                    onClick={() => setCardScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                    className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    title="Perkecil"
                    aria-label="Perkecil tampilan kartu"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono text-[11px] text-slate-700 font-medium">
                    {Math.round(cardScale * 100)}%
                  </span>
                  <button
                    onClick={() => setCardScale((s) => Math.min(1.2, Number((s + 0.1).toFixed(2))))}
                    className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    title="Perbesar"
                    aria-label="Perbesar tampilan kartu"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCardScale(1)}
                    className="ml-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    aria-label="Setel ulang zoom ke 100%"
                  >
                    100%
                  </button>
                </div>
              )}
            </div>

            {/* Stage Canvas Area */}
            <div
              ref={containerRef}
              className="bg-radial from-slate-100 to-slate-200/80 border border-slate-200/90 rounded-3xl p-3 sm:p-8 min-h-[220px] sm:min-h-[360px] lg:min-h-[460px] max-h-[38vh] sm:max-h-[46vh] lg:max-h-[calc(100vh-160px)] flex items-center justify-center overflow-auto relative shadow-inner"
            >
              {activeViewMode === 'card' ? (
                <div className="relative flex items-center justify-center w-full py-2 sm:py-4 overflow-x-auto">
                  {/* The exact rendered business card */}
                  <div
                    style={{
                      width: 700 * cardScale,
                      height: 400 * cardScale,
                    }}
                    className="relative flex items-center justify-center transition-all duration-150"
                  >
                    <BusinessCard
                      ref={cardRef}
                      data={cardData}
                      scale={cardScale}
                      className="absolute"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full py-2">
                  <WhatsAppChatPreview cardData={cardData} />
                </div>
              )}
            </div>
          </div>
          {/* /Preview Stage (sticky) */}

          {/* Actions + Guide: di mobile tampil setelah editor; di desktop di kolom kiri baris ke-2 */}
          <div className="w-full order-3 lg:order-none lg:col-span-7 space-y-4">
            {/* Action Bar Below Canvas */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Button 1: Send WhatsApp */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95 group"
              >
                <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span>Kirim ke WA</span>
              </button>

              {/* Button 2: Copy Image for WA Paste */}
              <button
                onClick={handleCopyImage}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-2xs transition-all active:scale-95 group"
              >
                {copiedImage ? (
                  <>
                    <Check className="w-5 h-5 mb-1 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mb-1 text-slate-600 group-hover:scale-110 transition-transform" />
                    <span>Salin Gambar</span>
                  </>
                )}
              </button>

              {/* Button 3: Download PDF */}
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 text-slate-800 font-semibold text-xs shadow-2xs transition-all active:scale-95 group"
              >
                <FileText className="w-5 h-5 mb-1 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Unduh PDF</span>
              </button>

              {/* Button 4: Download HD PNG */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-2xs transition-all active:scale-95 group"
              >
                <Download className="w-5 h-5 mb-1 text-slate-600 group-hover:scale-110 transition-transform" />
                <span>Unduh PNG</span>
              </button>

              {/* Button 5: Download vCard */}
              <button
                onClick={() => downloadVCard(cardData)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-2xs transition-all active:scale-95 group col-span-2 sm:col-span-1"
              >
                <FileDown className="w-5 h-5 mb-1 text-slate-600 group-hover:scale-110 transition-transform" />
                <span>Unduh .vcf</span>
              </button>
            </div>

            {/* Helpful WhatsApp Delivery Guide Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-emerald-950">
                  Fungsi Interaktif & Pengiriman ke WhatsApp:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-800/90 text-[11.5px]">
                  <li>
                    <strong>Tap Alamat:</strong> Langsung membuka rute di <strong>Google Maps</strong> (<span className="font-mono text-[10.5px]">share.google/yPSSdvbZ4LVIhJmqw</span>).
                  </li>
                  <li>
                    <strong>Tap Email:</strong> Langsung membuka aplikasi email untuk mengirim pesan ke <strong>{cardData.email}</strong>.
                  </li>
                  <li>
                    <strong>Tap Kontak:</strong> Langsung membuka obrolan <strong>WhatsApp / Telepon</strong> ({cardData.phone}).
                  </li>
                  <li>
                    <strong>Tap Website:</strong> Langsung membuka situs resmi <strong>{cardData.website}</strong>.
                  </li>
                  <li>
                    <strong>QR Code Otomatis:</strong> Dihasilkan otomatis dari nomor telepon/WA Anda untuk scan langsung ke chat WhatsApp.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Editor Panel (5 Cols on desktop). Di mobile: order-2 (setelah stage, sebelum actions). */}
          <div className="w-full order-2 lg:order-none lg:col-span-5 space-y-4 lg:sticky lg:top-20 lg:self-start">
            {currentUser ? (
              <CardEditor
                data={cardData}
                onChange={setCardData}
                onReset={handleReset}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Edit Data Kartu Nama</h2>
                <p className="text-sm text-slate-500 mt-1.5 max-w-xs">
                  Masuk terlebih dahulu untuk mengedit informasi, logo, dan desain kartu nama digital Anda.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Edit Kartu Nama</span>
                </button>
                <p className="text-xs text-slate-400 mt-4">
                  Belum punya akun?{' '}
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    Daftar Akun
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* WhatsApp Share & Direct Message Modal */}
      <WhatsAppShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cardData={cardData}
        cardElementRef={cardRef}
      />

      {/* User Management Modal (khusus admin) */}
      {isAdmin && (
        <UserManagementModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

      {/* Login / Daftar Akun Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
