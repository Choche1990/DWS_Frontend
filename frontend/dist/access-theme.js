(() => {
  const key = 'digital-workspace-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }
  function sync() {
    try {
      if (window.parent !== window) {
        apply(window.parent.document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        return;
      }
    } catch (_) {}
    let saved;
    try { saved = localStorage.getItem(key); } catch (_) {}
    apply(saved === 'dark' || saved === 'light' ? saved : media.matches ? 'dark' : 'light');
  }
  sync();
  try {
    if (window.parent !== window) {
      const observer = new MutationObserver(sync);
      observer.observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    }
  } catch (_) {}
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) sync(); });
  media.addEventListener('change', sync);
})();
