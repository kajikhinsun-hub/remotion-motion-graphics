# Remotion Motion Graphics + GitHub Actions

Project starter untuk membuat video motion graphics berbasis kode (React & TypeScript) menggunakan **Remotion** dan merendernya menjadi file `.mp4` secara otomatis di cloud menggunakan **GitHub Actions** (tanpa membebani perangkat lokal).

## Struktur Project

- `src/MainVideo.tsx` — Komponen animasi video (menggunakan `spring()` physics dan `interpolate()`).
- `src/Root.tsx` — Pengaturan resolusi (`1920x1080`), frame rate (`30 FPS`), durasi (`150 frames` / 5 detik), dan `defaultProps`.
- `.github/workflows/render-video.yml` — Workflow GitHub Actions yang menginstal Headless Chromium, merender MP4 dengan parameter dinamis, dan menyimpan hasilnya sebagai Artifact yang siap diunduh.

## Cara Render Video di GitHub Actions

1. Push folder ini ke repository GitHub Anda (`main` branch).
2. Buka repository di GitHub, lalu masuk ke tab **Actions**.
3. Pilih workflow **Render Motion Graphics Video** di panel kiri.
4. Klik tombol **Run workflow** untuk mengisi parameter dinamis tanpa perlu mengubah kode:
   - **Judul Utama Video** (`titleText`)
   - **Subjudul Video** (`subtitleText`)
   - **Warna Aksen** (`accentColor`, misal `#38bdf8`, `#f43f5e`, `#a855f7`)
5. Setelah workflow selesai (sekitar 1–2 menit), scroll ke bagian **Artifacts** di bawah halaman run tersebut dan klik **`rendered-motion-graphics`** untuk mengunduh file `video.mp4`.

## Cara Menjalankan Secara Lokal (Preview & Render)

```bash
npm install
npm run dev      # Membuka Remotion Studio di browser untuk preview real-time
npm run build    # Merender video ke out/video.mp4
```
