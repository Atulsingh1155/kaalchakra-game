export function isMobile() {
  const ua = navigator.userAgent || '';
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return touch && /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

export function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

export async function requestLandscapeFullscreen() {
  const container = document.getElementById('game-container') || document.documentElement;
  
  try {
    // FIXED: Always request fullscreen, even if already in fullscreen
    const requestFS = container.requestFullscreen || 
                      container.webkitRequestFullscreen || 
                      container.mozRequestFullScreen || 
                      container.msRequestFullscreen;
    
    if (requestFS) {
      // Exit fullscreen first if already in fullscreen to ensure proper re-entry
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        await exitFullscreen();
        // Small delay before re-entering
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await requestFS.call(container);
    }
    
    // Then lock orientation to landscape with retry logic
    if (screen.orientation && screen.orientation.lock) {
      let retries = 3;
      while (retries > 0) {
        try {
          await screen.orientation.lock('landscape');
          break;
        } catch (err) {
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
    }
  } catch (err) {
    console.log('Fullscreen request:', err);
  }
}

export function exitFullscreen() {
  const exitFS = document.exitFullscreen || 
                 document.webkitExitFullscreen || 
                 document.mozCancelFullScreen || 
                 document.msExitFullscreen;
  
  if (exitFS) {
    return exitFS.call(document);
  }
  return Promise.resolve();
}