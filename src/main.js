// import Phaser from 'phaser';
// import { GameConfig } from './data/gameConfig.js';
// import { PreloadScene } from './scenes/PreloadScene.js';
// import { IntroScene } from './scenes/IntroScene.js';
// import { HomeScene } from './scenes/HomeScene.js';
// import { TempleScene } from './scenes/TempleScene.js';
// import { ShardScene } from './scenes/ShardScene.js';
// import { EnemyScene } from './scenes/EnemyScene.js';
// import { DreamScene } from './scenes/DreamScene.js';
// import { FinalScene } from './scenes/FinalScene.js';
// import { EpilogueScene } from './scenes/EpilogueScene.js';
// import { Level1Scene } from './scenes/Level1Scene.js';
// import { Level2Scene } from './scenes/Level2Scene.js';
// import { Level3Scene } from './scenes/Level3Scene.js';
// import { Level4Scene } from './scenes/Level4Scene.js';
// import { Level5Scene } from './scenes/Level5Scene.js';
// import { GameOverScene } from './scenes/GameOverScene.js';
// import { VictoryScene } from './scenes/VictoryScene.js';

// const scenes = [
//   PreloadScene,
//   IntroScene,
//   HomeScene,
//   TempleScene,
//   ShardScene,
//   EnemyScene,
//   DreamScene,
//   FinalScene,
//   EpilogueScene,
//   Level1Scene,
//   Level2Scene,
//   Level3Scene,
//   Level4Scene,
//   Level5Scene,
//   GameOverScene,
//   VictoryScene
// ];

// class Game extends Phaser.Game {
//   constructor() {
//     super({ 
//       ...GameConfig, 
//       scene: scenes
//     });

//     // IMPROVED: Automatically request fullscreen on game start
//     this.requestFullscreenOnStart();
//   }

//   requestFullscreenOnStart() {
//     const goFullscreen = () => {
//       const gameContainer = document.getElementById('game-container');
      
//       // Try different fullscreen methods for better compatibility
//       if (gameContainer) {
//         const requestFullscreen = 
//           gameContainer.requestFullscreen ||
//           gameContainer.webkitRequestFullscreen ||
//           gameContainer.mozRequestFullScreen ||
//           gameContainer.msRequestFullscreen;
        
//         if (requestFullscreen) {
//           requestFullscreen.call(gameContainer).catch(err => {
//             console.log('Fullscreen request failed:', err);
//           });
//         }
//       }
      
//       // Lock orientation to landscape on mobile
//       if (screen.orientation && screen.orientation.lock) {
//         screen.orientation.lock('landscape').catch(err => {
//           console.log('Orientation lock not supported:', err);
//         });
//       }
      
//       // Remove listeners after first call
//       window.removeEventListener('pointerdown', goFullscreen);
//       window.removeEventListener('touchstart', goFullscreen);
//       window.removeEventListener('click', goFullscreen);
//     };
    
//     // Wait for user interaction (required by browsers)
//     window.addEventListener('pointerdown', goFullscreen, { once: true });
//     window.addEventListener('touchstart', goFullscreen, { once: true });
//     window.addEventListener('click', goFullscreen, { once: true });
//   }
// }

// window.addEventListener('load', () => {
//   new Game();
// });

import Phaser from 'phaser';
import { GameConfig } from './data/gameConfig.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { HomeScene } from './scenes/HomeScene.js';
import { TempleScene } from './scenes/TempleScene.js';
import { ShardScene } from './scenes/ShardScene.js';
import { EnemyScene } from './scenes/EnemyScene.js';
import { DreamScene } from './scenes/DreamScene.js';
import { FinalScene } from './scenes/FinalScene.js';
import { EpilogueScene } from './scenes/EpilogueScene.js';
import { Level1Scene } from './scenes/Level1Scene.js';
import { Level2Scene } from './scenes/Level2Scene.js';
import { Level3Scene } from './scenes/Level3Scene.js';
import { Level4Scene } from './scenes/Level4Scene.js';
import { Level5Scene } from './scenes/Level5Scene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

const scenes = [
  PreloadScene,
  IntroScene,
  HomeScene,
  TempleScene,
  ShardScene,
  EnemyScene,
  DreamScene,
  FinalScene,
  EpilogueScene,
  Level1Scene,
  Level2Scene,
  Level3Scene,
  Level4Scene,
  Level5Scene,
  GameOverScene,
  VictoryScene
];

class Game extends Phaser.Game {
  constructor() {
    super({ 
      ...GameConfig, 
      scene: scenes
    });

    // Fullscreen handled by mobile overlay in PreloadScene
    // Keep method available for manual triggering if needed
    this.requestFullscreenOnStart();
  }

  requestFullscreenOnStart() {
    const goFullscreen = () => {
      const gameContainer = document.getElementById('game-container');
      
      // Try different fullscreen methods for better compatibility
      if (gameContainer) {
        const requestFullscreen = 
          gameContainer.requestFullscreen ||
          gameContainer.webkitRequestFullscreen ||
          gameContainer.mozRequestFullScreen ||
          gameContainer.msRequestFullscreen;
        
        if (requestFullscreen) {
          requestFullscreen.call(gameContainer).catch(err => {
            console.log('Fullscreen request failed:', err);
          });
        }
      }
      
      // Lock orientation to landscape on mobile
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(err => {
          console.log('Orientation lock not supported:', err);
        });
      }
      
      // Remove listeners after first call
      window.removeEventListener('pointerdown', goFullscreen);
      window.removeEventListener('touchstart', goFullscreen);
      window.removeEventListener('click', goFullscreen);
    };
    
    // Wait for user interaction (required by browsers)
    window.addEventListener('pointerdown', goFullscreen, { once: true });
    window.addEventListener('touchstart', goFullscreen, { once: true });
    window.addEventListener('click', goFullscreen, { once: true });
  }
}

window.addEventListener('load', () => {
  new Game();
});

