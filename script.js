/* ============================================================
   HAPPY BIRTHDAY LANDING — JAVASCRIPT
   Modules:
     1. Rose Petals Generator
     2. Custom Audio Player
     3. Video Player
     4. Scroll Reveal (IntersectionObserver)
   ============================================================ */

'use strict';

// ── AUDIO FILE PATH ─────────────────────────────────────────
// Change this if your audio file has a different name
const AUDIO_SRC = 'audio/song.mp3';

// ── VIDEO FILE PATH ─────────────────────────────────────────
// Change this if your video file has a different name
const VIDEO_SRC = 'video/video.mp4';

// ============================================================
// 1. ROSE PETALS GENERATOR
// ============================================================

const PetalManager = (() => {
  const container = document.getElementById('petals-container');
  const MAX_PETALS = 14;
  let activeCount = 0;

  function createPetal() {
    if (activeCount >= MAX_PETALS) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Random sizing
    const size = Math.random() * 14 + 10; // 10–24px
    petal.style.width  = size + 'px';
    petal.style.height = size * (0.6 + Math.random() * 0.5) + 'px';

    // Random horizontal start position
    petal.style.left = Math.random() * 100 + 'vw';

    // Random slight transparency variation
    petal.style.opacity = (0.35 + Math.random() * 0.45).toString();

    // Random fall duration: 7–13s
    const fallDur = (7 + Math.random() * 6).toFixed(1) + 's';
    petal.style.setProperty('--fall-dur', fallDur);

    // Random sway direction and amount
    const swayDir = Math.random() > 0.5 ? 1 : -1;
    const swayAmt = (30 + Math.random() * 80) * swayDir;
    petal.style.setProperty('--sway', swayAmt + 'px');

    // Random spin
    const spinDeg = (200 + Math.random() * 320) * (Math.random() > 0.5 ? 1 : -1);
    petal.style.setProperty('--spin', spinDeg + 'deg');

    // Random fall delay: 0–1s
    petal.style.setProperty('--fall-delay', (Math.random() * 1).toFixed(2) + 's');

    // Slight rotation variation on shape
    const rotate = Math.random() * 360;
    petal.style.transform = `rotate(${rotate}deg)`;

    container.appendChild(petal);
    activeCount++;

    petal.addEventListener('animationend', () => {
      petal.remove();
      activeCount--;
    }, { once: true });
  }

  function init() {
    // Spawn initial batch
    for (let i = 0; i < 6; i++) {
      setTimeout(() => createPetal(), i * 400);
    }

    // Keep spawning new petals
    setInterval(() => {
      if (activeCount < MAX_PETALS) {
        createPetal();
      }
    }, 900);
  }

  return { init };
})();

// ============================================================
// 2. CUSTOM AUDIO PLAYER
// ============================================================

const AudioPlayer = (() => {
  let audioLoaded = false;
  let isPlaying   = false;

  const audioEl   = document.getElementById('audio-element');
  const btnPlay   = document.getElementById('btn-play-audio');
  const iconPlay  = btnPlay?.querySelector('.icon-play');
  const iconPause = btnPlay?.querySelector('.icon-pause');
  const rangEl    = document.getElementById('audio-range');
  const fillEl    = document.getElementById('progress-fill');
  const currEl    = document.getElementById('audio-current');
  const durEl     = document.getElementById('audio-duration');

  function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function setPlayState(playing) {
    isPlaying = playing;
    if (iconPlay && iconPause) {
      iconPlay.style.display  = playing ? 'none' : '';
      iconPause.style.display = playing ? '' : 'none';
    }
  }

  function loadAudio() {
    if (audioLoaded) return;
    audioEl.src = AUDIO_SRC;
    audioEl.load();
    audioLoaded = true;
  }

  function togglePlay() {
    loadAudio();
    if (audioEl.paused) {
      audioEl.play().catch(() => {
        // Autoplay policy — show user feedback if needed
        console.warn('Audio playback was prevented. User interaction required.');
      });
    } else {
      audioEl.pause();
    }
  }

  function updateProgress() {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    if (fillEl) fillEl.style.width = pct + '%';
    if (rangEl) rangEl.value = pct;
    if (currEl) currEl.textContent = formatTime(audioEl.currentTime);
  }

  function onSeek() {
    if (!audioEl.duration) return;
    const seekTime = (rangEl.value / 100) * audioEl.duration;
    audioEl.currentTime = seekTime;
  }

  function init() {
    if (!btnPlay || !audioEl) return;

    btnPlay.addEventListener('click', togglePlay);

    audioEl.addEventListener('play', () => setPlayState(true));
    audioEl.addEventListener('pause', () => setPlayState(false));
    audioEl.addEventListener('ended', () => {
      setPlayState(false);
      if (fillEl) fillEl.style.width = '0%';
      if (rangEl) rangEl.value = 0;
      if (currEl) currEl.textContent = '0:00';
    });

    audioEl.addEventListener('timeupdate', updateProgress);

    audioEl.addEventListener('loadedmetadata', () => {
      if (durEl) durEl.textContent = formatTime(audioEl.duration);
    });

    audioEl.addEventListener('error', () => {
      if (durEl) durEl.textContent = 'No file';
      console.warn('Audio file not found. Add song.mp3 to the project folder.');
    });

    if (rangEl) {
      rangEl.addEventListener('input', onSeek);
    }
  }

  return { init };
})();

// ============================================================
// 3. VIDEO PLAYER
// ============================================================

const VideoPlayer = (() => {
  function init() {
    const containers = document.querySelectorAll('.video-container');
    
    containers.forEach(container => {
      const videoEl = container.querySelector('video');
      if (!videoEl) return;

      videoEl.addEventListener('error', () => {
        container.innerHTML = `
          <div style="
            background: rgba(255,255,255,0.04);
            border: 1px dashed rgba(212,168,85,0.3);
            border-radius: 18px;
            padding: 32px 20px;
            text-align: center;
            color: rgba(255,255,255,0.4);
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            height: 100%;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
          ">
            <div style="font-size: 32px; margin-bottom: 12px;">🎬</div>
            <p>Add video to the project folder</p>
          </div>
        `;
      });
    });
  }

  return { init };
})();

// ============================================================
// 4. SCROLL REVEAL — IntersectionObserver
// ============================================================

const ScrollReveal = (() => {
  function init() {
    const targets = document.querySelectorAll('.reveal-section');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ============================================================
// 5. ROSE PETAL SEQUENCE & TYPEWRITER (letter.html)
// ============================================================

const PetalTypewriter = (() => {
  function init() {
    const petals = document.querySelectorAll('.card-petal-content');
    if (!petals.length) return;

    // Prepare text nodes for each petal
    const petalData = Array.from(petals).map((el) => {
      const textEl = el.querySelector('.card-petal-text');
      
      const walk = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let n;
      while ((n = walk.nextNode())) {
        textNodes.push(n);
      }

      // Store the original text and clear the nodes
      const nodeData = textNodes.map(node => {
        const text = node.nodeValue;
        node.nodeValue = '';
        return { node, textArray: Array.from(text) };
      });

      // Override CSS animation so JS controls visibility
      textEl.style.opacity = '1';
      textEl.style.animation = 'none';

      return { container: el, textNodes: nodeData };
    });

    let currentPetalIndex = 0;

    function playNextPetal() {
      if (currentPetalIndex >= petalData.length) return; // All petals are done

      const currentPetal = petalData[currentPetalIndex];
      
      // 1. Trigger the petal fly-in CSS animation
      currentPetal.container.classList.add('is-active');

      // 2. Wait for fly-in to finish (1.8s) before starting to type
      setTimeout(() => {
        let currentNodeIndex = 0;
        let currentCharIndex = 0;

        function typeNextChar() {
          if (currentNodeIndex >= currentPetal.textNodes.length) {
            // Typing finished for this petal!
            currentPetalIndex++;
            // Small pause before the next petal flies in
            setTimeout(playNextPetal, 400); 
            return;
          }

          const currentData = currentPetal.textNodes[currentNodeIndex];

          if (currentCharIndex < currentData.textArray.length) {
            // Append the next character/emoji
            currentData.node.nodeValue += currentData.textArray[currentCharIndex];
            currentCharIndex++;
            
            // Randomize typing speed slightly for realism (30ms to 70ms)
            const speed = 30 + Math.random() * 40;
            setTimeout(typeNextChar, speed);
          } else {
            // Move to the next text node (e.g. after a <br> tag)
            currentNodeIndex++;
            currentCharIndex = 0;
            typeNextChar();
          }
        }

        typeNextChar(); // Start typing
      }, 1800);
    }

    // Start the whole sequence with a small initial delay
    setTimeout(playNextPetal, 400);
  }

  return { init };
})();

// ============================================================
// 6. SCROLL INDICATOR CLICK → smooth scroll to next section
// ============================================================

function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  const nextSection = document.getElementById('section-letter');
  if (indicator && nextSection) {
    indicator.addEventListener('click', () => {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

// ============================================================
// 7. TEXT PAGE TYPEWRITER (text.html)
// ============================================================

const TextPageTypewriter = (() => {
  function init() {
    const sequence = document.getElementById('text-sequence');
    if (!sequence) return;

    const blocks = sequence.querySelectorAll('.typewriter-block');
    if (!blocks.length) return;

    const textData = Array.from(blocks).map(block => {
      const textEl = block.querySelector('.typewriter-text');
      const text = textEl.textContent.trim();
      textEl.textContent = ''; // clear initial text
      return { block, textEl, textArray: Array.from(text) };
    });

    let currentBlockIndex = 0;

    function playNextBlock() {
      if (currentBlockIndex >= textData.length) return;

      const current = textData[currentBlockIndex];
      current.block.classList.add('is-active');
      current.textEl.classList.add('is-typing');

      let charIndex = 0;

      function typeNextChar() {
        if (charIndex < current.textArray.length) {
          current.textEl.textContent += current.textArray[charIndex];
          charIndex++;
          
          const speed = 40 + Math.random() * 50; // 40-90ms
          setTimeout(typeNextChar, speed);
        } else {
          current.textEl.classList.remove('is-typing');
          currentBlockIndex++;
          setTimeout(playNextBlock, 600); // pause before next block
        }
      }

      typeNextChar();
    }

    setTimeout(playNextBlock, 600);
  }

  return { init };
})();

// ============================================================
// 8. CAKE WISH BUTTON (cake.html)
// ============================================================

const CakeWish = (() => {
  function init() {
    const btn = document.getElementById('btn-make-wish');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Remove spotlight and bounce
      const cake = document.getElementById('birthday-cake');
      if (cake) {
        cake.classList.remove('spotlight-active');
        cake.classList.add('wish-made');
      }

      // Trigger confetti using canvas-confetti
      if (typeof confetti === 'function') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D4A855', '#FFFFFF', '#FF3366', '#3366FF']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D4A855', '#FFFFFF', '#FF3366', '#3366FF']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    });
  }

  return { init };
})();

// ============================================================
// 9. VIDEO TABS (chibi.html)
// ============================================================

const VideoTabs = (() => {
  function init() {
    const tabs = document.querySelectorAll('.video-tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        // Hide all and pause
        document.querySelectorAll('.videos-container .video-wrapper').forEach(wrapper => {
          wrapper.style.display = 'none';
          const video = wrapper.querySelector('video');
          if (video) {
            video.pause();
          }
        });

        // Show target
        const targetId = tab.getAttribute('data-target');
        const targetWrapper = document.getElementById(targetId);
        if (targetWrapper) {
          targetWrapper.style.display = 'block';
        }
      });
    });
  }

  return { init };
})();

// ============================================================
// 10. BACKGROUND AUDIO (app.html)
// ============================================================

const BgAudio = (() => {
  function init() {
    const audio   = document.getElementById('bg-audio');
    const btnMute = document.getElementById('btn-music');
    const splash  = document.getElementById('splash-overlay');
    const btnStart = document.getElementById('btn-start');

    if (!audio) return;

    let muted = false;

    // ── Splash "Commencer" button ─────────────────────────────
    if (btnStart && splash) {
      btnStart.addEventListener('click', () => {
        // Start audio — this click satisfies browser autoplay policy
        audio.volume = 0.6;
        audio.play().catch(() => {});

        // Fade out and remove splash
        splash.classList.add('hidden');
        setTimeout(() => {
          splash.style.display = 'none';
        }, 650);
      });
    }

    // ── Music mute toggle (🎵/🔇) ────────────────────────────
    if (btnMute) {
      btnMute.addEventListener('click', (e) => {
        e.stopPropagation();
        muted = !muted;
        audio.muted = muted;
        btnMute.textContent = muted ? '🔇' : '🎵';
        btnMute.classList.toggle('is-muted', muted);

        // If audio not started yet, start it now
        if (!muted && audio.paused) {
          audio.volume = 0.6;
          audio.play().catch(() => {});
        }
      });
    }
  }

  return { init };
})();

// ============================================================
// 11. SPA ROUTER (app.html)
// ============================================================

const SpaRouter = (() => {
  const PAGES = ['app.html', 'text.html', 'cake.html', 'letter.html', 'chibi.html'];

  function getPageContent() { return document.getElementById('page-content'); }
  function getDots()        { return document.querySelectorAll('#page-nav .dot'); }

  function updateDots(pageIndex) {
    getDots().forEach((dot, i) => {
      dot.classList.toggle('dot--active', i === pageIndex);
    });
  }

  function attachLinkInterceptors() {
    const content = getPageContent();
    if (!content) return;
    content.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Intercept only internal page links
      if (PAGES.some(p => href === p || href.endsWith('/' + p))) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          navigate(href);
        });
      }
    });
  }

  async function navigate(url, pushState = true) {
    const pageName = url.split('/').pop() || 'index.html';
    const pageIndex = PAGES.indexOf(pageName);
    const content = getPageContent();
    if (!content) return;

    // Fade out
    content.classList.add('fading');

    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const main = doc.querySelector('main');
      if (!main) return;

      // Small pause for fade effect
      await new Promise(r => setTimeout(r, 220));

      // Swap content
      content.innerHTML = main.outerHTML;
      content.classList.remove('fading');

      // Update nav dots
      updateDots(pageIndex);

      // Push browser history
      if (pushState) {
        history.pushState({ page: pageName, index: pageIndex }, '', pageName);
      }

      // Re-init page-specific modules
      initPage(pageName);

      // Re-attach link interceptors on new content
      attachLinkInterceptors();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

    } catch (err) {
      console.error('Navigation failed:', err);
      content.classList.remove('fading');
    }
  }

  function init() {
    if (!document.getElementById('page-content')) return;

    // Always load the welcome page (app.html) into #page-content on start.
    // Never change the URL — user stays on index.html the entire time.
    navigate('app.html', false);

    // Handle browser back / forward
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'app.html';
      navigate(page, false);
    });
  }

  return { init, navigate };
})();

// ============================================================
// PAGE-SPECIFIC INIT — called after each navigation
// ============================================================

function initPage(pageName) {
  // Modules that are safe to call on any page (they check for their elements)
  ScrollReveal.init();
  initScrollIndicator();
  VideoPlayer.init();
  VideoTabs.init();

  // Page-specific
  switch (pageName) {
    case 'text.html':
      TextPageTypewriter.init();
      break;
    case 'cake.html':
      CakeWish.init();
      break;
    case 'letter.html':
      PetalTypewriter.init();
      break;
    case 'chibi.html':
      // already inited above via VideoPlayer / VideoTabs
      break;
  }
}

// ============================================================
// INIT — run everything on DOMContentLoaded
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  PetalManager.init();
  AudioPlayer.init();   // no-op if no audio-element on page
  BgAudio.init();       // background audio for app.html
  SpaRouter.init();     // SPA navigation (only runs if #page-content exists)

  // Fallback: init page modules for standalone pages (index.html, etc.)
  if (!document.getElementById('page-content')) {
    VideoPlayer.init();
    ScrollReveal.init();
    initScrollIndicator();
    PetalTypewriter.init();
    TextPageTypewriter.init();
    CakeWish.init();
    VideoTabs.init();
  }
});

