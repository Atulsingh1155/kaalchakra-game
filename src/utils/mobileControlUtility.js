// // export function createMobileControls(scene) {
// //   // Only create controls on touch devices
// //   if (!scene.sys.game.device.input.touch) return null;
  
// //   const controls = {
// //     left: false,
// //     right: false,
// //     up: false,
// //     shoot: false
// //   };
  
// //   // Create container for all buttons
// //   const controlsContainer = scene.add.container(0, 0);
// //   controlsContainer.setScrollFactor(0); // Fixed to camera

// //   // Control button styles
// //   const buttonStyle = {
// //     fontSize: '32px',
// //     backgroundColor: '#00000080',
// //     padding: { x: 20, y: 15 },
// //     fixedWidth: 80,
// //     fixedHeight: 80,
// //     align: 'center'
// //   };
  
// //   // Left button
// //   const leftButton = scene.add.text(100, 450, '←', buttonStyle)
// //     .setOrigin(0.5)
// //     .setInteractive();
  
// //   // Right button
// //   const rightButton = scene.add.text(200, 450, '→', buttonStyle)
// //     .setOrigin(0.5)
// //     .setInteractive();
  
// //   // Jump button
// //   const upButton = scene.add.text(860, 450, '↑', buttonStyle)
// //     .setOrigin(0.5)
// //     .setInteractive();
  
// //   // Action button (if needed)
// //   const shootButton = scene.add.text(760, 450, '⚡', buttonStyle)
// //     .setOrigin(0.5)
// //     .setInteractive();

// //   // Add buttons to container
// //   controlsContainer.add([leftButton, rightButton, upButton, shootButton]);
  
// //   // Set up input handlers
// //   leftButton.on('pointerdown', () => { controls.left = true; });
// //   leftButton.on('pointerup', () => { controls.left = false; });
// //   leftButton.on('pointerout', () => { controls.left = false; });
  
// //   rightButton.on('pointerdown', () => { controls.right = true; });
// //   rightButton.on('pointerup', () => { controls.right = false; });
// //   rightButton.on('pointerout', () => { controls.right = false; });
  
// //   upButton.on('pointerdown', () => { controls.up = true; });
// //   upButton.on('pointerup', () => { controls.up = false; });
// //   upButton.on('pointerout', () => { controls.up = false; });
  
// //   shootButton.on('pointerdown', () => { controls.shoot = true; });
// //   shootButton.on('pointerup', () => { controls.shoot = false; });
// //   shootButton.on('pointerout', () => { controls.shoot = false; });
  
// //   return { controls, container: controlsContainer };
// // }


// export function createMobileControls(scene, options = {}) {
//   // Only create controls on touch devices
//   if (!scene.sys.game.device.input.touch) return null;
  
//   const controls = {
//     left: false,
//     right: false,
//     up: false,
//     shoot: false
//   };
  
//   // Create invisible touch zones that cover the screen
//   const screenWidth = 960;
//   const screenHeight = 540;
  
//   // Left zone (left third of screen)
//   const leftZone = scene.add.zone(0, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Right zone (right third of screen)
//   const rightZone = scene.add.zone(screenWidth * 2/3, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Center zone (middle third for jumping)
//   const centerZone = scene.add.zone(screenWidth / 3, 0, screenWidth / 3, screenHeight * 0.7)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Visual indicators (semi-transparent)
//   const leftIndicator = scene.add.rectangle(
//     screenWidth / 6, screenHeight / 2, 
//     screenWidth / 3 - 20, screenHeight - 20,
//     0x0000FF, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const rightIndicator = scene.add.rectangle(
//     screenWidth * 5/6, screenHeight / 2,
//     screenWidth / 3 - 20, screenHeight - 20,
//     0xFF0000, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const centerIndicator = scene.add.rectangle(
//     screenWidth / 2, screenHeight * 0.35,
//     screenWidth / 3 - 20, screenHeight * 0.7 - 20,
//     0x00FF00, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   // Add labels
//   const leftLabel = scene.add.text(screenWidth / 6, 50, '◄ LEFT', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const rightLabel = scene.add.text(screenWidth * 5/6, 50, 'RIGHT ►', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const centerLabel = scene.add.text(screenWidth / 2, screenHeight / 2, '▲ JUMP', {
//     fontSize: '32px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 4
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   // Track active touches
//   const activeTouches = new Map();
  
//   // LEFT ZONE
//   leftZone.on('pointerdown', (pointer) => {
//     controls.left = true;
//     activeTouches.set(pointer.id, 'left');
//     leftIndicator.setAlpha(0.3);
//   });
  
//   leftZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'left') {
//       controls.left = false;
//       activeTouches.delete(pointer.id);
//       leftIndicator.setAlpha(0.1);
//     }
//   });
  
//   // RIGHT ZONE
//   rightZone.on('pointerdown', (pointer) => {
//     controls.right = true;
//     activeTouches.set(pointer.id, 'right');
//     rightIndicator.setAlpha(0.3);
//   });
  
//   rightZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'right') {
//       controls.right = false;
//       activeTouches.delete(pointer.id);
//       rightIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CENTER ZONE (JUMP)
//   centerZone.on('pointerdown', (pointer) => {
//     controls.up = true;
//     activeTouches.set(pointer.id, 'up');
//     centerIndicator.setAlpha(0.3);
    
//     // Auto-release jump after 200ms
//     scene.time.delayedCall(200, () => {
//       controls.up = false;
//       if (activeTouches.get(pointer.id) === 'up') {
//         activeTouches.delete(pointer.id);
//       }
//       centerIndicator.setAlpha(0.1);
//     });
//   });
  
//   centerZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'up') {
//       controls.up = false;
//       activeTouches.delete(pointer.id);
//       centerIndicator.setAlpha(0.1);
//     }
//   });
  
//   // SHOOT BUTTON (optional - positioned in bottom right)
//   let shootButton = null;
//   if (options.includeShoot) {
//     shootButton = scene.add.text(850, 480, '🔥', {
//       fontSize: '48px',
//       backgroundColor: '#FF660099',
//       padding: { x: 15, y: 10 }
//     })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setDepth(1001)
//       .setInteractive();
    
//     shootButton.on('pointerdown', (pointer) => {
//       controls.shoot = true;
//       activeTouches.set(pointer.id, 'shoot');
//       shootButton.setStyle({ backgroundColor: '#FF0000CC' });
//     });
    
//     shootButton.on('pointerup', (pointer) => {
//       if (activeTouches.get(pointer.id) === 'shoot') {
//         controls.shoot = false;
//         activeTouches.delete(pointer.id);
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       }
//     });
//   }
  
//   // Global pointer up handler to ensure all controls are released
//   scene.input.on('pointerup', (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//     }
    
//     activeTouches.delete(pointer.id);
//   });
  
//   // Global pointerupoutside handler
//   scene.input.on('pointerupoutside', (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//     }
    
//     activeTouches.delete(pointer.id);
//   });
  
//   // Reset all controls on game out
//   scene.input.on('gameout', () => {
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
//     leftIndicator.setAlpha(0.1);
//     rightIndicator.setAlpha(0.1);
//     centerIndicator.setAlpha(0.1);
//     if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//   });
  
//   // Reset all controls when scene loses focus
//   scene.events.on('pause', () => {
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
//     leftIndicator.setAlpha(0.1);
//     rightIndicator.setAlpha(0.1);
//     centerIndicator.setAlpha(0.1);
//     if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//   });
  
//   // Cleanup on scene shutdown
//   scene.events.on('shutdown', () => {
//     scene.input.off('pointerup');
//     scene.input.off('pointerupoutside');
//     scene.input.off('gameout');
//     activeTouches.clear();
//   });
  
//   // Return controls and all UI elements for cleanup
//   return { 
//     controls, 
//     zones: [leftZone, rightZone, centerZone],
//     indicators: [leftIndicator, rightIndicator, centerIndicator],
//     labels: [leftLabel, rightLabel, centerLabel],
//     shootButton: shootButton
//   };
// }



// export function createMobileControls(scene, options = {}) {
//   // Only create controls on touch devices
//   if (!scene.sys.game.device.input.touch) return null;
  
//   const controls = {
//     left: false,
//     right: false,
//     up: false,
//     shoot: false
//   };
  
//   // Create invisible touch zones that cover the screen
//   const screenWidth = 960;
//   const screenHeight = 540;
  
//   // Left zone (left third of screen)
//   const leftZone = scene.add.zone(0, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Right zone (right third of screen)
//   const rightZone = scene.add.zone(screenWidth * 2/3, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Center zone (middle third for jumping)
//   const centerZone = scene.add.zone(screenWidth / 3, 0, screenWidth / 3, screenHeight * 0.7)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Visual indicators (semi-transparent)
//   const leftIndicator = scene.add.rectangle(
//     screenWidth / 6, screenHeight / 2, 
//     screenWidth / 3 - 20, screenHeight - 20,
//     0x0000FF, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const rightIndicator = scene.add.rectangle(
//     screenWidth * 5/6, screenHeight / 2,
//     screenWidth / 3 - 20, screenHeight - 20,
//     0xFF0000, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const centerIndicator = scene.add.rectangle(
//     screenWidth / 2, screenHeight * 0.35,
//     screenWidth / 3 - 20, screenHeight * 0.7 - 20,
//     0x00FF00, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   // Add labels
//   const leftLabel = scene.add.text(screenWidth / 6, 50, '◄ LEFT', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const rightLabel = scene.add.text(screenWidth * 5/6, 50, 'RIGHT ►', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const centerLabel = scene.add.text(screenWidth / 2, screenHeight / 2, '▲ JUMP', {
//     fontSize: '32px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 4
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   // Track active touches
//   const activeTouches = new Map();
  
//   // LEFT ZONE
//   leftZone.on('pointerdown', (pointer) => {
//     controls.left = true;
//     activeTouches.set(pointer.id, 'left');
//     leftIndicator.setAlpha(0.3);
//   });
  
//   leftZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'left') {
//       controls.left = false;
//       activeTouches.delete(pointer.id);
//       leftIndicator.setAlpha(0.1);
//     }
//   });
  
//   // RIGHT ZONE
//   rightZone.on('pointerdown', (pointer) => {
//     controls.right = true;
//     activeTouches.set(pointer.id, 'right');
//     rightIndicator.setAlpha(0.3);
//   });
  
//   rightZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'right') {
//       controls.right = false;
//       activeTouches.delete(pointer.id);
//       rightIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CENTER ZONE (JUMP) - COMPLETELY FIXED
//   centerZone.on('pointerdown', (pointer) => {
//     // Set jump to true
//     controls.up = true;
//     activeTouches.set(pointer.id, 'up');
//     centerIndicator.setAlpha(0.3);
    
//     // CRITICAL: Keep it true long enough for physics to register (1 frame is enough)
//     // Then auto-reset to allow next jump
//     scene.time.delayedCall(50, () => {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     });
//   });
  
//   centerZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'up') {
//       controls.up = false;
//       activeTouches.delete(pointer.id);
//       centerIndicator.setAlpha(0.1);
//     }
//   });
  
//   // SHOOT BUTTON (optional - positioned in bottom right)
//   let shootButton = null;
//   if (options.includeShoot) {
//     shootButton = scene.add.text(850, 480, '🔥', {
//       fontSize: '48px',
//       backgroundColor: '#FF660099',
//       padding: { x: 15, y: 10 }
//     })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setDepth(1001)
//       .setInteractive();
    
//     shootButton.on('pointerdown', (pointer) => {
//       controls.shoot = true;
//       activeTouches.set(pointer.id, 'shoot');
//       shootButton.setStyle({ backgroundColor: '#FF0000CC' });
      
//       // Auto-release shoot after 100ms to prevent continuous fire
//       scene.time.delayedCall(100, () => {
//         controls.shoot = false;
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       });
//     });
    
//     shootButton.on('pointerup', (pointer) => {
//       if (activeTouches.get(pointer.id) === 'shoot') {
//         controls.shoot = false;
//         activeTouches.delete(pointer.id);
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       }
//     });
//   }
  
//   // Global pointer up handler to ensure all controls are released
//   scene.input.on('pointerup', (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//     }
    
//     activeTouches.delete(pointer.id);
//   });
  
//   // Global pointerupoutside handler
//   scene.input.on('pointerupoutside', (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//     }
    
//     activeTouches.delete(pointer.id);
//   });
  
//   // Reset all controls on game out
//   scene.input.on('gameout', () => {
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
//     leftIndicator.setAlpha(0.1);
//     rightIndicator.setAlpha(0.1);
//     centerIndicator.setAlpha(0.1);
//     if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//   });
  
//   // Reset all controls when scene loses focus
//   scene.events.on('pause', () => {
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
//     leftIndicator.setAlpha(0.1);
//     rightIndicator.setAlpha(0.1);
//     centerIndicator.setAlpha(0.1);
//     if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
//   });
  
//   // Cleanup on scene shutdown
//   scene.events.on('shutdown', () => {
//     scene.input.off('pointerup');
//     scene.input.off('pointerupoutside');
//     scene.input.off('gameout');
//     activeTouches.clear();
//   });
  
//   // Return controls and all UI elements for cleanup
//   return { 
//     controls, 
//     zones: [leftZone, rightZone, centerZone],
//     indicators: [leftIndicator, rightIndicator, centerIndicator],
//     labels: [leftLabel, rightLabel, centerLabel],
//     shootButton: shootButton
//   };
// }















// export function createMobileControls(scene, options = {}) {
//   // Only create controls on touch devices
//   if (!scene.sys.game.device.input.touch) return null;
  
//   const controls = {
//     left: false,
//     right: false,
//     up: false,
//     shoot: false
//   };
  
//   // Create invisible touch zones that cover the screen
//   const screenWidth = 960;
//   const screenHeight = 540;
  
//   // Left zone (left third of screen)
//   const leftZone = scene.add.zone(0, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Right zone (right third of screen)
//   const rightZone = scene.add.zone(screenWidth * 2/3, 0, screenWidth / 3, screenHeight)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Center zone (middle third for jumping)
//   const centerZone = scene.add.zone(screenWidth / 3, 0, screenWidth / 3, screenHeight * 0.7)
//     .setOrigin(0, 0)
//     .setInteractive()
//     .setScrollFactor(0)
//     .setDepth(999);
  
//   // Visual indicators (semi-transparent)
//   const leftIndicator = scene.add.rectangle(
//     screenWidth / 6, screenHeight / 2, 
//     screenWidth / 3 - 20, screenHeight - 20,
//     0x0000FF, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const rightIndicator = scene.add.rectangle(
//     screenWidth * 5/6, screenHeight / 2,
//     screenWidth / 3 - 20, screenHeight - 20,
//     0xFF0000, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   const centerIndicator = scene.add.rectangle(
//     screenWidth / 2, screenHeight * 0.35,
//     screenWidth / 3 - 20, screenHeight * 0.7 - 20,
//     0x00FF00, 0.1
//   ).setScrollFactor(0).setDepth(998);
  
//   // Add labels
//   const leftLabel = scene.add.text(screenWidth / 6, 50, '◄ LEFT', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const rightLabel = scene.add.text(screenWidth * 5/6, 50, 'RIGHT ►', {
//     fontSize: '24px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 3
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   const centerLabel = scene.add.text(screenWidth / 2, screenHeight / 2, '▲ JUMP', {
//     fontSize: '32px',
//     fill: '#FFFFFF',
//     stroke: '#000000',
//     strokeThickness: 4
//   }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
//   // Track active touches - ENHANCED
//   const activeTouches = new Map();
  
//   // SHOOT BUTTON - Declare early so it's in scope for forceResetAllControls
//   let shootButton = null;
  
//   // CRITICAL: Force reset function - FIXED NULL CHECK
//   const forceResetAllControls = () => {
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
    
//     // FIXED: Only update UI elements if they still exist and scene is active
//     if (scene && scene.sys && !scene.sys.isDestroyed && scene.sys.isActive()) {
//       try {
//         if (leftIndicator && leftIndicator.scene) {
//           leftIndicator.setAlpha(0.1);
//         }
//         if (rightIndicator && rightIndicator.scene) {
//           rightIndicator.setAlpha(0.1);
//         }
//         if (centerIndicator && centerIndicator.scene) {
//           centerIndicator.setAlpha(0.1);
//         }
//         if (shootButton && shootButton.scene) {
//           shootButton.setStyle({ backgroundColor: '#FF660099' });
//         }
//       } catch (err) {
//         console.log('UI cleanup already done:', err.message);
//       }
//     }
//   };
  
//   // LEFT ZONE
//   leftZone.on('pointerdown', (pointer) => {
//     controls.left = true;
//     activeTouches.set(pointer.id, 'left');
//     leftIndicator.setAlpha(0.3);
//   });
  
//   leftZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'left') {
//       controls.left = false;
//       activeTouches.delete(pointer.id);
//       leftIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CRITICAL: Also handle pointerout for left zone
//   leftZone.on('pointerout', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'left') {
//       controls.left = false;
//       activeTouches.delete(pointer.id);
//       leftIndicator.setAlpha(0.1);
//     }
//   });
  
//   // RIGHT ZONE
//   rightZone.on('pointerdown', (pointer) => {
//     controls.right = true;
//     activeTouches.set(pointer.id, 'right');
//     rightIndicator.setAlpha(0.3);
//   });
  
//   rightZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'right') {
//       controls.right = false;
//       activeTouches.delete(pointer.id);
//       rightIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CRITICAL: Also handle pointerout for right zone
//   rightZone.on('pointerout', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'right') {
//       controls.right = false;
//       activeTouches.delete(pointer.id);
//       rightIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CENTER ZONE (JUMP) - ENHANCED
//   centerZone.on('pointerdown', (pointer) => {
//     controls.up = true;
//     activeTouches.set(pointer.id, 'up');
//     centerIndicator.setAlpha(0.3);
    
//     // Auto-release jump after 50ms to ensure it registers
//     scene.time.delayedCall(50, () => {
//       controls.up = false;
//       centerIndicator.setAlpha(0.1);
//     });
//   });
  
//   centerZone.on('pointerup', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'up') {
//       controls.up = false;
//       activeTouches.delete(pointer.id);
//       centerIndicator.setAlpha(0.1);
//     }
//   });
  
//   // CRITICAL: Also handle pointerout for center zone
//   centerZone.on('pointerout', (pointer) => {
//     if (activeTouches.get(pointer.id) === 'up') {
//       controls.up = false;
//       activeTouches.delete(pointer.id);
//       centerIndicator.setAlpha(0.1);
//     }
//   });
  
//   // SHOOT BUTTON (optional - positioned in bottom right)
//   if (options.includeShoot) {
//     shootButton = scene.add.text(850, 480, '🔥', {
//       fontSize: '48px',
//       backgroundColor: '#FF660099',
//       padding: { x: 15, y: 10 }
//     })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setDepth(1001)
//       .setInteractive();
    
//     shootButton.on('pointerdown', (pointer) => {
//       controls.shoot = true;
//       activeTouches.set(pointer.id, 'shoot');
//       shootButton.setStyle({ backgroundColor: '#FF0000CC' });
      
//       // Auto-release shoot after 100ms
//       scene.time.delayedCall(100, () => {
//         controls.shoot = false;
//         if (shootButton && shootButton.scene) {
//           shootButton.setStyle({ backgroundColor: '#FF660099' });
//         }
//       });
//     });
    
//     shootButton.on('pointerup', (pointer) => {
//       if (activeTouches.get(pointer.id) === 'shoot') {
//         controls.shoot = false;
//         activeTouches.delete(pointer.id);
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       }
//     });
//   }
  
//   // CRITICAL: Global pointer up handler (catches all releases)
//   const globalPointerUpHandler = (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       if (leftIndicator && leftIndicator.scene) leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       if (rightIndicator && rightIndicator.scene) rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       if (centerIndicator && centerIndicator.scene) centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton && shootButton.scene) {
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       }
//     }
    
//     activeTouches.delete(pointer.id);
//   };
  
//   scene.input.on('pointerup', globalPointerUpHandler);
  
//   // CRITICAL: Global pointerupoutside handler (catches releases outside zones)
//   const globalPointerUpOutsideHandler = (pointer) => {
//     const touchType = activeTouches.get(pointer.id);
    
//     if (touchType === 'left') {
//       controls.left = false;
//       if (leftIndicator && leftIndicator.scene) leftIndicator.setAlpha(0.1);
//     } else if (touchType === 'right') {
//       controls.right = false;
//       if (rightIndicator && rightIndicator.scene) rightIndicator.setAlpha(0.1);
//     } else if (touchType === 'up') {
//       controls.up = false;
//       if (centerIndicator && centerIndicator.scene) centerIndicator.setAlpha(0.1);
//     } else if (touchType === 'shoot') {
//       controls.shoot = false;
//       if (shootButton && shootButton.scene) {
//         shootButton.setStyle({ backgroundColor: '#FF660099' });
//       }
//     }
    
//     activeTouches.delete(pointer.id);
//   };
  
//   scene.input.on('pointerupoutside', globalPointerUpOutsideHandler);
  
//   // CRITICAL: Reset controls when pointer leaves game
//   scene.input.on('gameout', forceResetAllControls);
  
//   // CRITICAL: Reset controls when scene loses focus
//   scene.events.on('pause', forceResetAllControls);
//   scene.events.on('sleep', forceResetAllControls);
  
//   // CRITICAL: Periodic cleanup every 100ms to prevent stuck controls
//   const cleanupTimer = scene.time.addEvent({
//     delay: 100,
//     callback: () => {
//       // If no active touches but controls are still active, force reset
//       if (activeTouches.size === 0) {
//         if (controls.left || controls.right || controls.up || controls.shoot) {
//           console.warn('🔧 Stuck controls detected - force resetting');
//           forceResetAllControls();
//         }
//       }
//     },
//     loop: true
//   });
  
//   // CRITICAL: Cleanup on scene shutdown - ENHANCED
//   scene.events.once('shutdown', () => {
//     // Stop the cleanup timer
//     if (cleanupTimer) {
//       cleanupTimer.remove();
//     }
    
//     // Remove event listeners
//     scene.input.off('pointerup', globalPointerUpHandler);
//     scene.input.off('pointerupoutside', globalPointerUpOutsideHandler);
//     scene.input.off('gameout', forceResetAllControls);
//     scene.events.off('pause', forceResetAllControls);
//     scene.events.off('sleep', forceResetAllControls);
    
//     // Force reset controls one last time (safely)
//     controls.left = false;
//     controls.right = false;
//     controls.up = false;
//     controls.shoot = false;
//     activeTouches.clear();
//   });
  
//   // Return controls and all UI elements for cleanup
//   return { 
//     controls, 
//     zones: [leftZone, rightZone, centerZone],
//     indicators: [leftIndicator, rightIndicator, centerIndicator],
//     labels: [leftLabel, rightLabel, centerLabel],
//     shootButton: shootButton
//   };
// }






export function createMobileControls(scene, options = {}) {
  // Only create controls on touch devices
  if (!scene.sys.game.device.input.touch) return null;
  
  const controls = {
    left: false,
    right: false,
    up: false,
    shoot: false
  };
  
  // Screen dimensions
  const screenWidth = 960;
  const screenHeight = 540;
  
  // Track active touches
  const activeTouches = new Map();
  
  // Button styling
  const buttonStyle = {
    fontSize: '32px',
    backgroundColor: '#00000080',
    padding: { x: 15, y: 10 },
    fixedWidth: 70,
    fixedHeight: 70,
    align: 'center',
    stroke: '#FFFFFF',
    strokeThickness: 2
  };
  
  // LEFT SIDE - Movement buttons
  // Left button
  const leftButton = scene.add.text(60, 450, '◄', buttonStyle)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001)
    .setInteractive();
    
  // Right button  
  const rightButton = scene.add.text(160, 450, '►', buttonStyle)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001)
    .setInteractive();
  
  // RIGHT SIDE - Action buttons
  // Jump button
  const jumpButton = scene.add.text(800, 450, '▲', buttonStyle)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001)
    .setInteractive();
  
  // Shoot button (only if enabled)
  let shootButton = null;
  if (options.includeShoot) {
    shootButton = scene.add.text(870, 380, '🔥', {
      ...buttonStyle,
      backgroundColor: '#FF660099'
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive();
  }
  
  // Force reset function
  const forceResetAllControls = () => {
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.shoot = false;
    activeTouches.clear();
    
    // Reset button appearances
    if (scene && scene.sys && !scene.sys.isDestroyed && scene.sys.isActive()) {
      try {
        leftButton.setStyle({ backgroundColor: '#00000080' });
        rightButton.setStyle({ backgroundColor: '#00000080' });
        jumpButton.setStyle({ backgroundColor: '#00000080' });
        if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
      } catch (err) {
        console.log('UI cleanup already done:', err.message);
      }
    }
  };
  
  // LEFT BUTTON handlers
  leftButton.on('pointerdown', (pointer) => {
    controls.left = true;
    activeTouches.set(pointer.id, 'left');
    leftButton.setStyle({ backgroundColor: '#0000FFAA' });
  });
  
  leftButton.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'left') {
      controls.left = false;
      activeTouches.delete(pointer.id);
      leftButton.setStyle({ backgroundColor: '#00000080' });
    }
  });
  
  leftButton.on('pointerout', (pointer) => {
    if (activeTouches.get(pointer.id) === 'left') {
      controls.left = false;
      activeTouches.delete(pointer.id);
      leftButton.setStyle({ backgroundColor: '#00000080' });
    }
  });
  
  // RIGHT BUTTON handlers
  rightButton.on('pointerdown', (pointer) => {
    controls.right = true;
    activeTouches.set(pointer.id, 'right');
    rightButton.setStyle({ backgroundColor: '#FF0000AA' });
  });
  
  rightButton.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'right') {
      controls.right = false;
      activeTouches.delete(pointer.id);
      rightButton.setStyle({ backgroundColor: '#00000080' });
    }
  });
  
  rightButton.on('pointerout', (pointer) => {
    if (activeTouches.get(pointer.id) === 'right') {
      controls.right = false;
      activeTouches.delete(pointer.id);
      rightButton.setStyle({ backgroundColor: '#00000080' });
    }
  });
  
  // JUMP BUTTON handlers
  jumpButton.on('pointerdown', (pointer) => {
    controls.up = true;
    activeTouches.set(pointer.id, 'up');
    jumpButton.setStyle({ backgroundColor: '#00FF00AA' });
    
    // Auto-release jump after 100ms
    scene.time.delayedCall(100, () => {
      controls.up = false;
      jumpButton.setStyle({ backgroundColor: '#00000080' });
    });
  });
  
  jumpButton.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'up') {
      controls.up = false;
      activeTouches.delete(pointer.id);
      jumpButton.setStyle({ backgroundColor: '#00000080' });
    }
  });
  
  // SHOOT BUTTON handlers (if exists)
  if (shootButton) {
    shootButton.on('pointerdown', (pointer) => {
      controls.shoot = true;
      activeTouches.set(pointer.id, 'shoot');
      shootButton.setStyle({ backgroundColor: '#FF0000CC' });
      
      // Auto-release shoot after 100ms
      scene.time.delayedCall(100, () => {
        controls.shoot = false;
        shootButton.setStyle({ backgroundColor: '#FF660099' });
      });
    });
    
    shootButton.on('pointerup', (pointer) => {
      if (activeTouches.get(pointer.id) === 'shoot') {
        controls.shoot = false;
        activeTouches.delete(pointer.id);
        shootButton.setStyle({ backgroundColor: '#FF660099' });
      }
    });
  }
  
  // Global handlers for safety
  const globalPointerUpHandler = (pointer) => {
    const touchType = activeTouches.get(pointer.id);
    
    if (touchType === 'left') {
      controls.left = false;
      leftButton.setStyle({ backgroundColor: '#00000080' });
    } else if (touchType === 'right') {
      controls.right = false;
      rightButton.setStyle({ backgroundColor: '#00000080' });
    } else if (touchType === 'up') {
      controls.up = false;
      jumpButton.setStyle({ backgroundColor: '#00000080' });
    } else if (touchType === 'shoot' && shootButton) {
      controls.shoot = false;
      shootButton.setStyle({ backgroundColor: '#FF660099' });
    }
    
    activeTouches.delete(pointer.id);
  };
  
  scene.input.on('pointerup', globalPointerUpHandler);
  scene.input.on('pointerupoutside', globalPointerUpHandler);
  scene.input.on('gameout', forceResetAllControls);
  
  // Scene event handlers
  scene.events.on('pause', forceResetAllControls);
  scene.events.on('sleep', forceResetAllControls);
  
  // Cleanup timer
  const cleanupTimer = scene.time.addEvent({
    delay: 100,
    callback: () => {
      if (activeTouches.size === 0) {
        if (controls.left || controls.right || controls.up || controls.shoot) {
          forceResetAllControls();
        }
      }
    },
    loop: true
  });
  
  // Scene shutdown cleanup
  scene.events.once('shutdown', () => {
    if (cleanupTimer) cleanupTimer.remove();
    
    scene.input.off('pointerup', globalPointerUpHandler);
    scene.input.off('pointerupoutside', globalPointerUpHandler);
    scene.input.off('gameout', forceResetAllControls);
    scene.events.off('pause', forceResetAllControls);
    scene.events.off('sleep', forceResetAllControls);
    
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.shoot = false;
    activeTouches.clear();
  });
  
  // Return controls and UI elements
  return { 
    controls, 
    buttons: [leftButton, rightButton, jumpButton, shootButton].filter(Boolean)
  };
}