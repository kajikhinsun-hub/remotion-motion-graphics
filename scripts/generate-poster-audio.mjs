/**
 * High-Energy Gaming / Esports / Cyberpunk Synthwave Audio Generator (10 Seconds, 128 BPM)
 * Generates 44.1kHz Stereo WAV (`public/audio/poster-bgm.wav`) synced to frame animations:
 * - Punchy 128 BPM 4-on-the-floor electronic kick drum + crisp hi-hats + snare clap
 * - Driving cyberpunk saw/sub bassline (E minor / G / A / B progression)
 * - Fast 16th-note neon synth arpeggio
 * - Frame-accurate SFX cues:
 *   * 0.0s - 0.8s: Futuristic power-up riser + sub drop impact
 *   * 1.3s - 2.6s (Frames 40-78): 6 holographic whoosh/chime pops as each service card slams in
 *   * 2.8s - 3.6s (Frames 85-109): 4 crisp digital UI locks for the bottom feature icons
 *   * Periodic laser sweep & power chord stabs on CTA pulse
 */
import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 44100;
const DURATION = 10.0; // 300 frames @ 30fps

function writeWavFile(filePath, left, right) {
  const numSamples = left.length;
  const numChannels = 2;
  const bytesPerSample = 2;
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Soft tanh limiter for loud, punchy mastering without clipping
    const lSample = Math.tanh(left[i] * 1.15);
    const rSample = Math.tanh(right[i] * 1.15);
    buffer.writeInt16LE(Math.floor(lSample * 32767), offset);
    buffer.writeInt16LE(Math.floor(rSample * 32767), offset + 2);
    offset += 4;
  }

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${filePath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

let seed = 9001;
function nextNoise() {
  seed = (seed * 16807) % 2147483647;
  return seed / 1073741823.5 - 1.0;
}

function saw(phase) {
  const p = phase - Math.floor(phase);
  return 2.0 * p - 1.0;
}

function generatePosterBgm() {
  const totalSamples = Math.floor(SAMPLE_RATE * DURATION);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const bpm = 128;
  const beatDur = 60 / bpm; // ~0.46875s per beat
  const sixteenthDur = beatDur / 4;

  // E minor cyberpunk arp notes (Hz): E4, G4, B4, E5, D5, B4, A4, G4
  const arpNotes = [329.63, 392.0, 493.88, 659.25, 587.33, 493.88, 440.0, 392.0];
  // Bass root progression (E2 -> C2 -> G2 -> D2)
  const bassNotes = [82.41, 65.41, 98.0, 73.42];

  // Frame-synced SFX cue timestamps (seconds)
  const cardPopTimes = [0, 1, 2, 3, 4, 5].map((i) => (34 + i * 7) / 30);
  const iconBlipTimes = [0, 1, 2, 3].map((i) => (80 + i * 7) / 30);
  const pulseExplosionTimes = [0.4, 3.33, 6.66];

  let noiseLP = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const n = nextNoise();
    noiseLP = noiseLP * 0.85 + n * 0.15;

    // Master envelope (instant punch in, clean fade at 9.6-10.0s)
    const masterEnv = t > 9.55 ? Math.max(0, (10.0 - t) / 0.45) : 1.0;

    // 1. PUNCHY 4-ON-THE-FLOOR KICK & SNARE & HI-HAT
    const beatPos = t / beatDur;
    const beatIndex = Math.floor(beatPos);
    const beatFrac = beatPos - beatIndex;
    const beatTime = beatFrac * beatDur;

    // Kick drum on every beat
    const kickEnv = Math.exp(-beatTime * 19.0);
    const kickFreq = 46.0 + 130.0 * Math.exp(-beatTime * 48.0);
    const kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.62;

    // Snare + clap on beats 1, 3, 5, 7...
    let snare = 0;
    if (beatIndex % 2 === 1) {
      const snareEnv = Math.exp(-beatTime * 16.0);
      const snareBody = Math.sin(2 * Math.PI * 185 * beatTime) * Math.exp(-beatTime * 28.0);
      snare = (n * 0.7 + snareBody * 0.4) * snareEnv * 0.38;
    }

    // Off-beat 16th hi-hats
    const sixPos = t / sixteenthDur;
    const sixIndex = Math.floor(sixPos);
    const sixTime = (sixPos - sixIndex) * sixteenthDur;
    const hatAccent = sixIndex % 4 === 2 ? 0.22 : 0.09;
    const hat = (n - noiseLP) * Math.exp(-sixTime * 45.0) * hatAccent;

    // 2. CYBERPUNK DRIVING SAW BASSLINE (with sidechain ducking on kick)
    const sidechain = 1.0 - 0.65 * Math.exp(-beatTime * 12.0);
    const barIndex = Math.floor(beatIndex / 4) % bassNotes.length;
    const bassFreq = bassNotes[barIndex];
    const bassSub = Math.sin(2 * Math.PI * bassFreq * t) * 0.32;
    const bassGrind =
      Math.tanh(saw(bassFreq * t) * 2.2 + saw(bassFreq * 1.005 * t)) * 0.16;
    const bass = (bassSub + bassGrind) * sidechain;

    // 3. FAST 16TH-NOTE NEON SYNTH ARPEGGIO (stereo widened)
    const arpFreq = arpNotes[sixIndex % arpNotes.length];
    const arpEnv = Math.exp(-sixTime * 14.0);
    const arpL =
      (Math.sin(2 * Math.PI * arpFreq * t) * 0.6 + saw(arpFreq * 1.003 * t) * 0.4) *
      arpEnv *
      0.16 *
      sidechain;
    const arpR =
      (Math.sin(2 * Math.PI * (arpFreq * 1.002) * t) * 0.6 +
        saw(arpFreq * 0.997 * t) * 0.4) *
      arpEnv *
      0.16 *
      sidechain;

    // 4. FRAME-SYNCED SFX: 6 HOLOGRAPHIC CARD SLAM POPS
    let sfxL = 0;
    let sfxR = 0;
    for (let c = 0; c < cardPopTimes.length; c++) {
      const dt = t - cardPopTimes[c];
      if (dt >= 0 && dt < 0.26) {
        const popEnv = Math.exp(-dt * 16.0);
        // Pitch riser + crystal bell hit
        const chimeFreq = 520 + c * 85;
        const chime =
          (Math.sin(2 * Math.PI * chimeFreq * dt) +
            0.5 * Math.sin(2 * Math.PI * chimeFreq * 1.5 * dt)) *
          popEnv *
          0.22;
        const whoosh = noiseLP * Math.sin((dt / 0.26) * Math.PI) * 0.25;
        const pan = c % 2 === 0 ? 0.25 : 0.75;
        sfxL += (chime + whoosh) * (1 - pan);
        sfxR += (chime + whoosh) * pan;
      }
    }

    // 5. FRAME-SYNCED SFX: 4 DIGITAL UI LOCK BLIPS (Bottom Icons)
    for (let k = 0; k < iconBlipTimes.length; k++) {
      const dt = t - iconBlipTimes[k];
      if (dt >= 0 && dt < 0.14) {
        const bEnv = Math.exp(-dt * 28.0);
        const f = 880 + k * 160;
        const blip = Math.sin(2 * Math.PI * f * dt) * bEnv * 0.18;
        sfxL += blip;
        sfxR += blip;
      }
    }

    // 6. POWER SHOCKWAVE / LASER DROPS ON HERO & CTA PULSES
    for (const pt of pulseExplosionTimes) {
      const dt = t - pt;
      if (dt >= 0 && dt < 0.75) {
        const dropEnv = Math.exp(-dt * 4.5);
        const sweepFreq = 90 + 480 * Math.exp(-dt * 9.0);
        const impact = Math.sin(2 * Math.PI * sweepFreq * dt) * dropEnv * 0.32;
        sfxL += impact;
        sfxR += impact;
      }
    }

    left[i] = (kick + snare + hat * 0.8 + bass + arpL + sfxL) * masterEnv;
    right[i] = (kick + snare + hat * 1.2 + bass + arpR + sfxR) * masterEnv;
  }

  const outPath = path.join(process.cwd(), 'public', 'audio', 'poster-bgm.wav');
  writeWavFile(outPath, left, right);
}

generatePosterBgm();
