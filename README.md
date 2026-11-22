# Vertical 9:16 2D Kinetic Typography & Audio-Synced Motion Graphics (Remotion)

Project video kinetic typography vertikal (`1080×1920`, `30 FPS`, `1147 frames` / `38.23 detik`) murni 2D (SVG, CSS) yang disinkronkan dengan lagu (`public/audio.mp3`) dan menampilkan karakter (`public/character.jpg`) di bagian klimaks.

## Struktur Project

- `src/config.ts` — Pusat konfigurasi: palet warna, font (`Bebas Neue`, `Inter`, `JetBrains Mono`), timing 10 scene dalam detik, daftar beat, dan seluruh teks/lirik.
- `src/Root.tsx` — Definisi composition `Main` (`1080×1920`, `30 FPS`, `1147 frames`).
- `src/Video.tsx` — Komposisi utama yang mengatur `<Audio/>`, `<Sequence/>` untuk `Scene01`–`Scene10`, global dolly zoom (`1.0 -> 1.06`), beat shake deterministik, dan overlay `<Grain/>`.
- `src/components/` — Komponen modular:
  - `Glow.tsx` — Multi-layered drop-shadow/text-shadow & chromatic aberration tipis.
  - `Grain.tsx` — Film grain deterministik (`@remotion/noise`), scanlines halus, dan vignette.
  - `HUD.tsx` — Garis wireframe tipis, kotak sudut dengan margin aman `80px`, dan indikator waktu/beat.
  - `KineticText.tsx` — Animasi teks masuk per kata dengan `spring()` overshoot kecil + blur-to-sharp 4 frame + highlight kata kunci.
  - `Waveform.tsx` — Visualisasi spektrum audio menggunakan `useAudioData` & `visualizeAudio` (`@remotion/media-utils`) dengan fallback deterministik.
- `src/scenes/Scene01.tsx` ... `Scene10.tsx` — Implementasi visual 10 scene.

## Cara Mengganti Teks, Warna, Timing, Beat, Audio, dan Gambar

1. **Mengganti Teks & Lirik:**
   Buka `src/config.ts` dan ubah objek `TEXT_CONTENT`. Untuk lirik di bagian karakter (24.4–38.2 detik), ubah array `TEXT_CONTENT.scene10.lyrics` (`startSec`, `endSec`, `words`, dan `goldKeywords`).
2. **Mengganti Warna & Font:**
   Ubah objek `PALETTE` dan `FONTS` di `src/config.ts`.
3. **Mengganti Timing Scene:**
   Ubah `startSec` dan `endSec` (dalam detik) pada objek `SCENE_TIMINGS` di `src/config.ts`. Konversi ke frame dilakukan otomatis lewat `secToFrame()`.
4. **Mengganti Daftar Beat:**
   Ubah array `INITIAL_BEATS` atau interval `DENSE_BEATS` di `src/config.ts`.
5. **Mengganti Lagu atau Gambar Karakter:**
   Ganti file `public/audio.mp3` atau `public/character.jpg` dengan nama yang sama (atau sesuaikan `VIDEO_CONFIG.audioFile` dan `VIDEO_CONFIG.characterFile` di `src/config.ts`).

## Script NPM Lokal

```bash
npm ci
npm start        # Membuka Remotion Studio untuk preview
npm run still    # Merender 1 frame still ke out/still.png
npm run build    # Merender video lengkap ke out/video.mp4
```

## Cara Menjalankan Workflow Render di GitHub Actions

1. Pastikan `package-lock.json`, `public/audio.mp3`, dan `public/character.jpg` sudah ter-commit dan di-push ke GitHub.
2. Buka tab **Actions** di repository GitHub -> pilih workflow **Render Kinetic Typography Video** (`.github/workflows/render.yml`).
3. Klik **Run workflow** (`workflow_dispatch`).
4. Setelah selesai, unduh hasil video di bagian **Artifacts** (`main-video-mp4` dan `verification-stills`).
