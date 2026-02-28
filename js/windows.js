/* windows.js — 窗口管理系统（使用 xp.css 库类名） */
const WM = (function () {
  let zTop = 100;
  const wins = {};

  /* ── 创建窗口 ── */
  function create(opts) {
    const {
      id, title, icon = '',
      width = 640, height = 480,
      x, y,
      content = '',
      resizable = true,
      menubar = '',
      toolbar = '',
      addressbar = '',
      statusbar = '',
      statusText = ''
    } = opts;

    if (wins[id]) { focus(id); return; }

    const cx = x !== undefined ? x : Math.max(20, Math.random() * (window.innerWidth  - width  - 40));
    const cy = y !== undefined ? y : Math.max(20, Math.random() * (window.innerHeight - height - 80));

    const win = document.createElement('div');
    win.className = 'window';
    win.id = 'win-' + id;
    win.style.cssText = `left:${cx}px;top:${cy}px;width:${width}px;height:${height}px;z-index:${++zTop};`;

    const menubarHtml    = menubar    ? `<div class="xp-menubar">${menubar}</div>` : '';
    const toolbarHtml    = toolbar    ? `<div class="xp-toolbar">${toolbar}</div>` : '';
    const addressbarHtml = addressbar ? `<div class="xp-addressbar">${addressbar}</div>` : '';
    const statusbarHtml  = statusbar  ? `<div class="status-bar">${statusbar}</div>`
                         : statusText ? `<div class="status-bar"><p class="status-bar-field">${statusText}</p></div>` : '';

    win.innerHTML = `
      <div class="title-bar" id="tb-${id}">
        <div class="title-bar-text">${icon ? icon + ' ' : ''}${title}</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onclick="WM.minimize('${id}')"></button>
          <button aria-label="Maximize" onclick="WM.toggleMaximize('${id}')"></button>
          <button aria-label="Close"    onclick="WM.close('${id}')"></button>
        </div>
      </div>
      ${menubarHtml}${toolbarHtml}${addressbarHtml}
      <div class="window-body" id="wb-${id}">${content}</div>
      ${statusbarHtml}
      ${resizable ? '<div class="win-resize" id="wr-' + id + '"></div>' : ''}
    `;

    document.getElementById('windows-container').appendChild(win);

    // 标记所有其他窗口为非活动
    Object.keys(wins).forEach(k => setInactive(k));

    wins[id] = { el: win, minimized: false, maximized: false, savedRect: null };

    // 拖拽
    initDrag(id);
    // 调整大小
    if (resizable) initResize(id);
    // 点击聚焦
    win.addEventListener('mousedown', () => focus(id));

    // 任务栏按钮
    addTaskbarBtn(id, icon, title);

    return win;
  }

  /* ── 聚焦 ── */
  function focus(id) {
    if (!wins[id]) return;
    Object.keys(wins).forEach(k => setInactive(k));
    wins[id].el.style.zIndex = ++zTop;
    wins[id].el.classList.add('active-window');
    document.getElementById('tb-' + id).classList.remove('inactive');
    // 任务栏按钮高亮
    document.querySelectorAll('.taskbar-btn').forEach(b => b.classList.remove('active-task'));
    const btn = document.getElementById('tbtn-' + id);
    if (btn) btn.classList.add('active-task');
  }

  function setInactive(id) {
    if (!wins[id]) return;
    wins[id].el.classList.remove('active-window');
    const tb = document.getElementById('tb-' + id);
    if (tb) tb.classList.add('inactive');
  }

  /* ── 关闭 ── */
  function close(id) {
    if (!wins[id]) return;
    wins[id].el.remove();
    delete wins[id];
    const btn = document.getElementById('tbtn-' + id);
    if (btn) btn.remove();
    // 通知 app（如音乐播放器）
    if (typeof MusicPlayer !== 'undefined' && id === 'music') MusicPlayer.onWindowClose();
  }

  /* ── 最小化 ── */
  function minimize(id) {
    if (!wins[id] || wins[id].minimized) return;
    const el = wins[id].el;
    el.classList.add('minimizing');
    setTimeout(() => {
      el.style.display = 'none';
      el.classList.remove('minimizing');
      wins[id].minimized = true;
    }, 200);
    const btn = document.getElementById('tbtn-' + id);
    if (btn) btn.classList.remove('active-task');
  }

  /* ── 还原 ── */
  function restore(id) {
    if (!wins[id]) return;
    const el = wins[id].el;
    el.style.display = '';
    el.classList.add('restoring');
    setTimeout(() => el.classList.remove('restoring'), 200);
    wins[id].minimized = false;
    focus(id);
  }

  /* ── 最大化/还原 ── */
  function toggleMaximize(id) {
    if (!wins[id]) return;
    const w = wins[id];
    const el = w.el;
    if (!w.maximized) {
      w.savedRect = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
      el.style.left = '0'; el.style.top = '0';
      el.style.width = '100%'; el.style.height = 'calc(100vh - 30px)';
      w.maximized = true;
    } else {
      Object.assign(el.style, w.savedRect);
      w.maximized = false;
    }
    focus(id);
  }

  /* ── 任务栏按钮 ── */
  function addTaskbarBtn(id, icon, title) {
    const btn = document.createElement('button');
    btn.className = 'taskbar-btn active-task';
    btn.id = 'tbtn-' + id;
    btn.innerHTML = `<span>${icon}</span><span>${title}</span>`;
    btn.onclick = () => {
      if (wins[id] && wins[id].minimized) restore(id);
      else if (wins[id]) focus(id);
    };
    document.getElementById('taskbar-buttons').appendChild(btn);
  }

  /* ── 拖拽 ── */
  function initDrag(id) {
    const tb = document.getElementById('tb-' + id);
    const el = wins[id].el;
    let ox, oy;
    tb.addEventListener('mousedown', e => {
      if (e.target.tagName === 'BUTTON') return;
      focus(id);
      ox = e.clientX - el.offsetLeft;
      oy = e.clientY - el.offsetTop;
      const onMove = e => {
        if (wins[id] && wins[id].maximized) return;
        el.style.left = (e.clientX - ox) + 'px';
        el.style.top  = Math.max(0, e.clientY - oy) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* ── 调整大小 ── */
  function initResize(id) {
    const handle = document.getElementById('wr-' + id);
    if (!handle) return;
    const el = wins[id].el;
    handle.addEventListener('mousedown', e => {
      e.stopPropagation();
      const sx = e.clientX, sy = e.clientY;
      const sw = el.offsetWidth, sh = el.offsetHeight;
      const onMove = e => {
        el.style.width  = Math.max(280, sw + e.clientX - sx) + 'px';
        el.style.height = Math.max(180, sh + e.clientY - sy) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  return { create, close, focus, minimize, restore, toggleMaximize };
})();
