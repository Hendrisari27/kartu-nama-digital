export type BackgroundStyleType =
  | 'hermina_geometric'
  | 'clean_minimalist'
  | 'emerald_hospital'
  | 'navy_executive'
  | 'modern_dots'
  | 'warm_gold'
  | 'custom_image';

export interface BusinessCardData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  address: string;
  mapsUrl: string;
  email: string;
  phone: string;
  website: string;
  qrTargetType: 'whatsapp' | 'vcard' | 'website' | 'custom';
  customQrUrl?: string;
  logoType: 'hermina' | 'custom';
  customLogoUrl?: string;
  logoSize?: number;
  logoAlign?: 'center' | 'left';
  bgStyle?: BackgroundStyleType;
  customBgUrl?: string;
  customBgColor?: string;
  bgOpacity?: number;
  waGreeting: string;
}

export const DEFAULT_CARD_DATA: BusinessCardData = {
  fullName: 'Isi Nama Anda',
  jobTitle: 'Jabatan Anda Sekarang',
  companyName: 'RS Hermina Arcamanik',
  address: 'Jl. AH. Nasution No.50, Kota Bandung, 40291',
  mapsUrl: 'https://share.google/yPSSdvbZ4LVIhJmqw',
  email: 'marketing.arcamanik@herminahospitals.com',
  phone: 'Nomor WhatsApp Aktif Anda',
  website: 'https://herminahospitals.com/id/branch/hermina-arcamanik',
  qrTargetType: 'whatsapp',
  customQrUrl: '',
  logoType: 'hermina',
  customLogoUrl: '',
  logoSize: 120,
  logoAlign: 'left',
  bgStyle: 'hermina_geometric',
  customBgUrl: '',
  customBgColor: '#ffffff',
  bgOpacity: 50,
  waGreeting: 'Halo, salam hangat! Berikut kartu nama digital saya:',
};
