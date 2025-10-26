export function isMobile() {
  const ua = navigator.userAgent || '';
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return touch && /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

export function requestLandscapeFullscreen() {
  return new Promise((resolve) => {
    const container = document.getElementById('game-container') || document.documentElement;

    const lockToLandscape = () => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {}).finally(resolve);
      } else {
        resolve();
      }
    };

    const req =
      container.requestFullscreen ||
      container.webkitRequestFullscreen ||
      container.mozRequestFullScreen ||
      container.msRequestFullscreen;

    if (req) {
      Promise.resolve(req.call(container)).catch(() => {}).finally(lockToLandscape);
    } else {
      lockToLandscape();
    }
  });
}