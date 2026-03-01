/* music.js — Windows Media Player 风格音乐播放器 */
const MusicPlayer = (function () {

  /* ================================================
     播放列表 — 将您的音乐文件放入 assets/music/
     格式: { title, artist, src, duration }
     ================================================ */
  const playlist = [
    {
      title:    'Treehouse',
      artist:   'Beakers',
      src:      'assets/music/Beakers - Treehouse.mp3',
      duration: '?',
    },
    {
      title:    'Luv (Sic)',
      artist:   'Nujabes',
      src:      'assets/music/Nujabes_-_Luv_(Sic).flac',
      duration: '4:46',
    },
    {
      title:    'Luv(sic.) Part 3 (feat. Shing02)',
      artist:   'Nujabes, Shing02',
      src:      'assets/music/Nujabes;_Shing02_-_Luv(sic.)_Part_3_(feat._Shing02).flac',
      duration: '5:36',
    },
  ];

  let currentIndex = 0;
  let isPlaying    = false;
  let audio        = new Audio();
  let vizInterval  = null;

  /* ---- 主面板 HTML ---- */
  function buildHTML() {
    const playlistHtml = playlist.map((t, i) => `
      <div class="music-playlist-item${i === 0 ? ' playing' : ''}"
           id="pl-item-${i}" onclick="MusicPlayer.playTrack(${i})">
        <div class="music-playlist-num">${i === 0 ? '▶' : i + 1}</div>
        <div class="music-playlist-info">
          <div class="music-playlist-name">${t.title}</div>
          <div class="music-playlist-artist">${t.artist}</div>
        </div>
        <div class="music-playlist-duration">${t.duration}</div>
      </div>`).join('');

    return `
      <div class="music-player">
        <!-- 可视化 -->
        <div class="music-visualizer" id="music-viz">
          ${Array(32).fill(0).map((_, i) =>
            `<div class="viz-bar" id="vb-${i}" style="height:4px"></div>`
          ).join('')}
        </div>

        <!-- 曲目信息 -->
        <div class="music-track-info">
          <div class="music-track-title" id="mp-title">${playlist[0].title}</div>
          <div class="music-track-artist" id="mp-artist">${playlist[0].artist}</div>
        </div>

        <!-- 进度条 -->
        <div class="music-progress-wrap">
          <div class="music-progress-bar" id="mp-progress-bar">
            <div class="music-progress-fill" id="mp-progress"></div>
            <div class="music-progress-thumb" id="mp-progress-thumb"></div>
          </div>
          <div class="music-time">
            <span id="mp-current">0:00</span>
            <span id="mp-total">${playlist[0].duration}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="music-controls">
          <button class="music-btn" title="随机" onclick="MusicPlayer.toggleShuffle()">🔀</button>
          <button class="music-btn" title="上一首" onclick="MusicPlayer.prev()">⏮</button>
          <button class="music-btn play-btn" id="mp-play-btn" onclick="MusicPlayer.togglePlay()">▶</button>
          <button class="music-btn" title="下一首" onclick="MusicPlayer.next()">⏭</button>
          <button class="music-btn" title="循环" onclick="MusicPlayer.toggleLoop()">🔁</button>
        </div>

        <!-- 音量 -->
        <div class="music-volume-wrap">
          <span class="music-volume-icon">🔈</span>
          <div class="music-volume-bar" id="mp-vol-bar">
            <div class="music-volume-fill" id="mp-vol-fill"></div>
            <div class="music-volume-thumb" id="mp-vol-thumb"></div>
          </div>
          <span class="music-volume-icon">🔊</span>
        </div>

        <!-- 播放列表 -->
        <div class="music-playlist">
          <div class="music-playlist-header">
            <span style="flex:1">曲目</span>
            <span>时长</span>
          </div>
          ${playlistHtml}
        </div>
      </div>`;
  }

  /* ---- 打开窗口 ---- */
  function open() {
    WM.create({
      id:      'music',
      title:   'Windows Media Player',
      icon:    '🎵',
      width:   420,
      height:  520,
      content: buildHTML(),
      menubar: `
        <span class="xp-menu-item">文件</span>
        <span class="xp-menu-item">视图</span>
        <span class="xp-menu-item">播放</span>
        <span class="xp-menu-item">工具</span>`,
      statusbar: `<div class="xp-statusbar-panel" id="mp-status">就绪</div>`,
    });

    initAudio();
  }

  /* ---- 音频初始化 ---- */
  function initAudio() {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended',      () => next());
    audio.volume = 0.7;
    setTrack(currentIndex, false);
    initProgressDrag();
    initVolumeDrag();
  }

  /* ---- 进度条拖拽 ---- */
  function initProgressDrag() {
    const bar = document.getElementById('mp-progress-bar');
    if (!bar) return;
    let dragging = false;

    function applySeek(e) {
      if (!audio.duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
      updateProgressUI(pct * 100);
    }

    bar.addEventListener('mousedown', e => { dragging = true; applySeek(e); });
    document.addEventListener('mousemove', e => { if (dragging) applySeek(e); });
    document.addEventListener('mouseup', () => { dragging = false; });
  }

  /* ---- 音量条拖拽 ---- */
  function initVolumeDrag() {
    const bar = document.getElementById('mp-vol-bar');
    if (!bar) return;
    let dragging = false;

    function applyVolume(e) {
      const rect = bar.getBoundingClientRect();
      const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = vol;
      updateVolumeUI(vol * 100);
    }

    bar.addEventListener('mousedown', e => { dragging = true; applyVolume(e); });
    document.addEventListener('mousemove', e => { if (dragging) applyVolume(e); });
    document.addEventListener('mouseup', () => { dragging = false; });

    // 初始显示
    updateVolumeUI(70);
  }

  function updateVolumeUI(pct) {
    const fill  = document.getElementById('mp-vol-fill');
    const thumb = document.getElementById('mp-vol-thumb');
    if (fill)  fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
  }

  /* ---- 设置曲目 ---- */
  function setTrack(index, autoplay) {
    currentIndex = index;
    const t = playlist[index];
    audio.src = t.src;

    const titleEl  = document.getElementById('mp-title');
    const artistEl = document.getElementById('mp-artist');
    const totalEl  = document.getElementById('mp-total');
    if (titleEl)  titleEl.textContent  = t.title;
    if (artistEl) artistEl.textContent = t.artist;
    if (totalEl)  totalEl.textContent  = t.duration;

    // 更新播放列表高亮
    playlist.forEach((_, i) => {
      const item = document.getElementById(`pl-item-${i}`);
      if (!item) return;
      item.classList.toggle('playing', i === index);
      item.querySelector('.music-playlist-num').textContent =
        i === index ? '▶' : i + 1;
    });

    // 状态栏
    const status = document.getElementById('mp-status');
    if (status) status.textContent = `正在播放: ${t.title} — ${t.artist}`;

    if (autoplay) {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayBtn();
        startViz();
      }).catch(() => {});
    }
  }

  /* ---- 播放/暂停 ---- */
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      stopViz();
    } else {
      audio.play().then(() => {
        isPlaying = true;
        startViz();
      }).catch(() => {});
    }
    updatePlayBtn();
  }

  function updatePlayBtn() {
    const btn = document.getElementById('mp-play-btn');
    if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
  }

  /* ---- 上一首 / 下一首 ---- */
  function prev() {
    const idx = (currentIndex - 1 + playlist.length) % playlist.length;
    setTrack(idx, isPlaying);
  }

  function next() {
    const idx = (currentIndex + 1) % playlist.length;
    setTrack(idx, isPlaying);
  }

  /* ---- 进度 ---- */
  function updateProgress() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    updateProgressUI(pct);
    const cur = document.getElementById('mp-current');
    if (cur) cur.textContent = formatTime(audio.currentTime);
  }

  function updateProgressUI(pct) {
    const fill  = document.getElementById('mp-progress');
    const thumb = document.getElementById('mp-progress-thumb');
    if (fill)  fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
  }

  function seek(e) {
    const bar = document.getElementById('mp-progress-bar');
    if (!bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  /* ---- 音量 ---- */
  function setVolume(e) {
    const bar = document.getElementById('mp-vol-bar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const vol  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = vol;
    updateVolumeUI(vol * 100);
  }

  /* ---- 随机 / 循环 ---- */
  let shuffleOn = false;
  let loopOn    = false;

  function toggleShuffle() {
    shuffleOn = !shuffleOn;
    const btn = document.querySelector('.music-btn[title="随机"]');
    if (btn) btn.style.color = shuffleOn ? '#00aaff' : '';
  }

  function toggleLoop() {
    loopOn = !loopOn;
    audio.loop = loopOn;
    const btn = document.querySelector('.music-btn[title="循环"]');
    if (btn) btn.style.color = loopOn ? '#00aaff' : '';
  }

  /* ---- 可视化（模拟频谱） ---- */
  function startViz() {
    stopViz();
    vizInterval = setInterval(() => {
      for (let i = 0; i < 32; i++) {
        const bar = document.getElementById(`vb-${i}`);
        if (!bar) continue;
        if (!isPlaying) { bar.style.height = '4px'; continue; }
        const h = Math.random() * 60 + 4;
        bar.style.height = h + 'px';
      }
    }, 100);
  }

  function stopViz() {
    clearInterval(vizInterval);
    vizInterval = null;
    for (let i = 0; i < 32; i++) {
      const bar = document.getElementById(`vb-${i}`);
      if (bar) bar.style.height = '4px';
    }
  }

  /* ---- 窗口关闭时暂停音乐 ---- */
  function onWindowClose() {
    audio.pause();
    isPlaying = false;
    stopViz();
  }

  /* ---- 公开 ---- */
  return {
    open,
    togglePlay,
    playTrack: (i) => setTrack(i, true),
    prev,
    next,
    seek,
    setVolume,
    toggleShuffle,
    toggleLoop,
    onWindowClose,
  };
})();
