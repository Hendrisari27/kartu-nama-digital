# Kartu Nama Digital WhatsApp

Aplikasi web untuk membuat kartu nama digital profesional dengan desain elegan
RS Hermina Arcamanik, lengkap dengan QR code, tautan interaktif, dan berbagai
cara berbagi langsung ke WhatsApp.

Dibangun dengan **React 19 + Vite + Tailwind CSS v4**. Sepenuhnya berjalan di
sisi klien (frontend) — tidak ada server, backend, atau API key yang diperlukan.

## Fitur

- **Editor langsung**: ubah nama, jabatan, perusahaan, alamat, kontak, dan
  website; pratinjau kartu diperbarui secara real-time.
- **QR code dinamis**: arahkan ke chat WhatsApp, simpan kontak (vCard),
  website, atau tautan kustom.
- **Tautan interaktif** pada kartu: alamat membuka Google Maps, email membuka
  aplikasi email, nomor membuka WhatsApp/telepon, website membuka situs.
- **Kustomisasi desain**: beberapa preset latar belakang, warna dasar, logo
  (bawaan Hermina atau unggah sendiri), ukuran & posisi logo, serta opacity pola.
- **Ekspor & berbagi**: unduh PNG HD, PDF ukuran cetak (90×51,4 mm), file
  kontak `.vcf`, salin gambar ke clipboard, kirim langsung ke nomor WhatsApp,
  atau bagikan lewat share sheet perangkat.
- **Simulasi WhatsApp Chat**: pratinjau tampilan kartu saat dikirim di WhatsApp.

## Prasyarat

- [Node.js](https://nodejs.org/) 18+ dan npm

## Menjalankan Secara Lokal

1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi berjalan di `http://localhost:3000`.

## Skrip yang Tersedia

| Skrip             | Fungsi                                             |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Menjalankan server pengembangan Vite (port 3000)   |
| `npm run build`   | Membangun aplikasi untuk produksi ke folder `dist` |
| `npm run preview` | Meninjau hasil build produksi secara lokal         |
| `npm run lint`    | Pengecekan tipe TypeScript (`tsc --noEmit`)        |
| `npm run clean`   | Menghapus folder `dist`                            |

## Struktur Proyek

```
src/
├── App.tsx                 # Tata letak & state utama aplikasi
├── main.tsx                # Entry point React + ToastProvider
├── types.ts                # Tipe data kartu & nilai default
├── components/             # Komponen UI (kartu, editor, modal, dll.)
└── utils/                  # Helper vCard, WhatsApp, URL, ekspor gambar
```
