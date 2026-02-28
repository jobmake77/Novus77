/* main.js — 全局交互：开始菜单、桌面点击 */

/* 开始菜单切换 */
window.toggleStartMenu = function () {
  const menu = document.getElementById('start-menu');
  const isHidden = menu.style.display === 'none' || !menu.style.display;
  menu.style.display = isHidden ? 'block' : 'none';
};

/* 点击桌面关闭开始菜单 */
document.addEventListener('click', function (e) {
  const menu     = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if (!menu || !startBtn) return;
  if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

/* 桌面图标 —— 单击选中 */
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('click', function (e) {
    document.querySelectorAll('.desktop-icon').forEach(i =>
      i.classList.remove('selected'));
    this.classList.add('selected');
    e.stopPropagation();
  });
});

/* 点击桌面空白取消选中 */
document.getElementById('desktop')?.addEventListener('click', function (e) {
  if (e.target === this || e.target.id === 'desktop') {
    document.querySelectorAll('.desktop-icon').forEach(i =>
      i.classList.remove('selected'));
  }
});

/* 桌面图标选中样式注入（避免额外 CSS 文件） */
const style = document.createElement('style');
style.textContent = `
  .desktop-icon.selected {
    background: rgba(49, 106, 197, 0.5);
    outline: 1px dashed rgba(255,255,255,0.8);
  }
`;
document.head.appendChild(style);
