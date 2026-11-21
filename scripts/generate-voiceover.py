#!/usr/bin/env python3
"""
Generator Voiceover Narator Bahasa Indonesia (Neural TTS) untuk 6 Scene "KEAJAIBAN ALAM SEMESTA"
Menggunakan Microsoft Edge Neural TTS (`id-ID-ArdiNeural` — suara narator pria dokumenter yang berwibawa & natural)
dengan fallback ke `gTTS` jika koneksi WebSocket Edge dibatasi.
"""
import asyncio
import os
import subprocess

OUTPUT_DIR = os.path.join(os.getcwd(), "public", "audio", "vo")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Naskah Narator Dokumenter Bahasa Indonesia (disesuaikan dengan durasi tiap scene)
SCENES_VO = [
    {
        "filename": "vo-scene1.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-4%",
        "pitch": "-4Hz",
        "text": "Alam semesta... menyimpan keajaiban kehidupan yang tak terbatas.",
    },
    {
        "filename": "vo-scene2.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-2%",
        "pitch": "-4Hz",
        "text": (
            "Hutan tropis adalah paru-paru bumi. "
            "Pepohonan menyerap miliaran ton karbon dioksida, "
            "dan menghasilkan oksigen yang menopang seluruh kehidupan."
        ),
    },
    {
        "filename": "vo-scene3.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-2%",
        "pitch": "-4Hz",
        "text": (
            "Jauh di kedalaman samudra... lautan menjadi rumah bagi keanekaragaman hayati. "
            "Terumbu karang menjaga keseimbangan ekosistem bawah laut."
        ),
    },
    {
        "filename": "vo-scene4.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-2%",
        "pitch": "-4Hz",
        "text": (
            "Dari puncak pegunungan megah, mata air dan gletser mengalir... "
            "menjadi sumber kehidupan yang menghubungkan seluruh ekosistem."
        ),
    },
    {
        "filename": "vo-scene5.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-2%",
        "pitch": "-4Hz",
        "text": (
            "Siklus kehidupan terus berputar tanpa henti. "
            "Air laut menguap, membentuk awan, turun sebagai hujan, "
            "mengalir kembali ke sungai, dan diserap oleh tumbuhan."
        ),
    },
    {
        "filename": "vo-scene6.mp3",
        "voice": "id-ID-ArdiNeural",
        "rate": "-5%",
        "pitch": "-5Hz",
        "text": (
            "Bumi bukan sekadar tempat kita hidup. "
            "Bumi... adalah kehidupan itu sendiri."
        ),
    },
]


async def generate_with_edge_tts(item: dict, out_path: str) -> bool:
    try:
        import edge_tts

        communicate = edge_tts.Communicate(
            text=item["text"],
            voice=item["voice"],
            rate=item["rate"],
            pitch=item["pitch"],
        )
        await communicate.save(out_path)
        return os.path.exists(out_path) and os.path.getsize(out_path) > 1000
    except Exception as exc:
        print(f"[edge-tts warning] {item['filename']}: {exc}")
        return False


def generate_with_gtts(item: dict, out_path: str) -> bool:
    try:
        from gtts import gTTS

        tts = gTTS(text=item["text"], lang="id", slow=False)
        raw_path = out_path + ".raw.mp3"
        tts.save(raw_path)
        # Warm up pitch slightly with ffmpeg for documentary tone
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                raw_path,
                "-af",
                "asetrate=24000*0.95,aresample=44100,atempo=1.05",
                "-ar",
                "44100",
                "-ac",
                "2",
                "-b:a",
                "192k",
                out_path,
            ],
            check=True,
        )
        os.remove(raw_path)
        return True
    except Exception as exc:
        print(f"[gTTS error] {item['filename']}: {exc}")
        return False


async def main():
    for item in SCENES_VO:
        out_path = os.path.join(OUTPUT_DIR, item["filename"])
        print(f"Generating narrator voiceover: {item['filename']} ...")
        ok = await generate_with_edge_tts(item, out_path)
        if not ok:
            print(f"Falling back to gTTS for {item['filename']}...")
            ok = generate_with_gtts(item, out_path)
        if not ok:
            raise RuntimeError(f"Failed to generate voiceover for {item['filename']}")
        size_kb = os.path.getsize(out_path) / 1024
        print(f" -> Saved {out_path} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
