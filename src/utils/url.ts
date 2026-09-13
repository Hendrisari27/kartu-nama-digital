/**
 * Utilitas validasi & sanitasi URL untuk mencegah skema berbahaya
 * (mis. javascript:, data: pada href tautan) masuk ke href/src.
 */

const SAFE_PROTOCOLS = ['http:', 'https:'];

/**
 * Mengembalikan true jika value adalah URL absolut dengan skema http/https.
 */
export function isSafeHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value.trim());
    return SAFE_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Menormalkan input website menjadi URL http(s) yang aman.
 * - Menambahkan https:// bila skema belum ada.
 * - Mengembalikan string kosong bila hasilnya bukan URL http(s) yang valid
 *   (mis. skema berbahaya seperti javascript:).
 */
export function sanitizeWebsiteUrl(value: string): string {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return isSafeHttpUrl(withScheme) ? withScheme : '';
}

/**
 * Menormalkan URL yang seharusnya sudah absolut (mis. link Maps, QR kustom).
 * Mengembalikan fallback bila value kosong atau bukan URL http(s) yang aman.
 */
export function sanitizeAbsoluteUrl(value: string, fallback = ''): string {
  const trimmed = (value || '').trim();
  if (!trimmed) return fallback;
  return isSafeHttpUrl(trimmed) ? trimmed : fallback;
}
