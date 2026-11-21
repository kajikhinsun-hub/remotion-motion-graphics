/**
 * Procedural 44.1kHz Stereo WAV Soundscape Generator for "KEAJAIBAN ALAM SEMESTA" (65 Seconds)
 * Pure JavaScript (.mjs) — Zero TypeScript annotations so `node scripts/generate-audio.mjs` runs natively.
 */
import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 44100;

function writeWavFile(filePath, left, right) {
  const numSamples = left.length;
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit PCM
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const lSample = Math.max(-1, Math.min(1, left[i]));
    const rSample = Math.max(-1, Math.min(1, right[i]));
    buffer.writeInt16LE(Math.floor(lSample * 32767), offset);
    buffer.writeInt16LE(Math.floor(rSample * 32767), offset + 2);
    offset += 4;
  }

  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${filePath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

let seed = 1337;
function nextNoise() {
  seed = (seed * 16807) % 2147483647;
  return seed / 1073741823.5 - 1.0;
}

// 1. Generate 65-second Cinematic Ambient Music Bed
function generateAmbientMusic(outDir) {
  const duration = 65;
  const totalSamples = SAMPLE_RATE * duration;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const chords = [
    [73.42, 110.0, 174.61, 220.0, 261.63, 329.63],
    [58.27, 87.31, 146.83, 174.61, 220.0, 261.63],
    [65.41, 87.31, 110.0, 130.81, 164.81, 196.0],
    [49.0, 73.42, 116.54, 174.61, 220.0, 293.66],
    [55.0, 82.41, 110.0, 146.83, 164.81, 196.0],
    [73.42, 110.0, 146.83, 185.0, 220.0, 293.66],
  ];

  const sceneBoundaries = [0, 7, 18, 30, 42, 55, 65];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    let masterEnv = 1.0;
    if (t < 2.5) masterEnv = t / 2.5;
    else if (t > 60) masterEnv = Math.max(0, (65 - t) / 5.0);

    let sampleL = 0;
    let sampleR = 0;

    for (let s = 0; s < chords.length; s++) {
      const start = sceneBoundaries[s];
      const end = sceneBoundaries[s + 1];
      let weight = 0;
      if (t >= start - 1.5 && t <= end + 1.5) {
        const fadeIn = Math.min(1, Math.max(0, (t - (start - 1.5)) / 3.0));
        const fadeOut = Math.min(1, Math.max(0, (end + 1.5 - t) / 3.0));
        weight = s === 0 && t < start + 1.5 ? 1 : Math.min(fadeIn, fadeOut);
      }

      if (weight > 0.001) {
        const freqs = chords[s];
        let chordL = 0;
        let chordR = 0;
        for (let n = 0; n < freqs.length; n++) {
          const f = freqs[n];
          const lfoL = Math.sin(2 * Math.PI * (0.12 + n * 0.03) * t + n);
          const lfoR = Math.cos(2 * Math.PI * (0.11 + n * 0.04) * t + n * 1.4);
          const amp = n < 2 ? 0.16 : 0.08 / (n * 0.45);

          const waveL =
            Math.sin(2 * Math.PI * f * t + lfoL * 0.25) +
            0.35 * Math.sin(2 * Math.PI * f * 2.0 * t);
          const waveR =
            Math.sin(2 * Math.PI * (f * 1.002) * t + lfoR * 0.25) +
            0.35 * Math.sin(2 * Math.PI * (f * 1.998) * t);

          chordL += waveL * amp * (0.75 + 0.25 * lfoL);
          chordR += waveR * amp * (0.75 + 0.25 * lfoR);
        }
        sampleL += chordL * weight;
        sampleR += chordR * weight;
      }
    }

    const motifFreqs = [587.33, 659.25, 523.25, 440.0, 587.33, 880.0];
    const beatIndex = Math.floor(t / 2.0) % motifFreqs.length;
    const beatPhase = (t % 2.0) / 2.0;
    const noteEnv = Math.exp(-beatPhase * 5.5) * Math.min(1, beatPhase * 35);
    const motifFreq = motifFreqs[beatIndex];
    const bell = Math.sin(2 * Math.PI * motifFreq * t) * 0.045 * noteEnv;

    left[i] = (sampleL + bell * 0.9) * masterEnv * 0.65;
    right[i] = (sampleR + bell * 1.1) * masterEnv * 0.65;
  }

  writeWavFile(path.join(outDir, 'ambient-music.wav'), left, right);
}

// 2. Generate Natural Forest Ambience (13s)
function generateForestAmbience(outDir) {
  const duration = 13;
  const totalSamples = SAMPLE_RATE * duration;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  let lpL = 0;
  let lpR = 0;

  const chirps = [
    {t0: 1.2, f0: 2400, f1: 3100, dur: 0.22, pan: 0.3},
    {t0: 1.5, f0: 2500, f1: 3250, dur: 0.18, pan: 0.3},
    {t0: 3.4, f0: 1950, f1: 1650, dur: 0.32, pan: 0.75},
    {t0: 5.1, f0: 2800, f1: 3400, dur: 0.16, pan: 0.4},
    {t0: 5.35, f0: 2850, f1: 3500, dur: 0.19, pan: 0.4},
    {t0: 7.8, f0: 2100, f1: 2700, dur: 0.28, pan: 0.25},
    {t0: 9.6, f0: 2600, f1: 2200, dur: 0.25, pan: 0.8},
    {t0: 10.0, f0: 2650, f1: 2150, dur: 0.25, pan: 0.8},
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env =
      t < 1.2 ? t / 1.2 : t > duration - 1.2 ? (duration - t) / 1.2 : 1.0;

    const breezeMod = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.28 * t);
    lpL = lpL * 0.94 + nextNoise() * 0.06;
    lpR = lpR * 0.94 + nextNoise() * 0.06;

    let birdL = 0;
    let birdR = 0;
    for (const c of chirps) {
      if (t >= c.t0 && t <= c.t0 + c.dur) {
        const p = (t - c.t0) / c.dur;
        const cEnv = Math.sin(Math.PI * p);
        const freq =
          c.f0 + (c.f1 - c.f0) * p + Math.sin(2 * Math.PI * 35 * t) * 45;
        const sig = Math.sin(2 * Math.PI * freq * t) * cEnv * 0.08;
        birdL += sig * (1 - c.pan);
        birdR += sig * c.pan;
      }
    }

    left[i] = (lpL * breezeMod * 0.25 + birdL) * env;
    right[i] = (lpR * breezeMod * 0.25 + birdR) * env;
  }

  writeWavFile(path.join(outDir, 'forest-ambience.wav'), left, right);
}

// 3. Generate Ocean Underwater Ambience (14s)
function generateOceanAmbience(outDir) {
  const duration = 14;
  const totalSamples = SAMPLE_RATE * duration;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  let deepL = 0;
  let deepR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env =
      t < 1.5 ? t / 1.5 : t > duration - 1.5 ? (duration - t) / 1.5 : 1.0;

    deepL = deepL * 0.992 + nextNoise() * 0.008;
    deepR = deepR * 0.992 + nextNoise() * 0.008;

    const waveSwell = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.18 * t);
    const subSonar =
      Math.sin(2 * Math.PI * 65.41 * t) *
      0.07 *
      Math.sin(2 * Math.PI * 0.12 * t);

    left[i] = (deepL * 1.4 * waveSwell + subSonar) * env;
    right[i] = (deepR * 1.4 * waveSwell + subSonar) * env;
  }

  writeWavFile(path.join(outDir, 'ocean-ambience.wav'), left, right);
}

// 4. Generate High-Altitude Mountain Wind Ambience (14s)
function generateWindAmbience(outDir) {
  const duration = 14;
  const totalSamples = SAMPLE_RATE * duration;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  let lp1L = 0;
  let lp2L = 0;
  let lp1R = 0;
  let lp2R = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env =
      t < 1.5 ? t / 1.5 : t > duration - 1.5 ? (duration - t) / 1.5 : 1.0;

    const gust = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.22 * t + 0.6);
    const nL = nextNoise();
    const nR = nextNoise();

    lp1L = lp1L * 0.975 + nL * 0.025;
    lp2L = lp2L * 0.985 + lp1L * 0.015;

    lp1R = lp1R * 0.975 + nR * 0.025;
    lp2R = lp2R * 0.985 + lp1R * 0.015;

    const whistle =
      Math.sin(2 * Math.PI * (340 + 40 * gust) * t) * 0.025 * gust;

    left[i] = (lp2L * 1.2 * gust + whistle) * env;
    right[i] = (lp2R * 1.2 * gust + whistle * 0.9) * env;
  }

  writeWavFile(path.join(outDir, 'wind-ambience.wav'), left, right);
}

// 5. Generate Subtle Cinematic Title Impact (3.2s)
function generateCinematicImpact(outDir) {
  const duration = 3.2;
  const totalSamples = SAMPLE_RATE * duration;
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  let lpL = 0;
  let lpR = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    const boomEnv = Math.exp(-t * 2.4) * Math.min(1, t * 80);
    const phase = 2 * Math.PI * (36 * t + 18 * (1 - Math.exp(-t * 4.5)));
    const subBoom = Math.sin(phase) * 0.55 * boomEnv;

    lpL = lpL * 0.96 + nextNoise() * 0.04;
    lpR = lpR * 0.96 + nextNoise() * 0.04;
    const whooshEnv = Math.exp(-t * 1.8) * Math.min(1, t * 25);

    const shimmerEnv = Math.exp(-t * 1.2) * Math.min(1, t * 12);
    const shimmer =
      (Math.sin(2 * Math.PI * 293.66 * t) +
        0.7 * Math.sin(2 * Math.PI * 440.0 * t)) *
      0.06 *
      shimmerEnv;

    left[i] = (subBoom + lpL * whooshEnv * 0.35 + shimmer) * 0.85;
    right[i] = (subBoom + lpR * whooshEnv * 0.35 + shimmer * 0.95) * 0.85;
  }

  writeWavFile(path.join(outDir, 'impact.wav'), left, right);
}

const outDir = path.join(process.cwd(), 'public', 'audio');
generateAmbientMusic(outDir);
generateForestAmbience(outDir);
generateOceanAmbience(outDir);
generateWindAmbience(outDir);
generateCinematicImpact(outDir);
console.log('All 5 procedural soundscape tracks generated successfully!');
