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
  // Create controls for all devices (will be invisible on desktop)
  const isMobile = scene.sys.game.device.input.touch;
  
  const controls = {
    left: false,
    right: false,
    up: false,
    shoot: false
  };
  
  // Create container for all buttons
  const controlsContainer = scene.add.container(0, 0);
  controlsContainer.setScrollFactor(0);
  controlsContainer.setDepth(1000);
  
  if (!isMobile) {
    controlsContainer.setVisible(false);
    return { controls, container: controlsContainer };
  }

  // Create invisible touch zones (full screen)
  const leftZone = scene.add.zone(0, 0, 320, 540).setOrigin(0, 0);
  const rightZone = scene.add.zone(640, 0, 320, 540).setOrigin(0, 0);
  const jumpZone = scene.add.zone(320, 0, 320, 540).setOrigin(0, 0);
  
  leftZone.setInteractive();
  rightZone.setInteractive();
  jumpZone.setInteractive();
  
  leftZone.setScrollFactor(0);
  rightZone.setScrollFactor(0);
  jumpZone.setScrollFactor(0);
  
  // Touch zone handlers
  leftZone.on('pointerdown', () => { controls.left = true; });
  leftZone.on('pointerup', () => { controls.left = false; });
  leftZone.on('pointerout', () => { controls.left = false; });
  
  rightZone.on('pointerdown', () => { controls.right = true; });
  rightZone.on('pointerup', () => { controls.right = false; });
  rightZone.on('pointerout', () => { controls.right = false; });
  
  jumpZone.on('pointerdown', () => { controls.up = true; });
  jumpZone.on('pointerup', () => { controls.up = false; });
  jumpZone.on('pointerout', () => { controls.up = false; });

  // Visual button styles (semi-transparent)
  const buttonStyle = {
    fontSize: '40px',
    backgroundColor: '#FFFFFF30',
    padding: { x: 25, y: 20 },
    fixedWidth: 100,
    fixedHeight: 100,
    align: 'center',
    fontStyle: 'bold'
  };
  
  // Left button (visual indicator)
  const leftButton = scene.add.text(50, 440, '←', buttonStyle)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);
  
  // Right button
  const rightButton = scene.add.text(910, 440, '→', buttonStyle)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);
  
  // Jump button (center)
  const upButton = scene.add.text(480, 440, '↑', {
    ...buttonStyle,
    fontSize: '50px',
    fixedWidth: 120,
    fixedHeight: 120
  })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1001);

  // Add visual feedback for button presses
  scene.input.on('pointerdown', (pointer) => {
    if (pointer.x < 320) {
      leftButton.setBackgroundColor('#FFFFFF60');
    } else if (pointer.x > 640) {
      rightButton.setBackgroundColor('#FFFFFF60');
    } else {
      upButton.setBackgroundColor('#FFFFFF60');
    }
  });
  
  scene.input.on('pointerup', () => {
    leftButton.setBackgroundColor('#FFFFFF30');
    rightButton.setBackgroundColor('#FFFFFF30');
    upButton.setBackgroundColor('#FFFFFF30');
  });
  
  controlsContainer.add([leftButton, rightButton, upButton]);
  
  return { controls, container: controlsContainer };
}