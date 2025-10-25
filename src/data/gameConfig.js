// export const GameConfig = {
//   type: Phaser.AUTO,
//   width: 960,
//   height: 540,
//   parent: 'game-container',
//   backgroundColor: '#222',
//   scale: {
//     mode: Phaser.Scale.FIT, // Scale to fit screen
//     autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
//     width: 960,
//     height: 540,
//     fullscreenTarget: 'game-container' // Enable fullscreen on this element
//   },
//   physics: {
//     default: 'arcade',
//     arcade: { 
//       gravity: { y: 600 }, 
//       debug: true, // Disable debug for cleaner fullscreen view
//     }
//   },
//   // Add input configuration for touch support
//   input: {
//     activePointers: 3,
//     touch: { capture: true }
//   }
// };


export const GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  backgroundColor: '#222',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
    fullscreenTarget: 'game-container',
    // Add orientation lock
    orientation: Phaser.Scale.LANDSCAPE
  },
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { y: 600 }, 
      debug: false,
    }
  },
  input: {
    activePointers: 3,
    touch: { capture: true }
  }
};