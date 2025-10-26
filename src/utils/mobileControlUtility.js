// export function createMobileControls(scene) {
//   // Only create controls on touch devices
//   if (!scene.sys.game.device.input.touch) return null;
  
//   const controls = {
//     left: false,
//     right: false,
//     up: false,
//     shoot: false
//   };
  
//   // Create container for all buttons
//   const controlsContainer = scene.add.container(0, 0);
//   controlsContainer.setScrollFactor(0); // Fixed to camera

//   // Control button styles
//   const buttonStyle = {
//     fontSize: '32px',
//     backgroundColor: '#00000080',
//     padding: { x: 20, y: 15 },
//     fixedWidth: 80,
//     fixedHeight: 80,
//     align: 'center'
//   };
  
//   // Left button
//   const leftButton = scene.add.text(100, 450, '←', buttonStyle)
//     .setOrigin(0.5)
//     .setInteractive();
  
//   // Right button
//   const rightButton = scene.add.text(200, 450, '→', buttonStyle)
//     .setOrigin(0.5)
//     .setInteractive();
  
//   // Jump button
//   const upButton = scene.add.text(860, 450, '↑', buttonStyle)
//     .setOrigin(0.5)
//     .setInteractive();
  
//   // Action button (if needed)
//   const shootButton = scene.add.text(760, 450, '⚡', buttonStyle)
//     .setOrigin(0.5)
//     .setInteractive();

//   // Add buttons to container
//   controlsContainer.add([leftButton, rightButton, upButton, shootButton]);
  
//   // Set up input handlers
//   leftButton.on('pointerdown', () => { controls.left = true; });
//   leftButton.on('pointerup', () => { controls.left = false; });
//   leftButton.on('pointerout', () => { controls.left = false; });
  
//   rightButton.on('pointerdown', () => { controls.right = true; });
//   rightButton.on('pointerup', () => { controls.right = false; });
//   rightButton.on('pointerout', () => { controls.right = false; });
  
//   upButton.on('pointerdown', () => { controls.up = true; });
//   upButton.on('pointerup', () => { controls.up = false; });
//   upButton.on('pointerout', () => { controls.up = false; });
  
//   shootButton.on('pointerdown', () => { controls.shoot = true; });
//   shootButton.on('pointerup', () => { controls.shoot = false; });
//   shootButton.on('pointerout', () => { controls.shoot = false; });
  
//   return { controls, container: controlsContainer };
// }


export function createMobileControls(scene) {
  // Only create controls on touch devices
  if (!scene.sys.game.device.input.touch) return null;
  
  const controls = {
    left: false,
    right: false,
    up: false,
    shoot: false
  };
  
  // Create container for all buttons
  const controlsContainer = scene.add.container(0, 0);
  controlsContainer.setScrollFactor(0); // Fixed to camera

  // Control button styles
  const buttonStyle = {
    fontSize: '32px',
    backgroundColor: '#00000080',
    padding: { x: 20, y: 15 },
    fixedWidth: 80,
    fixedHeight: 80,
    align: 'center'
  };
  
  // Left button
  const leftButton = scene.add.text(100, 450, '←', buttonStyle)
    .setOrigin(0.5)
    .setInteractive();
  
  // Right button
  const rightButton = scene.add.text(200, 450, '→', buttonStyle)
    .setOrigin(0.5)
    .setInteractive();
  
  // Jump button
  const upButton = scene.add.text(860, 450, '↑', buttonStyle)
    .setOrigin(0.5)
    .setInteractive();
  
  // Action button (if needed)
  const shootButton = scene.add.text(760, 450, '⚡', buttonStyle)
    .setOrigin(0.5)
    .setInteractive();

  // Add buttons to container
  controlsContainer.add([leftButton, rightButton, upButton, shootButton]);
  
  // FIXED: Improved input handlers - removed pointerout for critical controls
  leftButton.on('pointerdown', () => { controls.left = true; });
  leftButton.on('pointerup', () => { controls.left = false; });
  
  rightButton.on('pointerdown', () => { controls.right = true; });
  rightButton.on('pointerup', () => { controls.right = false; });
  
  // FIXED: Jump button - no pointerout to prevent canceling mid-jump
  upButton.on('pointerdown', () => { 
    controls.up = true; 
  });
  upButton.on('pointerup', () => { 
    controls.up = false; 
  });
  
  shootButton.on('pointerdown', () => { controls.shoot = true; });
  shootButton.on('pointerup', () => { controls.shoot = false; });
  
  return { controls, container: controlsContainer };
}