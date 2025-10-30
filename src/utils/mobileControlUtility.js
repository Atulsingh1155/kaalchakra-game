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