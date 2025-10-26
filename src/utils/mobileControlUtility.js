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
export function createMobileControls(scene, options = {}) {
  // Only create controls on touch devices
  if (!scene.sys.game.device.input.touch) return null;
  
  const controls = {
    left: false,
    right: false,
    up: false,
    shoot: false
  };
  
  // Create invisible touch zones that cover the screen
  const screenWidth = 960;
  const screenHeight = 540;
  
  // Left zone (left third of screen)
  const leftZone = scene.add.zone(0, 0, screenWidth / 3, screenHeight)
    .setOrigin(0, 0)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(999);
  
  // Right zone (right third of screen)
  const rightZone = scene.add.zone(screenWidth * 2/3, 0, screenWidth / 3, screenHeight)
    .setOrigin(0, 0)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(999);
  
  // Center zone (middle third for jumping)
  const centerZone = scene.add.zone(screenWidth / 3, 0, screenWidth / 3, screenHeight * 0.7)
    .setOrigin(0, 0)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(999);
  
  // Visual indicators (semi-transparent)
  const leftIndicator = scene.add.rectangle(
    screenWidth / 6, screenHeight / 2, 
    screenWidth / 3 - 20, screenHeight - 20,
    0x0000FF, 0.1
  ).setScrollFactor(0).setDepth(998);
  
  const rightIndicator = scene.add.rectangle(
    screenWidth * 5/6, screenHeight / 2,
    screenWidth / 3 - 20, screenHeight - 20,
    0xFF0000, 0.1
  ).setScrollFactor(0).setDepth(998);
  
  const centerIndicator = scene.add.rectangle(
    screenWidth / 2, screenHeight * 0.35,
    screenWidth / 3 - 20, screenHeight * 0.7 - 20,
    0x00FF00, 0.1
  ).setScrollFactor(0).setDepth(998);
  
  // Add labels
  const leftLabel = scene.add.text(screenWidth / 6, 50, '◄ LEFT', {
    fontSize: '24px',
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
  const rightLabel = scene.add.text(screenWidth * 5/6, 50, 'RIGHT ►', {
    fontSize: '24px',
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
  const centerLabel = scene.add.text(screenWidth / 2, screenHeight / 2, '▲ JUMP', {
    fontSize: '32px',
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
  
  // Track active touches
  const activeTouches = new Map();
  
  // LEFT ZONE
  leftZone.on('pointerdown', (pointer) => {
    controls.left = true;
    activeTouches.set(pointer.id, 'left');
    leftIndicator.setAlpha(0.3);
  });
  
  leftZone.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'left') {
      controls.left = false;
      activeTouches.delete(pointer.id);
      leftIndicator.setAlpha(0.1);
    }
  });
  
  // RIGHT ZONE
  rightZone.on('pointerdown', (pointer) => {
    controls.right = true;
    activeTouches.set(pointer.id, 'right');
    rightIndicator.setAlpha(0.3);
  });
  
  rightZone.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'right') {
      controls.right = false;
      activeTouches.delete(pointer.id);
      rightIndicator.setAlpha(0.1);
    }
  });
  
  // CENTER ZONE (JUMP) - COMPLETELY FIXED
  centerZone.on('pointerdown', (pointer) => {
    // Set jump to true
    controls.up = true;
    activeTouches.set(pointer.id, 'up');
    centerIndicator.setAlpha(0.3);
    
    // CRITICAL: Keep it true long enough for physics to register (1 frame is enough)
    // Then auto-reset to allow next jump
    scene.time.delayedCall(50, () => {
      controls.up = false;
      centerIndicator.setAlpha(0.1);
    });
  });
  
  centerZone.on('pointerup', (pointer) => {
    if (activeTouches.get(pointer.id) === 'up') {
      controls.up = false;
      activeTouches.delete(pointer.id);
      centerIndicator.setAlpha(0.1);
    }
  });
  
  // SHOOT BUTTON (optional - positioned in bottom right)
  let shootButton = null;
  if (options.includeShoot) {
    shootButton = scene.add.text(850, 480, '🔥', {
      fontSize: '48px',
      backgroundColor: '#FF660099',
      padding: { x: 15, y: 10 }
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive();
    
    shootButton.on('pointerdown', (pointer) => {
      controls.shoot = true;
      activeTouches.set(pointer.id, 'shoot');
      shootButton.setStyle({ backgroundColor: '#FF0000CC' });
      
      // Auto-release shoot after 100ms to prevent continuous fire
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
  
  // Global pointer up handler to ensure all controls are released
  scene.input.on('pointerup', (pointer) => {
    const touchType = activeTouches.get(pointer.id);
    
    if (touchType === 'left') {
      controls.left = false;
      leftIndicator.setAlpha(0.1);
    } else if (touchType === 'right') {
      controls.right = false;
      rightIndicator.setAlpha(0.1);
    } else if (touchType === 'up') {
      controls.up = false;
      centerIndicator.setAlpha(0.1);
    } else if (touchType === 'shoot') {
      controls.shoot = false;
      if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
    }
    
    activeTouches.delete(pointer.id);
  });
  
  // Global pointerupoutside handler
  scene.input.on('pointerupoutside', (pointer) => {
    const touchType = activeTouches.get(pointer.id);
    
    if (touchType === 'left') {
      controls.left = false;
      leftIndicator.setAlpha(0.1);
    } else if (touchType === 'right') {
      controls.right = false;
      rightIndicator.setAlpha(0.1);
    } else if (touchType === 'up') {
      controls.up = false;
      centerIndicator.setAlpha(0.1);
    } else if (touchType === 'shoot') {
      controls.shoot = false;
      if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
    }
    
    activeTouches.delete(pointer.id);
  });
  
  // Reset all controls on game out
  scene.input.on('gameout', () => {
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.shoot = false;
    activeTouches.clear();
    leftIndicator.setAlpha(0.1);
    rightIndicator.setAlpha(0.1);
    centerIndicator.setAlpha(0.1);
    if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
  });
  
  // Reset all controls when scene loses focus
  scene.events.on('pause', () => {
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.shoot = false;
    activeTouches.clear();
    leftIndicator.setAlpha(0.1);
    rightIndicator.setAlpha(0.1);
    centerIndicator.setAlpha(0.1);
    if (shootButton) shootButton.setStyle({ backgroundColor: '#FF660099' });
  });
  
  // Cleanup on scene shutdown
  scene.events.on('shutdown', () => {
    scene.input.off('pointerup');
    scene.input.off('pointerupoutside');
    scene.input.off('gameout');
    activeTouches.clear();
  });
  
  // Return controls and all UI elements for cleanup
  return { 
    controls, 
    zones: [leftZone, rightZone, centerZone],
    indicators: [leftIndicator, rightIndicator, centerIndicator],
    labels: [leftLabel, rightLabel, centerLabel],
    shootButton: shootButton
  };
}