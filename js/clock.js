/* clock.js — 任务栏时钟 */
function updateClock() {
  const el = document.getElementById('tray-clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const date = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
  el.innerHTML = `${h}:${m}<br><span style="font-size:10px">${date}</span>`;
}

setInterval(updateClock, 1000);
updateClock();
