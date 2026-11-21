# KEAJAIBAN ALAM SEMESTA — Remotion Documentary Motion Graphics

Produksi video edukasi motion graphics profesional bertema **"KEAJAIBAN ALAM SEMESTA"** dengan gaya dokumenter alam sinematik, editorial tipografi kinetik, 2.5D parallax environment, dan animasi infografik ilmiah.

## Spesifikasi Teknis

- **Framework:** Remotion + React + TypeScript
- **Resolusi:** `1920 × 1080` (Full HD, 16:9)
- **Frame Rate:** `30 FPS`
- **Durasi:** `65 Detik` (`1.950 Frames`)
- **Animasi:** Deterministik & frame-accurate (`useCurrentFrame`, `interpolate`, `spring`, `Sequence`)

## Struktur Timeline & Komponen Scene

| Scene | Waktu | Frame | File Komponen | Konten Visual & Tipografi |
| :--- | :--- | :--- | :--- | :--- |
| **Scene 1 — Opening** | `0–7s` | `0–225` | `src/scenes/Scene1Opening.tsx` | Layar gelap, partikel kosmik bercahaya, kamera push-in menuju Bumi 2.5D, kinetic typography *"THE BEAUTY OF NATURE"*, *"ALAM"*, *"KEHIDUPAN YANG TAK TERBATAS"*. |
| **Scene 2 — Hutan** | `7–18s` | `210–555` | `src/scenes/Scene2Forest.tsx` | Hutan tropis 3 layer parallax, volumetric god rays, spora melayang, infografik pertukaran $O_2$ (+28.4%) & serapan $CO_2$ (-2.6 Gt), *"PARU-PARU BUMI"*. |
| **Scene 3 — Laut** | `18–30s` | `540–915` | `src/scenes/Scene3Ocean.tsx` | Underwater caustic rays, ikan bergerak 3 layer parallax, terumbu karang bergerak, garis penghubung telemetri & label informasi, *"LAUTAN"*. |
| **Scene 4 — Pegunungan** | `30–42s` | `900–1275` | `src/scenes/Scene4Mountains.tsx` | Pegunungan 2.5D dengan kabut & awan bergerak, kamera aerial drone movement, sungai gletser bercahaya, data visual siklus air hulu-hilir, *"SUMBER KEHIDUPAN"*. |
| **Scene 5 — Siklus Kehidupan** | `42–55s` | `1260–1665` | `src/scenes/Scene5Cycle.tsx` | Infografik animasi 5 fase: Penguapan Air, Pembentukan Awan, Turunnya Hujan, Aliran ke Sungai & Laut, dan Tumbuhan Menyerap Air. |
| **Scene 6 — Closing** | `55–65s` | `1650–1950` | `src/scenes/Scene6Closing.tsx` | Sintesis panorama hutan, laut, dan pegunungan di lengkung biosfer Bumi, kamera perlahan menjauh, tipografi epilog & cinematic fade-out. |

## Arsitektur Audio (`src/components/SoundscapeTrack.tsx`)

Mendukung sinkronisasi 5 kanal audio melalui `defaultProps.audioUrls`:
- `ambientMusicUrl` — Musik ambient sinematik sepanjang 65 detik (dengan envelope fade-in & fade-out).
- `forestAmbienceUrl` — Ambience hutan alami (Scene 2: 7–18 detik).
- `oceanAmbienceUrl` — Ambience bawah laut (Scene 3: 18–30 detik).
- `windAmbienceUrl` — Ambience angin pegunungan (Scene 4: 30–42 detik).
- `cinematicImpactUrl` — Efek impact sinematik tepat pada frame kemunculan setiap judul utama (`[38, 228, 558, 918, 1270, 1682]`).

## Animasi Poster GAMESDAPP (`PosterAnimation`)

Poster `public/images/poster.jpg` (736×920) dianimasikan menjadi video **1080×1350 (4:5)**, 30 FPS, 10 detik (300 frame), tanpa audio.

- **Entry point terpisah:** `src/poster/index.ts` → komposisi `PosterAnimation` di `src/poster/PosterAnimation.tsx`.
- **Cara kerja:** poster dipotong menjadi layer (header, 6 kartu layanan, 4 ikon keunggulan, tombol CTA, pil website) yang ditumpuk di posisi aslinya dengan tepi lembut. Layer masuk bertahap (spring), lalu melayang, berdenyut, dan berkilau dalam loop mulus. Ditambah cincin energi hijau di bawah controller, partikel hijau melayang, dan zoom kamera halus.
- **Preview lokal:** `npm run dev:poster`
- **Render lokal:** `npm run build:poster` (hasil: `out/poster.mp4`)
- **GitHub Actions:** workflow `.github/workflows/render-poster.yml` (otomatis saat `src/poster/**` atau `public/images/**` berubah, atau manual lewat **Run workflow**). Hasil: artifact `gamesdapp-poster-animation-mp4`.
- **Ganti poster:** timpa `public/images/poster.jpg` dengan gambar berukuran sama (736×920). Jika ukuran berbeda, sesuaikan konstanta `SRC_W`/`SRC_H` serta koordinat kotak di `PosterAnimation.tsx`.
