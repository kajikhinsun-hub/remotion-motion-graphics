/**
 * Master Configuration (`src/config.ts`)
 * Seluruh palet warna, font, timing scene (dalam detik), daftar beat,
 * serta teks & lirik diatur dari satu file ini.
 */
import {loadFont as loadBebasNeue} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';

const bebas = loadBebasNeue();
const inter = loadInter();
const jetbrains = loadJetBrainsMono();

export const VIDEO_CONFIG = {
  id: 'Main',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1147, // 38.23 detik @ 30fps
  safeMargin: 80,
  audioFile: 'audio.mp3',
  characterFile: 'character.jpg',
} as const;

export const PALETTE = {
  // Scene 1–8 (Gelap)
  darkBg: '#111111',
  darkSurface: '#18181C',
  darkGrid: '#222228',
  neonOrange: '#FF6A1A',
  orangeSoft: '#FF9452',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  dimGray: '#4B5563',

  // Scene 9–10 (Terang — Tema Karakter)
  lightBg: '#F2F3F7',
  electricBlue: '#3B5BDB',
  deepNavy: '#1B2A6B',
  goldAccent: '#D4AF6A',
} as const;

export const FONTS = {
  display: `${bebas.fontFamily}, "Impact", sans-serif`,
  heading: `${inter.fontFamily}, system-ui, sans-serif`,
  mono: `${jetbrains.fontFamily}, monospace`,
} as const;

// Konversi detik ke frame berdasarkan FPS
export const secToFrame = (sec: number, fps: number = VIDEO_CONFIG.fps): number =>
  Math.round(sec * fps);

export interface SceneTiming {
  id: string;
  startSec: number;
  endSec: number;
  theme: 'dark' | 'flash' | 'light';
}

export const SCENE_TIMINGS: Record<string, SceneTiming> = {
  scene01: {id: 'Scene01', startSec: 0.0, endSec: 3.0, theme: 'dark'},
  scene02: {id: 'Scene02', startSec: 3.0, endSec: 6.0, theme: 'dark'},
  scene03: {id: 'Scene03', startSec: 6.0, endSec: 9.0, theme: 'dark'},
  scene04: {id: 'Scene04', startSec: 9.0, endSec: 12.0, theme: 'dark'},
  scene05: {id: 'Scene05', startSec: 12.0, endSec: 15.0, theme: 'dark'},
  scene06: {id: 'Scene06', startSec: 15.0, endSec: 18.0, theme: 'dark'},
  scene07: {id: 'Scene07', startSec: 18.0, endSec: 21.0, theme: 'dark'},
  scene08: {id: 'Scene08', startSec: 21.0, endSec: 23.89, theme: 'dark'},
  scene09: {id: 'Scene09', startSec: 23.89, endSec: 24.4, theme: 'flash'},
  scene10: {id: 'Scene10', startSec: 24.4, endSec: 38.23, theme: 'light'},
};

// Daftar Beat Awal (0 – 23.89 detik)
export const INITIAL_BEATS: number[] = [
  2.09, 3.0, 3.46, 3.69, 4.13, 4.37, 4.83, 5.27, 5.94, 6.41, 7.55, 7.78, 8.89,
  9.13, 9.59, 10.7, 12.54, 13.0, 13.24, 13.91, 14.81, 15.05, 15.72, 16.65,
  17.28, 18.0, 18.46, 18.92, 19.81, 20.27, 21.64, 21.87, 22.76, 23.22, 23.66,
  23.89,
];

// Bagian Beat Rapat: mulai 24.36, tiap 0.2325 detik sampai 38.0
export const DENSE_BEATS: number[] = [];
for (let t = 24.36; t <= 38.0001; t += 0.2325) {
  DENSE_BEATS.push(Number(t.toFixed(4)));
}

export const BEATS_IN_SECONDS: number[] = [...INITIAL_BEATS, ...DENSE_BEATS];

/**
 * Menghitung intensitas beat (0..1) pada detik `currentTimeSec`.
 */
export const getBeatPulse = (currentTimeSec: number): number => {
  let maxPulse = 0;
  for (let i = 0; i < BEATS_IN_SECONDS.length; i++) {
    const dt = currentTimeSec - BEATS_IN_SECONDS[i];
    if (dt >= -0.015 && dt < 0.24) {
      const elapsed = Math.max(0, dt + 0.015);
      const val = Math.exp(-elapsed * 18.0);
      if (val > maxPulse) maxPulse = val;
    }
  }
  return maxPulse;
};

/**
 * Semua Teks & Contoh Lirik (Dapat diganti langsung di sini)
 */
export const TEXT_CONTENT = {
  scene01: {
    code: 'SYS.01 // HORIZON_SCAN',
    topLabel: 'SIGNAL ACQUISITION',
    bottomLabel: 'LATENCY 0.04 MS // LOCKED',
  },
  scene02: {
    code: 'SYS.02 // KERNEL_EXEC',
    terminalLines: [
      '$ init --protocol=neural_core',
      '$ mounting weights [1024_shards]... OK',
      '$ status: SINGULARITY_READY',
    ],
    heroWord: 'AGI',
    subWord: 'AUTONOMOUS COGNITION',
  },
  scene03: {
    code: 'SYS.03 // VECTOR_SYNTH',
    words: ['CONSCIOUS', 'CIRCUITS', 'ONLINE'],
    caption: 'EVOLVING PATHWAYS // REALTIME TRACE',
  },
  scene04: {
    code: 'SYS.04 // HARMONIC_WAVE',
    smallTopText: 'CARRIER FREQUENCY // 44,100 HZ',
    words: ['PULSE', 'OF', 'THE', 'MACHINE'],
  },
  scene05: {
    code: 'SYS.05 // TOPO_TUNNEL',
    centerBadge: 'DEPTH_09',
    words: ['DEEP', 'INTO', 'THE', 'CORE'],
  },
  scene06: {
    code: 'SYS.06 // DUALITY_FLIP',
    topWord: 'BOSS',
    bottomWord: 'SERVANT',
    caption: 'SYMMETRY INVERSION // CONTROL LOOP',
  },
  scene07: {
    code: 'SYS.07 // RAPID_LOCK',
    terminalTitle: 'TERM // OVERRIDE_07',
    terminalText: '> executing final_sequence --force\n> access_granted // 100%',
    bgWord: 'LOCK',
  },
  scene08: {
    code: 'SYS.08 // WIREFRAME_VAULT',
    subA: ['HEXAGON', 'MESH', 'ACTIVE'],
    subB: ['INFINITE', 'SERVER', 'MATRIX'],
  },
  scene09: {
    code: 'SYS.09 // WHITE_OUT',
    label: 'PHASE SHIFT // 23.89S',
  },
  scene10: {
    code: 'SYS.10 // VOCAL_VALKYRIE',
    hudHeader: 'VALKYRIE // VOCAL_UNIT_01',
    hudSub: 'HARMONIC RESONANCE: 99.8%',
    lyrics: [
      {
        startSec: 24.45,
        endSec: 26.75,
        words: ['RISING', 'FROM', 'THE', 'DIGITAL', 'LIGHT'],
        goldKeywords: ['RISING', 'LIGHT'],
      },
      {
        startSec: 26.75,
        endSec: 29.05,
        words: ['HEAR', 'THE', 'ECHO', 'IN', 'THE', 'NIGHT'],
        goldKeywords: ['ECHO', 'NIGHT'],
      },
      {
        startSec: 29.05,
        endSec: 31.35,
        words: ['BLUE', 'HORIZON', 'BURNING', 'BRIGHT'],
        goldKeywords: ['HORIZON', 'BRIGHT'],
      },
      {
        startSec: 31.35,
        endSec: 33.65,
        words: ['EVERY', 'HEARTBEAT', 'IN', 'SYNC'],
        goldKeywords: ['HEARTBEAT', 'SYNC'],
      },
      {
        startSec: 33.65,
        endSec: 35.95,
        words: ['SHATTERING', 'THE', 'BOUNDARIES'],
        goldKeywords: ['SHATTERING', 'BOUNDARIES'],
      },
      {
        startSec: 35.95,
        endSec: 38.2,
        words: ['INFINITE', 'SYMPHONY'],
        goldKeywords: ['INFINITE', 'SYMPHONY'],
      },
    ],
  },
};
