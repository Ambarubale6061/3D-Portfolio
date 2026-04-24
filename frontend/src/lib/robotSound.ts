let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let convolver: ConvolverNode | null = null;
let unlocked = false;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // Short hall-style impulse for spatial polish
    convolver = ctx.createConvolver();
    const dur = 1.8;
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * dur);
    const ir = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6);
      }
    }
    convolver.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.4;
    convolver.connect(wet).connect(master);
  }
  return ctx;
}

function unlock() {
  if (unlocked) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  unlocked = true;
}

if (typeof window !== "undefined") {
  const onFirst = () => {
    unlock();
    window.removeEventListener("pointerdown", onFirst);
    window.removeEventListener("keydown", onFirst);
    window.removeEventListener("touchstart", onFirst);
  };
  window.addEventListener("pointerdown", onFirst, { passive: true });
  window.addEventListener("keydown", onFirst);
  window.addEventListener("touchstart", onFirst, { passive: true });
}

export function setRobotMuted(v: boolean) {
  muted = v;
}
export function isRobotMuted() {
  return muted;
}

function routeWithReverb(node: AudioNode, dryGainVal = 1, wetSend = 1) {
  const c = ctx!;
  const dry = c.createGain();
  dry.gain.value = dryGainVal;
  node.connect(dry).connect(master!);
  if (convolver && wetSend > 0) {
    const sendGain = c.createGain();
    sendGain.gain.value = wetSend;
    node.connect(sendGain).connect(convolver);
  }
}

/**
 * "Holographic warp" — soft, elegant, hi-fi UI cue.
 * A breathy upward sine sweep with a gentle bell harmonic, soft air noise,
 * and a small downward tail — bathed in reverb. Tuned to feel like a
 * polished sci-fi interface confirmation, not a video game blip.
 */
export function playWhoosh() {
  if (muted) return;
  const c = getCtx();
  if (!c || !unlocked || !master) return;
  const t0 = c.currentTime;

  // --- 1. Smooth ascending sine sweep (the "warp") ---
  const sweep = c.createOscillator();
  sweep.type = "sine";
  sweep.frequency.setValueAtTime(180, t0);
  sweep.frequency.exponentialRampToValueAtTime(880, t0 + 0.32);
  const sweepGain = c.createGain();
  sweepGain.gain.setValueAtTime(0.0001, t0);
  sweepGain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.08);
  sweepGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
  sweep.connect(sweepGain);
  routeWithReverb(sweepGain, 0.9, 0.7);
  sweep.start(t0);
  sweep.stop(t0 + 0.6);

  // --- 2. Octave-up shimmer (adds richness) ---
  const shimmer = c.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(360, t0);
  shimmer.frequency.exponentialRampToValueAtTime(1760, t0 + 0.32);
  const shimmerGain = c.createGain();
  shimmerGain.gain.setValueAtTime(0.0001, t0);
  shimmerGain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.1);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
  shimmer.connect(shimmerGain);
  routeWithReverb(shimmerGain, 0.7, 0.9);
  shimmer.start(t0);
  shimmer.stop(t0 + 0.55);

  // --- 3. Bell-like FM harmonic at the apex ---
  const bell = c.createOscillator();
  const bellMod = c.createOscillator();
  const bellModGain = c.createGain();
  bell.type = "sine";
  bellMod.type = "sine";
  bell.frequency.setValueAtTime(1320, t0 + 0.28);
  bellMod.frequency.setValueAtTime(1980, t0 + 0.28);
  bellModGain.gain.setValueAtTime(280, t0 + 0.28);
  bellModGain.gain.exponentialRampToValueAtTime(20, t0 + 0.9);
  bellMod.connect(bellModGain).connect(bell.frequency);
  const bellGain = c.createGain();
  bellGain.gain.setValueAtTime(0.0001, t0 + 0.28);
  bellGain.gain.exponentialRampToValueAtTime(0.1, t0 + 0.34);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.0);
  bell.connect(bellGain);
  routeWithReverb(bellGain, 0.55, 1.0);
  bell.start(t0 + 0.28);
  bellMod.start(t0 + 0.28);
  bell.stop(t0 + 1.05);
  bellMod.stop(t0 + 1.05);

  // --- 4. Soft airy noise wash (atmospheric body) ---
  const airLen = Math.floor(c.sampleRate * 0.5);
  const airBuf = c.createBuffer(1, airLen, c.sampleRate);
  const airData = airBuf.getChannelData(0);
  for (let i = 0; i < airLen; i++) {
    const t = i / airLen;
    const env = Math.sin(t * Math.PI); // soft fade in/out
    airData[i] = (Math.random() * 2 - 1) * env;
  }
  const air = c.createBufferSource();
  air.buffer = airBuf;
  const airBP = c.createBiquadFilter();
  airBP.type = "bandpass";
  airBP.Q.value = 0.7;
  airBP.frequency.setValueAtTime(900, t0);
  airBP.frequency.exponentialRampToValueAtTime(3200, t0 + 0.4);
  const airGain = c.createGain();
  airGain.gain.setValueAtTime(0.06, t0);
  airGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
  air.connect(airBP).connect(airGain);
  routeWithReverb(airGain, 0.6, 0.8);
  air.start(t0);
  air.stop(t0 + 0.55);

  // --- 5. Soft downward tail (closure) ---
  const tail = c.createOscillator();
  tail.type = "sine";
  tail.frequency.setValueAtTime(660, t0 + 0.4);
  tail.frequency.exponentialRampToValueAtTime(330, t0 + 0.85);
  const tailGain = c.createGain();
  tailGain.gain.setValueAtTime(0.0001, t0 + 0.4);
  tailGain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.46);
  tailGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
  tail.connect(tailGain);
  routeWithReverb(tailGain, 0.7, 0.8);
  tail.start(t0 + 0.4);
  tail.stop(t0 + 1.0);
}
