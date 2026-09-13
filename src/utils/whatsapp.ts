import { BusinessCardData } from '../types';
import { DEFAULT_MAPS_URL } from './constants';
import { sanitizeAbsoluteUrl, sanitizeWebsiteUrl } from './url';
import { generateVCardString } from './vcard';

/**
 * Normalizes phone number into international WhatsApp format (e.g. 0898... -> 62898...)
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  // Remove non-digit characters
  const cleanNumber = phone.replace(/[^0-9]/g, '');

  if (!cleanNumber) return '';

  // If starts with '08', replace leading '0' with '62'
  if (cleanNumber.startsWith('0')) {
    return '62' + cleanNumber.slice(1);
  }

  // If starts with '62', keep it
  if (cleanNumber.startsWith('62')) {
    return cleanNumber;
  }

  // If starts with '8', add '62'
  if (cleanNumber.startsWith('8')) {
    return '62' + cleanNumber;
  }

  return cleanNumber;
}

/**
 * Kumpulan tautan turunan dari data kartu, dinormalkan & aman.
 * Sumber tunggal kebenaran yang dipakai di seluruh komponen.
 */
export interface CardLinks {
  /** Nomor WA dalam format internasional (bisa kosong bila phone kosong). */
  waNumber: string;
  /** Link chat WhatsApp bila nomor ada, jika tidak fallback ke tel: atau kosong. */
  waUrl: string;
  /** Link Google Maps aman (fallback ke default bila kosong/berbahaya). */
  mapsUrl: string;
  /** URL website http(s) aman (kosong bila tidak valid). */
  websiteUrl: string;
  /** mailto: bila email ada, jika tidak kosong. */
  mailUrl: string;
  /** Apakah nomor telepon tersedia. */
  hasPhone: boolean;
}

/**
 * Menghitung seluruh tautan turunan kartu satu kali agar konsisten
 * di BusinessCard, WhatsAppChatPreview, dsb.
 */
export function getCardLinks(cardData: BusinessCardData): CardLinks {
  const waNumber = formatPhoneNumberForWhatsApp(cardData.phone);
  const hasPhone = waNumber.length > 0;

  const waUrl = hasPhone
    ? `https://wa.me/${waNumber}`
    : cardData.phone.trim()
      ? `tel:${cardData.phone.replace(/[^0-9+]/g, '')}`
      : '';

  return {
    waNumber,
    waUrl,
    mapsUrl: sanitizeAbsoluteUrl(cardData.mapsUrl, DEFAULT_MAPS_URL),
    websiteUrl: sanitizeWebsiteUrl(cardData.website),
    mailUrl: cardData.email.trim() ? `mailto:${cardData.email.trim()}` : '',
    hasPhone,
  };
}

/**
 * Formats a WhatsApp message containing the business card text information
 */
export function generateWhatsAppMessage(cardData: BusinessCardData): string {
  const links = getCardLinks(cardData);
  const waDirectLink = links.hasPhone ? `https://wa.me/${links.waNumber}` : '';

  return `*KARTU NAMA DIGITAL*
${cardData.waGreeting ? cardData.waGreeting + '\n' : ''}
👤 *${cardData.fullName}*
💼 ${cardData.jobTitle}
🏢 *${cardData.companyName}*

📍 *Alamat:*
${cardData.address}
🗺️ *Google Maps:* ${links.mapsUrl}

📞 *No. Telepon / WA:* ${cardData.phone}
✉️ *Email:* ${cardData.email}
🌐 *Website:* ${links.websiteUrl || cardData.website}
${waDirectLink ? `\n📲 *Simpan Kontak / Chat WA:* ${waDirectLink}` : ''}

_Dikirim via Kartu Nama Digital RS Hermina Arcamanik_`;
}

/**
 * Builds direct WhatsApp URL with optional target phone and encoded message
 */
export function createWhatsAppUrl(cardData: BusinessCardData, targetPhone?: string): string {
  const message = generateWhatsAppMessage(cardData);
  const encodedText = encodeURIComponent(message);

  if (targetPhone && targetPhone.trim().length > 0) {
    const formattedTarget = formatPhoneNumberForWhatsApp(targetPhone);
    return `https://wa.me/${formattedTarget}?text=${encodedText}`;
  }

  // Generic share link (opens WhatsApp chat selector)
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Generates the QR code payload content
 */
export function getQrCodeValue(cardData: BusinessCardData): string {
  const links = getCardLinks(cardData);

  switch (cardData.qrTargetType) {
    case 'whatsapp': {
      if (!links.hasPhone) {
        // Tanpa nomor, arahkan QR ke website bila ada agar tetap berguna.
        return links.websiteUrl || DEFAULT_MAPS_URL;
      }
      const greeting = encodeURIComponent(
        `Halo ${cardData.fullName}, saya menghubungi Anda melalui kartu nama digital.`
      );
      return `https://wa.me/${links.waNumber}?text=${greeting}`;
    }
    case 'vcard':
      // Reuse generator vCard yang sudah di-escape & memakai CRLF.
      return generateVCardString(cardData);
    case 'website':
      return links.websiteUrl || DEFAULT_MAPS_URL;
    case 'custom':
      return (
        sanitizeAbsoluteUrl(cardData.customQrUrl || '') ||
        (links.hasPhone ? `https://wa.me/${links.waNumber}` : links.websiteUrl || DEFAULT_MAPS_URL)
      );
    default:
      return links.hasPhone ? `https://wa.me/${links.waNumber}` : links.websiteUrl || DEFAULT_MAPS_URL;
  }
}
