# Studio SriRona — Project Info

Migrasi website Studio SriRona dari Framer ke kode (Astro + Sanity).

- **Situs lama (sumber desain):** https://studiosrirona.framer.website
- **Klien:** Studio SriRona — studio desain kolektif, tim semuanya designer (non-tech)
- **Target:** tampilan dan interaksi 1:1 dengan versi Framer
- **Terakhir diperbarui:** 2026-09-30

## Keputusan

| Hal | Keputusan |
|---|---|
| Framework | Astro (statis) |
| CMS | Sanity — hanya untuk section "Karya"; halaman lain ditulis di kode |
| Hosting | Vercel |
| Package manager | pnpm |
| Alur publish | Publish di Sanity → webhook → build ulang di Vercel |

## Status

- [x] Analisis situs Framer
- [x] Scaffold project Astro
- [x] Unduh aset asli dari CDN Framer ke `src/assets/framer/` (41 file, 11 MB)
- [x] Akses ke project Framer (login `waluyajuang330@gmail.com`, punya hak edit — hanya dipakai untuk membaca, jangan Publish)

## Plan pengerjaan

Tiap fase selesai kalau ceknya lolos. Pembanding 1:1 = screenshot situs Framer vs hasil Astro di lebar 1440, 810, dan 390.

### Fase 1 — Ekstraksi desain dari Framer
- [x] Text styles (Heading, Subtitle, Body): font, ukuran, line-height, letter-spacing per breakpoint
- [x] Color styles (Neutral, Primary, Accent) → nama token
- [x] Komponen + varian: Building Block, Card, Interactive, Section, Message, Brand Logo
- [x] Efek: parameter animasi appear, hover, kata berganti hero, tab Layanan, custom cursor, setting Lenis
- [x] Isi folder Code "Workshop"
- [x] Screenshot referensi semua halaman di 3 breakpoint → `reference/`
- **Cek:** semua nilai tercatat di `DESIGN.md`; tidak ada yang diubah di Framer

### Fase 2 — Fondasi
- [x] Token CSS (warna, tipografi, spacing, breakpoint) di satu file global
- [x] Font self-hosted: Manrope, Lora, Geist
- [x] Layout dasar + SEO head (`lang="id"`, title/description per halaman)
- [x] Navbar (fixed + hamburger mobile), Footer, Button, Label
- [x] Efek global: smooth scroll (Lenis), animasi appear
- **Cek:** navbar + footer cocok dengan referensi di 3 breakpoint

Styling pakai CSS biasa (scoped style Astro), tanpa Tailwind/framework UI.

### Fase 3 — Halaman statis
- [x] Home: Hero → Intro → Prinsip Desain → Layanan → Team → CTA
- [x] About
- [x] Contact: tampilan form + FAQ (form belum terhubung — Fase 5)
- [x] Legal: privacy policy, terms of service
- [x] 404
- [x] Bonus: /work dan /work/[slug] (data karya lokal di `src/data/works.json`, dipindah ke Sanity di Fase 4)
- **Cek:** tiap halaman cocok dengan referensi di 3 breakpoint; satu `<h1>` per halaman

Hasil banding (Playwright, selisih piksel vs Framer): mayoritas halaman/breakpoint < 1%; Home 4–6% (frame video hero berbeda tiap load); tinggi halaman pas atau ±3px.

### Fase 4 — Karya + Sanity
Project Sanity: **SriRona**, ID `48dbdtpq`, dataset `production` (publik untuk baca), `studiosrirona@gmail.com` sudah diundang sebagai Administrator. Situs: https://srirona.vercel.app
- [x] Skema "Karya" (`studio/schemaTypes/work.ts`), Studio (`sanity.config.ts`, host `srirona.sanity.studio`)
- [x] Situs membaca karya dari Sanity saat build (`src/data/works.ts`); `/work`, `/work/[slug]` dan "Explore more" dari data CMS
- [x] Data 6 karya + gambar disiapkan untuk impor (`studio/seed/`), konversi teks diuji tanpa selisih
- [x] Impor 6 karya ke Sanity (terverifikasi di dataset dan di situs produksi)
- [x] Deploy Studio → https://srirona.sanity.studio
- [ ] Undang tim studio sebagai Editor
- [x] Webhook Sanity → Vercel dibuat (uji end-to-end: Publish sebuah perubahan lalu pastikan deployment baru muncul)
- **Cek:** ubah karya di Studio → Publish → situs produksi berubah dalam 1–2 menit

Perintah (dari root project):

```bash
pnpm sanity login                  # sekali, masuk dengan akun Sanity
pnpm seed                          # buat studio/seed/works.ndjson
pnpm sanity dataset import studio/seed/works.ndjson production --replace
pnpm studio                        # Studio lokal di http://localhost:3333
pnpm studio:deploy                 # publikasi Studio ke srirona.sanity.studio
```

Sebelum push ke Vercel, impor dulu: situs tidak lagi membaca karya dari file, jadi tanpa data di Sanity halaman `/work` kosong.

Webhook rebuild: Vercel → Settings → Git → **Deploy Hooks** → buat hook (branch `main`) → salin URL. Sanity (sanity.io/manage → API → **Webhooks**) → Create: URL = URL hook tadi, dataset `production`, trigger Create/Update/Delete, filter `_type == "work"`, method POST, projection kosong.

### Fase 5 — Form kontak
Pakai Web3Forms (gratis, 250 kiriman/bulan, langsung ke email studio).
- [x] Form dikirim lewat JS: validasi bawaan browser, status "Sending…", pesan sukses, pesan gagal (isian tetap ada, ada link email cadangan), honeypot anti-spam. Diuji dengan request yang dicegat (sukses, gagal, key kosong, honeypot).
- [x] Access key Web3Forms diisi di `src/consts.ts` (`WEB3FORMS_KEY`, publik by design). Kiriman masuk ke email yang dipakai saat membuat key.
- [ ] Uji kirim sungguhan sekali dari situs produksi, pastikan email masuk (cek juga folder spam)
- **Cek:** kirim form uji → pesan sampai ke email studio

### Fase 6 — QA
- [ ] Bandingkan semua halaman vs referensi di 3 breakpoint, perbaiki selisih
- [ ] Cek interaksi: hover, tab, menu mobile, animasi
- [ ] Aksesibilitas dasar (keyboard, alt, kontras, `prefers-reduced-motion`)
- [ ] Performa: gambar teroptimasi, Lighthouse
- **Cek:** `pnpm build` bersih; tidak ada selisih visual yang belum disetujui

### Fase 7 — Deploy + serah terima
Butuh: repo GitHub, akun Vercel, domain.
- [ ] Deploy ke Vercel
- [ ] Webhook Sanity → build ulang Vercel
- [ ] Domain + redirect (kalau slug karya diganti)
- [ ] Panduan singkat untuk tim studio: cara tambah/ubah karya
- **Cek:** publish di Sanity → tayang di situs produksi tanpa developer

## Dua bahasa (ID / EN)

- Indonesia di root (`/work`), Inggris di `/en` (`/en/work`). Tombol ID/EN di navbar membuka halaman yang sama dalam bahasa lain; `hreflang` + `<html lang>` ikut.
- Halaman EN di `src/pages/en/` hanya membungkus halaman ID yang sama; teks dipilih lewat `t('teks ID', 'English text')` dari `src/i18n.ts`. Ubah copy = ubah kedua teks di tempat yang sama.
- Teks panjang: `faqs.en.json`, `textEn`/`titleEn` di `principles.ts`, `bioEn` di `team.ts`.
- Karya (Sanity): field opsional **Ringkasan (English)** dan **Isi (Overview, English)**. Kosong = versi EN memakai teks Indonesia. Terjemahan awal 6 karya di `studio/seed/works.en.json`; isi ke Sanity dengan `pnpm sanity exec studio/seed/patch-en.mjs --with-user-token` (hanya mengisi field yang masih kosong). Setelah skema berubah, deploy ulang Studio (`pnpm studio:deploy`) agar field barunya muncul.
- Yang sengaja tidak diterjemahkan: Privacy/Terms (sudah bahasa Inggris, template Framer), 404, label form kontak (sudah bahasa Inggris), label yang memang bahasa Inggris di Framer (nama layanan, tag, footer).
- "Diskusikan sekarang" → "Let's talk".

## Belum diputuskan

- Domain (sekarang masih `*.framer.website`)
- Slug karya: tetap pakai nama orang (`/work/saski`) atau ganti ke nama proyek (butuh redirect)

## Responsive HP (dicek 2026-09-30)

Dibandingkan dengan Framer di 390, 430, 600, 767px (292 teks: lebar, posisi, ukuran font, bobot, warna): tipografi identik; selisih tinggal beberapa kasus struktur elemen.
- Copy berbeda per breakpoint di Framer, sudah diikuti: hero About di HP "…dalam alur kerjamu." (desktop/tablet "…yang intuitif."), paragrafnya 14px di HP; tag layanan tablet/HP ("Branding design", "UX Writing / Content Writing / Copywriitng" tanpa "+more") beda dari desktop.
- Framer mengunci beberapa kolom di HP pada ±350px terpusat (Intro, Prinsip Desain, teks Team, paragraf hero About). Lebarnya diikuti; **pita latar Intro/Prinsip tetap penuh lebar** karena di Framer pitanya ikut terkunci 390px (muncul margin di HP ≥ 430px, tampak seperti bug). Di HP < 390px kolom dibatasi lebar layar (di Framer teksnya melebihi layar).
- Nama anggota tim di About: di Framer warnanya transparan permanen (hanya jabatan yang tampak). Di sini nama ditampilkan.

## Temuan konten (butuh keputusan klien)

- **Link Live Preview sudah diganti** dengan link asli dari dokumen klien (Formulatrix, Torico, KitaLulus → Behance/Framer; Tokopedia Official Store → file Google Drive; Grief → Framer). Tokopedia S.O.S Promo sengaja tanpa link, jadi tombolnya tidak tampil. Link Google Drive harus disetel "siapa saja dengan link" agar bisa dibuka pengunjung.
- **Privacy Policy sudah ditulis ulang untuk SriRona** (ID + EN, 1 Oktober 2026): data dari form kontak, tanpa analitik/cookie, pihak ketiga Web3Forms/Gmail/Vercel, hak sesuai UU PDP No. 27/2022. Draf dari developer, **minta klien membaca dan menyetujui** (bukan nasihat hukum). Kalau nanti pasang analitik, bagian "tanpa analitik/cookie" harus diubah.
- **Terms of Service masih template Framer** — isinya bahkan teks Privacy Policy "Pulma", bukan syarat layanan. Belum ditautkan dari mana pun; perlu teks dari klien.
- Form kontak: label sekarang ikut bahasa halaman (ID: Nama/Pesan/Kirim), Phone ditandai "(opsional)", di bawah tombol ada "biasanya membalas dalam 1–2 hari kerja" (**konfirmasi angka ini ke klien**) + persetujuan Kebijakan Privasi, di bawah kartu ada link email.
- Halaman 404 masih berbahasa Inggris ("This page isn’t here."). Tombol "Back to Home" di Framer mengarah ke WhatsApp; di sini diarahkan ke `/`.
- **Tokopedia Official Store x PVRA x AVA x Kami tidak punya gambar galeri** (di Framer juga kosong; Framer tetap menyisakan jarak 200px kosong, di sini jarak itu dihilangkan). Tambahkan gambarnya lewat Studio kalau ada.
- Link Behance (Torico, KitaLulus) menolak pengecekan otomatis (403 untuk bot); buka manual di browser untuk memastikan.
- Tanggal karya ganjil ("Dec 1, 2019", "Jan 1, 2019"…), tampaknya placeholder.
- Typo di konten: "Copywriitng", "CMS intergration", "eksekusi konsiten".

## Struktur situs

| URL | Isi |
|---|---|
| `/` | Hero video + kata berganti, Prinsip Desain, Layanan (4 tab), Team (3 kartu), CTA |
| `/work` | Grid karya |
| `/work/[slug]` | Detail karya (dari CMS) |
| `/about` | Intro, Prinsip Desain, tim |
| `/contact` | Form: Name, Email, Phone (opsional), Message |
| `/legal/privacy-policy`, `/legal/terms-of-service` | Teks |
| `/404` | Halaman tidak ditemukan |

### Karya (6 item)

| Slug | Judul | Ringkasan | Live Preview |
|---|---|---|---|
| `saski` | Laboratory Automation · Formulatrix | ada | ada |
| `tasya` | Torico | ada | ada |
| `kita-bertiga` | AI Headhunter Pages · KitaLulus | ada | ada |
| `nesti` | Tokopedia S.O.S Promo | tidak | tidak |
| `nesti-2` | Tokopedia Official Store x PVRA x AVA x Kami | tidak | ada |
| `saski-2` | Grief · Liveful | ada | ada |

Semua 6 karya tampil di `/work` (Framer memuat 2 terakhir belakangan lewat scroll, bukan menyembunyikannya). Tidak perlu toggle "tampil".

Field CMS: judul, slug, urutan (angka), gambar utama, ringkasan (opsional), penulis/tim, tanggal, link Live Preview (opsional), isi Overview (paragraf, tebal, miring, link), galeri gambar. Slug lama dipertahankan (`saski`, `tasya`, …) sehingga URL tidak berubah. "Explore more" = dua karya pertama selain karya yang sedang dibuka.

## Design system

Detail lengkap (nama style Framer, nilai per breakpoint, parameter animasi): lihat `DESIGN.md`.

- **Font:** Manrope (400/500/700, dominan), Lora (400, heading serif), Geist (400/700)
- **Breakpoint:** desktop ≥1200px, tablet 810–1199px, phone ≤809px
- **Warna utama:** latar `#fffcf5`, teks `#202020`
- **Aksen:** kuning `#ffdb73` `#fff4d6` `#ffe629` · pink `#e382af` `#f6d5e4` `#621639` · biru `#66a2ff` `#cce0ff` `#002359` `#203946` `#96bccf` `#dce9ef` · cokelat `#431505` `#473b1f`
- **Netral:** `#fff` `#f9f9f9` `#f0f0f0` `#e8e8e8` `#cecece` `#bbb` `#646464`

## Interaksi yang harus direplikasi

- Animasi muncul saat load/scroll
- Smooth scroll (Lenis)
- Kata berganti di hero
- Tab Layanan (4 state, gambar berganti)
- Navbar fixed + menu hamburger di mobile

## Kontak & tautan

- CTA "Diskusikan sekarang": `mailto:studiosrirona@gmail.com?subject=Project%20Inquiry` (membuka aplikasi email dengan penerima dan subjek terisi; sebelumnya WhatsApp `wa.me/6282141519450`)
- Email: studiosrirona@gmail.com (subject: Project Inquiry)
- LinkedIn: https://www.linkedin.com/in/studio-srirona-093390436/
- Instagram: https://www.instagram.com/studiosrirona/

## Perbaikan yang ikut dikerjakan

- `lang="en"` → `id`
- Title dan meta description unik per halaman
- Satu `<h1>` per halaman (home sekarang punya 8)
- Typo konten: "Copywriitng", "intergration", "konsiten" (konfirmasi ke klien dulu)
- Placeholder form masih bahasa Inggris (konfirmasi ke klien dulu)

## Perintah

Jangan biarkan `astro dev` menyala di background: hanya satu dev server per project, `pnpm dev` milik developer jadi tidak jalan. Untuk pengecekan otomatis pakai `pnpm build` lalu `pnpm astro preview --port 4323`.

```bash
pnpm dev      # dev server
pnpm build    # build produksi
pnpm preview  # preview hasil build
```
