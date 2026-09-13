// Library ekspor (html-to-image ~250 kB, jspdf ~350 kB) dimuat secara dinamis
// hanya saat pengguna benar-benar mengekspor, sehingga tidak membebani bundel awal.
const loadHtmlToImage = () => import('html-to-image');
const loadJsPdf = () => import('jspdf');

const COMMON_EXPORT_OPTIONS = {
  skipFonts: true,
  cacheBust: true,
  // Filter out any elements with data-no-export attribute if needed
  filter: (node: HTMLElement) => {
    return !node.classList?.contains('no-export');
  },
};

/**
 * Exports DOM node as high resolution PDF file (Standard Business Card size 90mm x 51.4mm)
 */
export async function downloadCardPdf(
  element: HTMLElement,
  fileName: string = 'Kartu-Nama-Hermina.pdf'
): Promise<void> {
  try {
    const [{ toPng }, { jsPDF }] = await Promise.all([loadHtmlToImage(), loadJsPdf()]);

    // Render at 3x pixel ratio for print-ready crisp resolution
    const dataUrl = await toPng(element, {
      ...COMMON_EXPORT_OPTIONS,
      quality: 0.98,
      pixelRatio: 3,
    });

    // Business card standard dimensions: 90mm width, 51.4mm height (matching 700:400 aspect ratio)
    const cardWidthMm = 90;
    const cardHeightMm = (cardWidthMm * 400) / 700; // 51.43mm

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidthMm, cardHeightMm],
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to export card as PDF:', error);
    throw error;
  }
}

/**
 * Exports DOM node as high resolution PNG file
 */
export async function downloadCardImage(
  element: HTMLElement,
  fileName: string = 'Kartu-Nama-Hermina.png',
  pixelRatio: number = 2
): Promise<void> {
  try {
    const { toPng } = await loadHtmlToImage();
    const dataUrl = await toPng(element, {
      ...COMMON_EXPORT_OPTIONS,
      quality: 0.98,
      pixelRatio,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export card image:', error);
    throw error;
  }
}

/**
 * Copies the card image directly to user's system clipboard (Ctrl+V into WhatsApp Web / Desktop)
 */
export async function copyCardImageToClipboard(
  element: HTMLElement,
  pixelRatio: number = 2
): Promise<boolean> {
  try {
    const { toBlob } = await loadHtmlToImage();
    const blob = await toBlob(element, {
      ...COMMON_EXPORT_OPTIONS,
      quality: 0.95,
      pixelRatio,
    });

    if (!blob) {
      throw new Error('Could not create image blob');
    }

    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    } else {
      throw new Error('Clipboard API not fully supported on this device');
    }
  } catch (error) {
    console.error('Failed to copy card image to clipboard:', error);
    return false;
  }
}

/**
 * Native Web Share API to share image file directly to WhatsApp if supported (Mobile)
 */
export async function shareCardImageNatively(
  element: HTMLElement,
  title: string,
  text: string
): Promise<boolean> {
  try {
    if (!navigator.canShare) return false;

    const { toBlob } = await loadHtmlToImage();
    const blob = await toBlob(element, {
      ...COMMON_EXPORT_OPTIONS,
      quality: 0.95,
      pixelRatio: 2,
    });

    if (!blob) return false;

    const file = new File([blob], 'Kartu-Nama-Digital.png', { type: 'image/png' });
    const shareData = {
      title,
      text,
      files: [file],
    };

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    }
    return false;
  } catch (error) {
    // User might have canceled the share sheet
    console.warn('Native share cancelled or not available:', error);
    return false;
  }
}
