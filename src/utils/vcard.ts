import { BusinessCardData } from '../types';
import { sanitizeWebsiteUrl } from './url';

/**
 * Meng-escape nilai teks sesuai spesifikasi vCard 3.0 (RFC 2426):
 * backslash, koma, titik-koma, dan baris baru harus di-escape.
 */
function escapeVCardValue(value: string): string {
  return (value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Generates standard vCard 3.0 string
 */
export function generateVCardString(card: BusinessCardData): string {
  const fullName = escapeVCardValue(card.fullName);
  const website = sanitizeWebsiteUrl(card.website);

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `N:${fullName};;;;`,
    `ORG:${escapeVCardValue(card.companyName)}`,
    `TITLE:${escapeVCardValue(card.jobTitle)}`,
    `TEL;TYPE=CELL,VOICE:${escapeVCardValue(card.phone)}`,
    `EMAIL;TYPE=WORK,INTERNET:${escapeVCardValue(card.email)}`,
    `ADR;TYPE=WORK:;;${escapeVCardValue(card.address)};;;;`,
    `URL:${website}`,
    'NOTE:Kontak dari Kartu Nama Digital RS Hermina Arcamanik',
    'END:VCARD',
  ].join('\r\n');
}

/**
 * Initiates download of .vcf file
 */
export function downloadVCard(card: BusinessCardData): void {
  const vcard = generateVCardString(card);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedName = card.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `Kontak_${sanitizedName}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
