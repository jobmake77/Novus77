/* apps.js — 5个应用的内容定义与打开逻辑 */

/* ================================================
   数据 — 请在这里填入您的真实信息
   ================================================ */
const DATA = {
  about: {
    name:   'Novus77',
    title:  'Developer / Creator',
    bio:    '你好！我是 Novus77，一名热爱技术与创意的开发者。' +
            '我专注于构建有趣、有用的数字产品，享受把想法变成现实的过程。',
    specs: [
      { label: '所在地',   value: '中国' },
      { label: '身份',     value: 'Developer & Creator' },
      { label: '域名',     value: 'Novus77.com' },
      { label: '兴趣爱好', value: '编程、音乐、设计' },
    ],
    skills: [
      { name: 'HTML/CSS',   pct: 90 },
      { name: 'JavaScript', pct: 85 },
      { name: 'React',      pct: 75 },
      { name: 'Node.js',    pct: 70 },
      { name: 'Python',     pct: 65 },
      { name: 'UI/UX',      pct: 80 },
    ],
  },

  projects: [
    {
      id:    'proj1',
      icon:  '🌐',
      name:  'Novus77.com',
      desc:  '本网站 — 仿 Windows XP 风格个人主页',
      tags:  ['HTML', 'CSS', 'JavaScript'],
      detail:'使用纯 HTML/CSS/JS 构建的仿 Windows XP 系统风格个人网站，包含完整的桌面体验、可拖拽窗口、音乐播放器等功能。',
      link:  'https://novus77.com',
    },
    {
      id:    'proj2',
      icon:  '⚙️',
      name:  '项目二',
      desc:  '在这里添加您的项目描述',
      tags:  ['Tag1', 'Tag2'],
      detail:'在这里填写项目的详细介绍。',
      link:  '#',
    },
    {
      id:    'proj3',
      icon:  '🎨',
      name:  '项目三',
      desc:  '在这里添加您的项目描述',
      tags:  ['Tag1', 'Tag2'],
      detail:'在这里填写项目的详细介绍。',
      link:  '#',
    },
    {
      id:    'proj4',
      icon:  '📱',
      name:  '项目四',
      desc:  '在这里添加您的项目描述',
      tags:  ['Tag1', 'Tag2'],
      detail:'在这里填写项目的详细介绍。',
      link:  '#',
    },
  ],

  resume: {
    name:    'Novus77',
    contact: '1432680433@qq.com  |  novus77.me  |  GitHub: github.com/jobmake77  |  X: @novus771',
    sections: [
      {
        title: '个人简介',
        entries: [{
          desc: '热爱技术与创意的开发者，专注于 Web 开发与用户体验设计。',
        }],
      },
      {
        title: '技能',
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Git', 'UI/UX Design', 'Figma'],
      },
      {
        title: '项目经历',
        entries: [
          {
            title:  'Novus77.com 个人网站',
            sub:    '独立开发  |  2024 — 至今',
            points: ['仿 Windows XP 界面设计', '实现可拖拽窗口管理系统', '内置音乐播放器、项目展示等功能'],
          },
          {
            title:  '项目二名称',
            sub:    '角色  |  时间',
            points: ['描述1', '描述2'],
          },
        ],
      },
      {
        title: '教育背景',
        entries: [
          {
            title: '您的学校',
            sub:   '专业  |  毕业年份',
            desc:  '在此描述教育背景。',
          },
        ],
      },
    ],
  },

  contact: {
    items: [
      { icon: '✉️', label: '邮箱', value: '<a href="mailto:1432680433@qq.com">1432680433@qq.com</a>' },
      { icon: '🐙', label: 'GitHub', value: '<a href="https://github.com/jobmake77" target="_blank" rel="noreferrer">github.com/jobmake77</a>' },
      { icon: '🐦', label: 'Twitter/X', value: '<a href="https://x.com/novus771" target="_blank" rel="noreferrer">@novus771</a>' },
      { icon: '🌐', label: '个人网站', value: '<a href="https://novus77.me" target="_blank" rel="noreferrer">novus77.me</a>' },
      { icon: '📍', label: '所在地', value: '中国' },
      { icon: '⏱️', label: '回复时间', value: '通常 24 小时内回复' },
    ],
  },
};

/* ================================================
   打开窗口入口
   ================================================ */
window.openWindow = function (id) {
  switch (id) {
    case 'about':   openAbout();   break;
    case 'projects':openProjects();break;
    case 'resume':  openResume();  break;
    case 'contact': openContact(); break;
    case 'music':   openMusic();   break;
    case 'recycle': openRecycle(); break;
  }
};

/* ================================================
   关于我
   ================================================ */
function openAbout() {
  const d = DATA.about;

  const specsHtml = d.specs.map(s =>
    `<div class="about-spec-label">${s.label}：</div><div class="about-spec-value">${s.value}</div>`
  ).join('');

  const skillsHtml = d.skills.map(s => `
    <div class="skill-row">
      <span>${s.name}</span>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" style="width:${s.pct}%"></div>
      </div>
      <span class="skill-pct">${s.pct}%</span>
    </div>`).join('');

  const content = `
    <div class="app-container" style="padding:12px">
      <div class="about-tabs">
        <div class="about-tab active" onclick="switchAboutTab(event,'general')">常规</div>
        <div class="about-tab" onclick="switchAboutTab(event,'skills')">技能</div>
      </div>

      <div id="about-general" class="about-tab-content active">
        <div class="about-header">
          <div class="about-avatar-wrap">
            <img src="assets/images/avatar.png" alt="" onerror="this.style.display='none'">
            <span style="font-size:40px;position:absolute">👤</span>
          </div>
          <div>
            <div class="about-name">${d.name}</div>
            <div class="about-title">${d.title}</div>
            <div class="about-bio">${d.bio}</div>
          </div>
        </div>
        <div class="about-specs">${specsHtml}</div>
      </div>

      <div id="about-skills" class="about-tab-content">
        <div class="skill-bars">${skillsHtml}</div>
      </div>
    </div>`;

  WM.create({
    id: 'about', title: '关于 Novus77', icon: '🖥️',
    width: 480, height: 360, content,
    menubar: `<span class="xp-menu-item">文件</span><span class="xp-menu-item">帮助</span>`,
    statusbar: `<div class="xp-statusbar-panel">Novus77.com</div>`,
  });
}

window.switchAboutTab = function (e, tabId) {
  const tabs = document.querySelectorAll('.about-tab');
  const contents = document.querySelectorAll('.about-tab-content');
  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('about-' + tabId)?.classList.add('active');
};

/* ================================================
   我的项目
   ================================================ */
function openProjects() {
  const cardsHtml = DATA.projects.map(p => `
    <div class="project-card" onclick="showProjectDetail('${p.id}')">
      <div class="project-card-icon">${p.icon}</div>
      <div class="project-card-name">${p.name}</div>
      <div class="project-card-desc">${p.desc}</div>
    </div>`).join('');

  const content = `
    <div class="explorer-layout">
      <div class="explorer-sidebar">
        <div class="explorer-sidebar-title">文件夹</div>
        <div class="explorer-sidebar-item active" onclick="showProjectsGrid()">
          <span>📁</span> 所有项目
        </div>
      </div>
      <div class="explorer-main" id="projects-main">
        <div class="explorer-grid" id="projects-grid">${cardsHtml}</div>
      </div>
    </div>`;

  WM.create({
    id: 'projects', title: '我的项目', icon: '📁',
    width: 720, height: 480, content,
    menubar: `<span class="xp-menu-item">文件</span><span class="xp-menu-item">编辑</span><span class="xp-menu-item">查看</span>`,
    toolbar: `
      <button class="xp-toolbar-btn" onclick="showProjectsGrid()">⬅ 后退</button>
      <div class="xp-toolbar-sep"></div>
      <button class="xp-toolbar-btn">🔍 搜索</button>`,
    addressbar: `
      <span class="xp-addressbar-label">地址</span>
      <input class="xp-addressbar-input" value="C:\\Users\\Novus77\\Projects" readonly>`,
    statusbar: `<div class="xp-statusbar-panel">${DATA.projects.length} 个项目</div>`,
  });
}

window.showProjectDetail = function (projId) {
  const p = DATA.projects.find(x => x.id === projId);
  if (!p) return;
  const tagsHtml = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
  const main = document.getElementById('projects-main');
  if (!main) return;
  main.innerHTML = `
    <div class="project-detail">
      <div class="project-detail-title">${p.icon} ${p.name}</div>
      <div class="project-detail-tags">${tagsHtml}</div>
      <div class="project-detail-desc">${p.detail}</div>
      <a class="project-link" href="${p.link}" target="_blank">🔗 访问项目</a>
    </div>`;
};

window.showProjectsGrid = function () {
  const cardsHtml = DATA.projects.map(p => `
    <div class="project-card" onclick="showProjectDetail('${p.id}')">
      <div class="project-card-icon">${p.icon}</div>
      <div class="project-card-name">${p.name}</div>
      <div class="project-card-desc">${p.desc}</div>
    </div>`).join('');
  const main = document.getElementById('projects-main');
  if (!main) return;
  main.innerHTML = `<div class="explorer-grid">${cardsHtml}</div>`;
};

/* ================================================
   简历
   ================================================ */
function openResume() {
  const r = DATA.resume;

  function renderSection(s) {
    if (s.skills) {
      return `
        <div class="resume-section">
          <div class="resume-section-title">${s.title}</div>
          <div class="resume-skills-list">
            ${s.skills.map(sk => `<span class="resume-skill-chip">${sk}</span>`).join('')}
          </div>
        </div>`;
    }
    const entries = (s.entries || []).map(e => `
      <div class="resume-entry">
        ${e.title ? `<div class="resume-entry-header"><span>${e.title}</span>${e.date ? `<span>${e.date}</span>` : ''}</div>` : ''}
        ${e.sub   ? `<div class="resume-entry-sub">${e.sub}</div>` : ''}
        ${e.desc  ? `<div class="resume-entry-desc">${e.desc}</div>` : ''}
        ${e.points ? `<div class="resume-entry-desc"><ul>${e.points.map(p=>`<li>${p}</li>`).join('')}</ul></div>` : ''}
      </div>`).join('');
    return `
      <div class="resume-section">
        <div class="resume-section-title">${s.title}</div>
        ${entries}
      </div>`;
  }

  const content = `
    <div class="resume-viewer">
      <div class="resume-page">
        <div class="resume-header">
          <div class="resume-name">${r.name}</div>
          <div class="resume-contact">${r.contact}</div>
        </div>
        ${r.sections.map(renderSection).join('')}
      </div>
    </div>`;

  WM.create({
    id: 'resume', title: '简历 — Novus77', icon: '📄',
    width: 680, height: 520, content,
    menubar: `<span class="xp-menu-item">文件</span><span class="xp-menu-item">查看</span><span class="xp-menu-item">打印</span>`,
    toolbar: `
      <button class="xp-toolbar-btn" onclick="window.print()">🖨️ 打印</button>
      <div class="xp-toolbar-sep"></div>
      <button class="xp-toolbar-btn">🔍 缩放</button>`,
    statusbar: `<div class="xp-statusbar-panel">第 1 页，共 1 页</div>`,
  });
}

/* ================================================
   联系方式
   ================================================ */
function openContact() {
  const itemsHtml = DATA.contact.items.map(item => `
    <div class="contact-item">
      <div class="contact-item-icon">${item.icon}</div>
      <div>
        <div class="contact-item-label">${item.label}</div>
        <div class="contact-item-value">${item.value}</div>
      </div>
    </div>`).join('');

  const content = `
    <div class="contact-outlook">
      <div class="contact-toolbar">
        <div class="contact-tool-btn">
          <span class="btn-icon">✉️</span>发邮件
        </div>
        <div class="contact-tool-btn">
          <span class="btn-icon">🔗</span>社交
        </div>
      </div>
      <div class="contact-body">
        <div class="contact-folders">
          <div class="contact-folder-title">联系我</div>
          <div class="contact-folder-item active"><span>📥</span> 收件箱</div>
          <div class="contact-folder-item"><span>📤</span> 已发送</div>
          <div class="contact-folder-item"><span>⭐</span> 收藏</div>
        </div>
        <div class="contact-main">
          <div class="contact-info-panel">
            <div class="contact-info-title">📬 联系 Novus77</div>
            ${itemsHtml}
          </div>
        </div>
      </div>
    </div>`;

  WM.create({
    id: 'contact', title: 'Outlook Express — 联系方式', icon: '✉️',
    width: 560, height: 400, content,
    menubar: `<span class="xp-menu-item">文件</span><span class="xp-menu-item">查看</span><span class="xp-menu-item">工具</span>`,
    statusbar: `<div class="xp-statusbar-panel">就绪</div>`,
  });
}

/* ================================================
   音乐播放器（由 music.js 接管）
   ================================================ */
function openMusic() {
  MusicPlayer.open();
}

/* ================================================
   回收站
   ================================================ */
function openRecycle() {
  WM.create({
    id: 'recycle', title: '回收站', icon: '🗑️',
    width: 400, height: 300,
    content: `<div style="padding:20px;text-align:center;color:#666;font-size:13px;">
      <div style="font-size:48px;margin-bottom:12px;">🗑️</div>
      <div>回收站是空的</div>
    </div>`,
    statusText: '0 个对象',
  });
}
