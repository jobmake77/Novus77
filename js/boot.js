/* boot.js — 启动流程控制 */
(function () {
  const BOOT_DURATION  = 3000;  // 启动动画时长 ms
  const LOGIN_DURATION = 500;   // 淡入登录屏幕

  // 预加载壁纸
  const wallpaper = new Image();
  wallpaper.src = 'assets/images/windows XP.jpg';

  function showLogin() {
    const boot  = document.getElementById('boot-screen');
    const login = document.getElementById('login-screen');

    boot.classList.add('fade-out');
    setTimeout(() => {
      boot.style.display = 'none';
      login.style.display = 'flex';
      login.classList.add('fade-in');
    }, LOGIN_DURATION);
  }

  function showDesktop() {
    const login   = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');

    function doShow() {
      login.classList.add('fade-out');
      setTimeout(() => {
        login.style.display = 'none';
        desktop.style.display = 'block';
        desktop.classList.add('fade-in');
      }, 400);
    }

    // 若壁纸已加载完成直接显示，否则等加载完再显示
    if (wallpaper.complete) {
      doShow();
    } else {
      wallpaper.onload = doShow;
      wallpaper.onerror = doShow; // 加载失败也继续
    }
  }

  // 启动完成后跳转登录页
  setTimeout(showLogin, BOOT_DURATION);

  // 点击用户头像登录
  document.getElementById('login-btn').addEventListener('click', showDesktop);

  // 关机
  window.handleShutdown = function () {
    const desktop  = document.getElementById('desktop');
    const shutdown = document.getElementById('shutdown-screen');
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = 'none';

    desktop.classList.add('fade-out');
    setTimeout(() => {
      desktop.style.display = 'none';
      shutdown.style.display = 'flex';
      shutdown.classList.add('fade-in');
    }, 400);
  };
})();
