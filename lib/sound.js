(() => {
  const CLICK_DURATION_MS = 14;
  const CLICK_FREQ_HZ = 3950;

  let audioCtx = null;
  let noiseBuffer = null;
  let isSoundUnlocked = false;

  function getAudioContext() {
    if (!audioCtx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) {
        return null;
      }
      audioCtx = new Context();
    }
    return audioCtx;
  }

  function getNoiseBuffer(context) {
    if (noiseBuffer) {
      return noiseBuffer;
    }

    const length = Math.floor(context.sampleRate * 0.1);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    noiseBuffer = buffer;
    return noiseBuffer;
  }

  function unlockSound() {
    if (isSoundUnlocked) {
      return;
    }

    const context = getAudioContext();
    if (!context) {
      return;
    }

    context.resume().then(() => {
      isSoundUnlocked = true;
    }).catch(() => {});
  }

  function playClick() {
    if (!isSoundUnlocked) {
      return;
    }

    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const duration = CLICK_DURATION_MS / 1000;
    const baseFreq = CLICK_FREQ_HZ + (Math.random() * 140 - 70);

    const tone = context.createOscillator();
    tone.type = 'square';
    tone.frequency.setValueAtTime(baseFreq, now);

    const toneGain = context.createGain();
    toneGain.gain.setValueAtTime(0.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(0.22, now + 0.0015);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const noise = context.createBufferSource();
    noise.buffer = getNoiseBuffer(context);
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(baseFreq, now);
    noiseFilter.Q.setValueAtTime(1.2, now);

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.14, now + 0.001);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    tone.connect(toneGain).connect(context.destination);
    noise.connect(noiseFilter).connect(noiseGain).connect(context.destination);

    tone.start(now);
    tone.stop(now + duration + 0.003);
    noise.start(now);
    noise.stop(now + duration + 0.003);
  }

  function bindSoundEvents() {
    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('mouseenter', playClick);
    });

    document.addEventListener('click', playClick);
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('keydown', playClick);
    });

    window.addEventListener('pointerdown', unlockSound, {once: true});
    window.addEventListener('keydown', unlockSound, {once: true});
    window.addEventListener('touchstart', unlockSound, {once: true});
  }

  bindSoundEvents();
})();
