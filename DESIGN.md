# Design reference — hasil ekstraksi dari Framer

Sumber: editor Framer (nama style, struktur) + CSS/JS situs publik (nilai persis). Diekstrak 2026-09-30.
Screenshot pembanding ada di `reference/` (7 halaman × desktop 1440 / tablet 810 / phone 390).

## Breakpoint

| Nama | Rentang | Media query |
|---|---|---|
| Desktop (primary) | ≥ 1200px | default |
| Tablet | 810–1199px | `(min-width: 810px) and (max-width: 1199px)` |
| Phone | ≤ 809px | `(max-width: 809px)` |

## Warna

| Style Framer | Hex | Catatan |
|---|---|---|
| Neutral/01 | `#ffffff` | |
| Neutral/02 | `#f9f9f9` | |
| Neutral/03 | `#f0f0f0` | |
| Neutral/04 | `#e8e8e8` | |
| Neutral/05 | `#cecece` | |
| Neutral/06 | `#bbbbbb` | |
| Neutral/07 | `#646464` | warna teks body |
| Neutral/08 | `#202020` | warna teks heading |
| Primary/01 | `#fffcf5` | latar halaman |
| Primary/02 | `#fff4d6` | |
| Primary/03 | `#ffdb73` | |
| Primary/04 | `#431505` | |
| Accent/Grey Blue/01–03 | `#dce9ef` `#96bccf` `#203946` | |
| Accent/Blue/01–03 | `#cce0ff` `#66a2ff` `#002359` | |
| Accent/Purple/01–03 | `#f6d5e4` `#e382af` `#621639` | |
| Accent/Orange/01–02 | `#ffe629` `#473b1f` | |
| Neutral/Opacity (2 item) | `#20202033` `#ffffffcc` | nama persis belum dibuka; overlay hero pakai `#20202033` |

## Tipografi

Semua style: `text-transform: none`, `text-decoration: none`. Tablet = desktop kecuali disebut.

| Style Framer | Font | Weight | Desktop | Phone | Line-height | Letter-spacing | Warna | Paragraph spacing |
|---|---|---|---|---|---|---|---|---|
| H1 / H1b (Lora) | Lora | 400 | 68px | 48px | 1.1 (phone 1.0) | -0.04em | Neutral/08 | 0 |
| H1 / H1b (Manrope) | Manrope | 500 | 68px | 44px | 1.1 | -0.04em | Neutral/08 | 0 |
| H2 | Geist | 400 | 48px | 32px | 1.1 | -0.04em | Neutral/08 | 40px |
| H3 | Geist | 500 | 24px | 22px | 1.2 | -0.02em | Neutral/08 | 40px |
| Subtitle L | Lora | 400 | 24px | 22px | 1.2 | -0.02em | Neutral/08 | 20px |
| Subtitle M | Lora | 400 | 20px | 18px | 1.2 | -0.02em | Neutral/08 | 20px |
| Body L | Manrope | 400 | 18px | 16px | 1.4 | -0.02em | Neutral/07 | 20px |
| Body M | Manrope | 400 | 16px | 16px | 1.4 | -0.02em | Neutral/07 | 20px |
| Body M Strong | Manrope | 500 | 16px | 16px | 1.4 | -0.02em | Neutral/07 | 20px |
| Body S | Manrope | 400 | 14px | 14px | 1.4 | -0.02em | Neutral/07 | 20px |
| Body S Strong | Manrope | 500 | 14px | 14px | 1.4 | -0.02em | Neutral/07 | 20px |
| Body XS | Manrope | 400 | 12px | 12px | 1.4 | -0.02em | Neutral/07 | 20px |

Belum pasti: mana dari dua style 68px yang bernama "H1" dan mana "H1b". Tidak memengaruhi hasil.
Bold di semua style = weight 700. Font yang dipakai: Manrope 400/500/700, Lora 400 (+700, italic), Geist 400/500/700.

## Animasi & efek

| Efek | Nilai |
|---|---|
| Appear (load / masuk viewport) | dari `opacity: 0; translateY(20px)` (varian kecil: `6px`) ke `opacity: 1; translateY(0)` |
| Transisi appear | `0.6s cubic-bezier(.44, 0, .56, 1)`, delay bertingkat `0s / 0.2s / 0.4s`; ada varian `0.4s` |
| Transisi varian komponen (tab, tombol, kartu) | spring `stiffness 500, damping 60, mass 1`; tombol `damping 40`; varian lain spring `duration 0.4, bounce 0.2` |
| Smooth scroll | Lenis (komponen darkroom.engineering): `smooth: true`, `intensity: 12`, vertikal, tidak infinite; diabaikan di mobile |
| Cursor | bukan custom cursor — hanya `cursor: pointer` di elemen tertentu |
| Video hero | autoplay, loop, muted, playsinline, `object-fit: cover`; sumber `.mp4` (1,7 MB) + `.webm` (670 KB) |
| Overlay hero | `#20202033` menutupi seluruh video |
| Spinner form/work | conic-gradient berputar, loop linear 1s |

## Hero (home)

- Kontainer "Header": absolut, `left: 80px` (tablet `40px`, phone `20px`), `max-width: 700px`, gap `16px` (phone `20px`)
- Eyebrow: "Strategi brand. Komunikasi. Desain layanan digital" — Body S Strong, warna Neutral/04
- Judul: kata per kata sebagai elemen terpisah — "Ciptakan solusi desain yang berdampak dan" (Manrope 68, putih) + "bermakna" (Lora 68, Primary/03)
- Kartu video mengambang kanan-bawah dengan label "Diskusikan sekarang"

Di build baru: satu `<h1>` berisi `<span>` per kata (bukan 8 `<h1>`).

## Komponen di Framer

- **Project:** Building Block (Services Nav, Services Detail, …), Card (Team, Work, CTA, FAQ), Interactive, Section (FAQs, …), Message, Brand Logo
- **Pihak ketiga:** darkroom.engineering/Lenis, Framer (Video, Form), Framer University, Rosyid Qoim
- **Code:** `Workshop/NumberWaveTransition.tsx` — tidak dipakai di situs publik, tidak perlu dimigrasi
- **Halaman:** Home, /work (+ detail CMS), /about, /contact, /legal (2), /404

Ukuran, padding, dan varian per komponen diambil dari computed style situs publik saat tiap section dibangun (Fase 2–3).

## Aset

`src/assets/framer/` — 41 gambar + 2 video (nama file = ID Framer). Diganti nama seperlunya saat dipakai.
