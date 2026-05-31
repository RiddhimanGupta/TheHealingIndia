// js/ui.js
let _toastTimer;

export function initUI() {
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('out');
    document.getElementById('app')?.classList.add('show');
  }, 1000);
  initNavbarScroll();
}

export function go(tab) {
  document.querySelectorAll('.screen, .ni').forEach(el => el.classList.remove('on'));
  document.getElementById('screen-' + tab)?.classList.add('on');
  document.getElementById('ni-' + tab)?.classList.add('on');
  document.querySelector('nav')?.classList.remove('nav-hidden');
}

export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.classList.add('show');
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function initNavbarScroll() {
  const navbar = document.querySelector('nav');
  let lastScrollY = 0;

  document.querySelectorAll('.screen').forEach(screen => {
    screen.addEventListener('scroll', (e) => {
      const currentScrollY = e.target.scrollTop;
      if (Math.abs(currentScrollY - lastScrollY) < 12) return;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        navbar?.classList.add('nav-hidden'); 
      } else {
        navbar?.classList.remove('nav-hidden'); 
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  });
}
