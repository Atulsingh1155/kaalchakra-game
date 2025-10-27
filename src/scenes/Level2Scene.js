import { Aarav } from '../objects/Aarav.js';
import { Enemy } from '../objects/Enemy.js';
import { Coin } from '../objects/Coin.js';
import { Dadi } from '../objects/Dadi.js';
import { GameData } from '../data/gameData.js';
import { createMobileControls } from '../utils/mobileControlUtility.js';

export class Level2Scene extends Phaser.Scene {
    constructor() { 
    super('Level2Scene'); 
    this.distanceRun = 0;
    this.coinsCollected = 0;
    this.coinsNeeded = 50;  // Changed to 30 coins target
    this.coinsToComplete = 50;  // Need 50 coins to complete level
    this.levelComplete = false;
    this.startX = 100;
    this.fireballs = null;
    this.fireballCooldown = false;
    this.groundY = 480; // Fixed ground level
    this.fireballRange = 1500; // Extended range for fireballs
    this.fireballSpeed = 600; // Increased fireball speed
    this.playerFacingRight = true; // Track player direction
    this.platformsCreated = false;
    this.targetingMode = false; // For directional shooting
    this.lastCheckpoint = null; // For checkpoints
    this.checkpointReached = false;
    this.hazardImmune = false;
    this.shieldCooldown = false;
    this.gameOverShown = false;
    
    // Initialize UI elements to prevent null errors
    this.progressBarFill = null;
    this.progressBarBg = null;
    this.powerMeterFill = null;
    this.powerMeterBg = null;
    this.powerMeterPulse = null;
    this.targetingText = null;
    this.distanceNotification = null;
    this.enemySpawnTimer = null;
  }
  
  create() {
    // Reset stats for level 2 - always start fresh
    GameData.playerStats.health = 100;
    GameData.playerStats.coins = 0;
    GameData.playerStats.currentLevel = 2;
    this.coinsCollected = 0;


    
    // IMPORTANT: Reset control flags when restarting
    this.levelComplete = false;
    this.chaseStarted = false; // Will be set to true after power grant sequence
    this.shieldCooldown = false;
    this.gameOverShown = false;
    // FIXED: Reset platform flag to ensure platforms are recreated
    this.platformsCreated = false;
    this.hazardImmune = false;


    // this.hazardImmune = false;
    // Extend world bounds for a larger level
    this.physics.world.setBounds(0, 0, 12000, 540);
    
    // Multiple backgrounds with new game_bg2
    this.backgrounds = [];
    for (let i = 0; i < 16; i++) {
      const bg = this.add.image(480 + (i * 960), 270, 'game_bg2');
      this.backgrounds.push(bg);
    }
    
    // Add walls to prevent player from going out of bounds
    this.leftWall = this.add.rectangle(-10, 270, 20, 540, 0x000000, 0);
    this.physics.add.existing(this.leftWall, true);
    
    this.rightWall = this.add.rectangle(12010, 270, 20, 540, 0x000000, 0);
    this.physics.add.existing(this.rightWall, true);
  // create() {
  //   // Reset stats for level 2 - always start fresh
  //   GameData.playerStats.health = 100;
  //   GameData.playerStats.coins = 0;
  //   GameData.playerStats.currentLevel = 2;
  //   this.coinsCollected = 0;

  //   // IMPORTANT: Reset control flags when restarting
  //   this.levelComplete = false;
  //   this.chaseStarted = false;
    
  //   // FIXED: Reset platform flag to ensure platforms are recreated
  //   this.platformsCreated = false;
  //   this.hazardImmune = false;
    
  //   // Extend world bounds for a larger level
  //   this.physics.world.setBounds(0, 0, 12000, 540);
    
  //   // FIXED: Simple background system like Level 1 - no complex parallax
  //   this.backgrounds = [];
  //   const worldWidth = 12000;
  //   const numBackgrounds = Math.ceil(worldWidth / 960) + 2; // Add extra for smooth scrolling
    
  //   for (let i = 0; i < numBackgrounds; i++) {
  //     const bg = this.add.image(480 + (i * 960), 270, 'game_bg2');
  //     bg.setScrollFactor(0.5); // Simple parallax - doesn't move backgrounds
  //     this.backgrounds.push(bg);
  //   }
    
  //   // Add walls to prevent player from going out of bounds
  //   this.leftWall = this.add.rectangle(-10, 270, 20, 540, 0x000000, 0);
  //   this.physics.add.existing(this.leftWall, true);
    
  //   this.rightWall = this.add.rectangle(12010, 270, 20, 540, 0x000000, 0);
  //   this.physics.add.existing(this.rightWall, true);
    
    // Create platforms and obstacles
    this.platforms = this.physics.add.staticGroup();
    this.createPlatforms();
    
    // Create hazards
    this.hazards = this.physics.add.staticGroup();
    this.createHazards();
    
    // Create checkpoints
    this.checkpoints = this.physics.add.group();
    this.createCheckpoints();
    
    // Create collectible powerups
    this.powerups = this.physics.add.group();
    this.createPowerups();
    
    // Level info text with updated coin target and engaging story
    this.storyText = this.add.text(480, 50, [
      "Level 2: The Mystic Village",
      "Dadi: The village was cursed by dark forces! You must collect sacred flames!",
      `Find ${this.coinsToComplete} magical coins hidden throughout the village to break the curse!`
    ], { 
      font: "18px serif", 
      fill: "#fff", 
      wordWrap: { width: 860 },
      backgroundColor: "#000000AA",
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Create player
    this.player = new Aarav(this, this.startX, this.groundY);

    this.player.setFlipX(true);

    this.physics.add.collider(this.player, this.leftWall);
    this.physics.add.collider(this.player, this.rightWall);
    this.physics.add.collider(this.player, this.platforms);
    
    // Setup controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 12000, 540);
    
    // Create fireballs group with extended range
    this.fireballs = this.physics.add.group({
      defaultKey: 'fire_ball',
      maxSize: 20  // Increased max fireballs
    });
    
    // Create enemy groups - INITIALIZE ALL THREE GROUPS
    this.enemiesLeft = this.physics.add.group();
    this.enemiesRight = this.physics.add.group();
    this.enemies = this.physics.add.group(); // Initialize combined group
    
    // Add initial enemies
    this.createLeftEnemy();
    this.createRightEnemy();
    
    // Create coins
    this.coins = this.physics.add.group();
    this.createCoins();
    
    // UI elements
    this.createUI();

    const mobileControlsResult = createMobileControls(this, { includeShoot: true });
    if (mobileControlsResult) {
      this.mobileControls = mobileControlsResult.controls;
      this.mobileControlsContainer = mobileControlsResult.container;
    }
    // Add mobile controls
//     const mobileControlsResult = createMobileControls(this);
//     if (mobileControlsResult) {
//       this.mobileControls = mobileControlsResult.controls;
//       this.mobileControlsContainer = mobileControlsResult.container;
      
//       // Add fire button for mobile
//       const fireButtonStyle = {
//         fontSize: '32px',
//         backgroundColor: '#FF000080',
//         padding: { x: 20, y: 15 },
//         fixedWidth: 80,
//         fixedHeight: 80,
//         align: 'center'
//       };
      
//       const fireButton = this.add.text(660, 450, '🔥', fireButtonStyle)
//         .setOrigin(0.5)
//         .setScrollFactor(0)
//         .setInteractive();
      
//       fireButton.on('pointerdown', () => {
//         if (!this.targetingMode) {
//           // Direct fire in direction player is facing
//           const worldPoint = this.playerFacingRight ? 
//               { x: this.player.x + 200, y: this.player.y - 30 } : 
//               { x: this.player.x - 200, y: this.player.y - 30 };
              
//           // Replace worldToScreen with the correct methods
//    const screenX = (worldPoint.x - this.cameras.main.scrollX);
//     const screenY = (worldPoint.y - this.cameras.main.scrollY);
    
//     const mockPointer = {
//       x: screenX,
//       y: screenY
//     };
//     this.shootFireballAtPointer(mockPointer);
//   }
// });
      
//       // Add targeting mode button
//       const targetButtonStyle = {
//         fontSize: '32px',
//         backgroundColor: '#0000FF80',
//         padding: { x: 20, y: 15 },
//         fixedWidth: 80,
//         fixedHeight: 80,
//         align: 'center'
//       };
      
//       const targetButton = this.add.text(560, 450, '🎯', targetButtonStyle)
//         .setOrigin(0.5)
//         .setScrollFactor(0)
//         .setInteractive();
      
//       targetButton.on('pointerdown', () => {
//         this.toggleTargetingMode();
//       });
      
//       this.mobileControlsContainer.add(fireButton);
//       this.mobileControlsContainer.add(targetButton);
//     }
    
    // Setup collisions
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitByEnemy, null, this);
    this.physics.add.overlap(this.fireballs, this.enemies, this.hitEnemyWithFireball, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
    this.physics.add.overlap(this.player, this.checkpoints, this.reachCheckpoint, null, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
    
    this.physics.add.collider(this.enemies, this.leftWall);
    this.physics.add.collider(this.enemies, this.rightWall);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.fireballs, this.platforms, this.hitPlatform, null, this);
    
    // Add power meter for fireballs
    this.createPowerMeter();
    
    // Setup mouse/touch input for directional shooting
    this.input.on('pointerdown', (pointer) => {
      if (this.targetingMode) {
        this.shootFireballAtPointer(pointer);
      }
    });
    
    // Create targeting reticle
    this.reticle = this.add.circle(0, 0, 15, 0xff0000, 0.5).setVisible(false);
    this.reticleDirection = this.add.line(0, 0, 0, 0, 0, 0, 0xff0000).setVisible(false);
    
    // Start with Dadi power granting
    this.time.delayedCall(1000, () => this.showPowerGrantSequence());
    
    // Add fade-in transition
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
  
    createPlatforms() {
    // Create various platforms throughout the EXTENDED level
    const platformData = [
      { x: 400, y: 400, width: 200, height: 20 },
      { x: 700, y: 350, width: 150, height: 20 },
      { x: 1100, y: 300, width: 200, height: 20 },
      { x: 1500, y: 400, width: 180, height: 20 },
      { x: 1800, y: 350, width: 150, height: 20 },
      { x: 2200, y: 320, width: 200, height: 20 },
      { x: 2600, y: 380, width: 180, height: 20 },
      { x: 3000, y: 340, width: 150, height: 20 },
      { x: 3400, y: 300, width: 200, height: 20 },
      { x: 3800, y: 360, width: 180, height: 20 },
      { x: 4200, y: 320, width: 150, height: 20 },
      { x: 4600, y: 380, width: 200, height: 20 },
      // NEW PLATFORMS for extended area
      { x: 5000, y: 340, width: 180, height: 20 },
      { x: 5400, y: 300, width: 200, height: 20 },
      { x: 5800, y: 360, width: 150, height: 20 },
      { x: 6200, y: 320, width: 200, height: 20 },
      { x: 6600, y: 380, width: 180, height: 20 },
      { x: 7000, y: 340, width: 150, height: 20 },
      { x: 7400, y: 300, width: 200, height: 20 },
      { x: 7800, y: 360, width: 180, height: 20 },
      { x: 8200, y: 320, width: 150, height: 20 },
      { x: 8600, y: 380, width: 200, height: 20 },
      { x: 9000, y: 340, width: 180, height: 20 },
      { x: 9400, y: 300, width: 150, height: 20 },
      { x: 9800, y: 360, width: 200, height: 20 },
      { x: 10200, y: 320, width: 180, height: 20 },
      { x: 10600, y: 380, width: 150, height: 20 },
      { x: 11000, y: 340, width: 200, height: 20 }
    ];
    
    platformData.forEach(platform => {
      // Create platform as static physics object
      const p = this.physics.add.staticImage(platform.x, platform.y, 'fire_ball');
      p.setVisible(false);
      p.setSize(platform.width, platform.height);
      p.setDisplaySize(platform.width, platform.height);
      this.platforms.add(p);
      
      // Add visual texture separately
      const platformGraphics = this.add.graphics();
      platformGraphics.fillStyle(0x8b4513);
      platformGraphics.fillRect(platform.x - platform.width/2, platform.y - platform.height/2, platform.width, platform.height);
      platformGraphics.lineStyle(2, 0x663300);
      platformGraphics.strokeRect(platform.x - platform.width/2, platform.y - platform.height/2, platform.width, platform.height);
      
      // Add decorative elements
      for (let i = 0; i < platform.width/20; i++) {
        const woodGrain = this.add.line(
          platform.x - platform.width/2 + 10 + i*20,
          platform.y,
          0, -platform.height/2 + 2,
          0, platform.height/2 - 2,
          0x663300
        );
      }
    });
    
    this.platformsCreated = true;
  }
  
  createHazards() {
  // CHANGED: Create hazards as a regular physics group instead of static
  this.hazards = this.physics.add.group();
  
  const hazardLocations = [
    { x: 950, y: this.groundY - 10 },
    { x: 1350, y: this.groundY - 10 },
    { x: 2000, y: this.groundY - 10 },
    { x: 2500, y: this.groundY - 10 },
    { x: 3200, y: this.groundY - 10 },
    { x: 4000, y: this.groundY - 10 },
    { x: 4400, y: this.groundY - 10 },
    { x: 5200, y: this.groundY - 10 },
    { x: 6000, y: this.groundY - 10 },
    { x: 6800, y: this.groundY - 10 },
    { x: 7500, y: this.groundY - 10 },
    { x: 8300, y: this.groundY - 10 },
    { x: 9100, y: this.groundY - 10 },
    { x: 9900, y: this.groundY - 10 },
    { x: 10700, y: this.groundY - 10 },
    { x: 11400, y: this.groundY - 10 }
  ];
  
  hazardLocations.forEach(loc => {
    // Create spikes visual
    const spikes = this.add.graphics();
    spikes.fillStyle(0x888888);
    
    // Draw triangle spikes
    for (let i = 0; i < 5; i++) {
      spikes.moveTo(loc.x - 40 + i*20, loc.y);
      spikes.lineTo(loc.x - 30 + i*20, loc.y - 20);
      spikes.lineTo(loc.x - 20 + i*20, loc.y);
      spikes.closePath();
      spikes.fill();
    }
    
    // FIXED: Create hazard as regular physics sprite (not static)
    const hazard = this.physics.add.sprite(loc.x, loc.y - 10, 'fire_ball');
    hazard.setVisible(false);
    hazard.setSize(100, 20);
    hazard.body.setAllowGravity(false);
    hazard.body.setImmovable(true);
    hazard.body.moves = false; // Don't let it move but keep it dynamic
    this.hazards.add(hazard);
    
    // Add warning sign
    const warningSign = this.add.text(loc.x, loc.y - 40, '⚠️', { fontSize: '24px' }).setOrigin(0.5);
  });
}
  createCheckpoints() {
  // Add checkpoints throughout the EXTENDED level
  const checkpointLocations = [
    { x: 1000, y: this.groundY - 150 },
    { x: 2000, y: this.groundY - 150 },
    { x: 3000, y: this.groundY - 150 },
    { x: 4000, y: this.groundY - 150 },
    { x: 5000, y: this.groundY - 150 },
    { x: 6000, y: this.groundY - 150 },
    { x: 7000, y: this.groundY - 150 },
    { x: 8000, y: this.groundY - 150 },
    { x: 9000, y: this.groundY - 150 },
    { x: 10000, y: this.groundY - 150 }
  ];
  
  checkpointLocations.forEach(loc => {
    // SIMPLE: Create checkpoint just like a coin - no complex positioning
    const checkpoint = this.physics.add.sprite(loc.x, loc.y, 'coin');
    checkpoint.setScale(0.05);
    checkpoint.setTint(0x00ffff);
    checkpoint.setAlpha(0.8);
    checkpoint.isCheckpoint = true;
    checkpoint.position = { x: loc.x, y: this.groundY };
    
    // Make checkpoint physics body larger for easier collision
    checkpoint.body.setSize(40, 40);
    checkpoint.body.setAllowGravity(false);
    checkpoint.body.setImmovable(true);
    checkpoint.body.moves = false; // IMPORTANT: Keep it completely still
    
    // SIMPLE ANIMATION: Only a tiny movement like your coins
    this.tweens.add({
      targets: checkpoint,
      y: loc.y - 10, // Only move 10 pixels up and down
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.checkpoints.add(checkpoint);
  });
}
  
  createPowerups() {
  // Create special powerups - EXTENDED for full level
  const powerupLocations = [
    { x: 1200, y: 250, type: 'speed' },
    { x: 2400, y: 280, type: 'shield' },
    { x: 3600, y: 260, type: 'multishot' },
    { x: 5000, y: 270, type: 'speed' },
    { x: 6500, y: 250, type: 'shield' },
    { x: 8000, y: 280, type: 'multishot' },
    { x: 9500, y: 260, type: 'speed' },
    { x: 11000, y: 270, type: 'shield' }
  ];
  
  powerupLocations.forEach(loc => {
    const floatCenter = loc.y - 10;
    const powerup = this.physics.add.sprite(loc.x, loc.y, 'fire_ball');
    powerup.setScale(0.5);
    
    // FIXED: Disable gravity on powerups
    powerup.body.setAllowGravity(false);
    powerup.body.setImmovable(true);
    powerup.body.moves = false;
    
    // Color based on type
    switch (loc.type) {
      case 'speed':
        powerup.setTint(0x00ff00);
        break;
      case 'shield':
        powerup.setTint(0x0000ff);
        break;
      case 'multishot':
        powerup.setTint(0xff00ff);
        break;
    }
    
    powerup.type = loc.type;
    
    // Add floating animation - FIXED: Keep powerup at consistent height
    this.tweens.add({
      targets: powerup,
      y: floatCenter - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Add rotation
    this.tweens.add({
      targets: powerup,
      rotation: Math.PI * 2,
      duration: 2000,
      repeat: -1
    });
    
    this.powerups.add(powerup);
  });
}
  
   reachCheckpoint(player, checkpoint) {
    if (!checkpoint.active) return; // CHANGED: Check active instead of checkpointReached flag
    
    // Save checkpoint position
    this.lastCheckpoint = { x: checkpoint.position.x, y: checkpoint.position.y };
    
    // Visual effect
    checkpoint.setTint(0xffff00);
    this.cameras.main.flash(500, 0, 255, 255);
    
    // Show message
    const checkpointText = this.add.text(
      checkpoint.x,
      checkpoint.y - 80,
      'Checkpoint Reached!',
      {
        font: '20px Arial',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: checkpointText,
      y: checkpointText.y - 50,
      alpha: 0,
      duration: 2000,
      onComplete: () => checkpointText.destroy()
    });
    
    // Disable checkpoint permanently
    checkpoint.disableBody(true, true);
    checkpoint.setActive(false);
    checkpoint.setVisible(false);
  
  }
  
  hitHazard(player, hazard) {
    if (this.hazardImmune) return;
    
    // Take damage
    this.hazardImmune = true;
    GameData.playerStats.health -= 10;
    this.healthText.setText(`Health: ${GameData.playerStats.health}`);
    
    // Visual effect
    this.cameras.main.shake(300, 0.02);
    this.cameras.main.flash(300, 255, 0, 0);
    
    // Knockback effect
    const knockbackDirection = player.x > hazard.x ? 1 : -1;
    player.setVelocity(knockbackDirection * 300, -300);
    
    // Show damage text
    const damageText = this.add.text(
      player.x,
      player.y - 50,
      '-10',
      {
        font: '24px Arial',
        fill: '#FF0000',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: damageText,
      y: damageText.y - 80,
      alpha: 0,
      duration: 1500,
      onComplete: () => damageText.destroy()
    });
    
    // Check for game over
    if (GameData.playerStats.health <= 0) {
      this.showGameOverScreen();
      return;
    }
    
    // Remove immunity after delay
    this.time.delayedCall(1500, () => {
      this.hazardImmune = false;
    });
  }
  
  collectPowerup(player, powerup) {
    if (!powerup.active) return;
    
    // Visual effect
    const explosion = this.add.circle(powerup.x, powerup.y, 30, 0xFFFFFF, 0.8);
    this.tweens.add({
      targets: explosion,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => explosion.destroy()
    });
    
    // Apply powerup effect
    switch(powerup.type) {
      case 'speed':
        // Speed boost
        this.player.speedBoost = 1.5;
        
        // Show effect
        const speedText = this.add.text(player.x, player.y - 50, 'Speed Boost!', {
          font: '20px Arial',
          fill: '#00FF00',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
          targets: speedText,
          y: speedText.y - 80,
          alpha: 0,
          duration: 1500,
          onComplete: () => speedText.destroy()
        });
        
        // Effect timer
        this.time.delayedCall(10000, () => {
          this.player.speedBoost = 1;
        });
        break;
        
      case 'shield':
        // Shield protection
        this.player.hasShield = true;
        
        // Visual shield
        const shield = this.add.circle(0, 0, 40, 0x0088ff, 0.4);
        this.playerShield = shield;
        
        // Shield follows player
        this.time.addEvent({
          delay: 100,
          callback: () => {
            if (this.player.hasShield && this.playerShield) {
              this.playerShield.x = this.player.x;
              this.playerShield.y = this.player.y;
            }
          },
          callbackScope: this,
          loop: true
        });
        
        // Show text
        const shieldText = this.add.text(player.x, player.y - 50, 'Shield Activated!', {
          font: '20px Arial',
          fill: '#0088FF',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
          targets: shieldText,
          y: shieldText.y - 80,
          alpha: 0,
          duration: 1500,
          onComplete: () => shieldText.destroy()
        });
        
        // Effect timer
        this.time.delayedCall(15000, () => {
          if (this.player.hasShield) {
            this.player.hasShield = false;
            if (this.playerShield) this.playerShield.destroy();
          }
        });
        break;
        
      case 'multishot':
        // Multiple fireballs
        this.player.hasMultishot = true;
        
        // Show text
        const multishotText = this.add.text(player.x, player.y - 50, 'Triple Shot!', {
          font: '20px Arial',
          fill: '#FF00FF',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
          targets: multishotText,
          y: multishotText.y - 80,
          alpha: 0,
          duration: 1500,
          onComplete: () => multishotText.destroy()
        });
        
        // Effect timer
        this.time.delayedCall(20000, () => {
          this.player.hasMultishot = false;
        });
        break;
    }
    
    // Remove powerup
    powerup.disableBody(true, true);
    powerup.setActive(false);
    powerup.setVisible(false);
  }
  
  createPowerMeter() {
    // Power meter background
    this.powerMeterBg = this.add.graphics()
      .fillStyle(0x000000, 0.7)
      .fillRoundedRect(800, 20, 120, 30, 5)
      .setScrollFactor(0);
      
    // Power meter fill
    this.powerMeterFill = this.add.graphics().setScrollFactor(0);
    
    // Power meter text
    this.powerMeterText = this.add.text(860, 35, 'FIRE POWER', {
      font: '14px Arial',
      fill: '#FFFFFF'
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Initial fill
    this.updatePowerMeter(100);
  }
  
  updatePowerMeter(value) {
    this.powerMeterFill.clear();
    this.powerMeterFill.fillStyle(value > 30 ? 0xFF6600 : 0xFF0000, 1);
    this.powerMeterFill.fillRoundedRect(805, 25, 110 * (value/100), 20, 3);
    
    // Make power meter pulse when low
    if (value < 30 && !this.powerMeterPulse) {
      this.powerMeterPulse = this.tweens.add({
        targets: this.powerMeterText,
        alpha: 0.5,
        duration: 300,
        yoyo: true,
        repeat: -1
      });
    } else if (value >= 30 && this.powerMeterPulse) {
      this.powerMeterPulse.stop();
      this.powerMeterText.alpha = 1;
      this.powerMeterPulse = null;
    }
  }
  
  toggleTargetingMode() {
    this.targetingMode = !this.targetingMode;
    
    if (this.targetingMode) {
      // Show targeting UI
      this.reticle.setVisible(true);
      this.reticleDirection.setVisible(true);
      
      // Show targeting message
      const targetingText = this.add.text(
        480, 100,
        "TARGETING MODE: Click/Tap to shoot fireballs!",
        {
          font: '20px Arial',
          fill: '#FF0000',
          backgroundColor: '#00000099',
          padding: { x: 10, y: 5 }
        }
      ).setOrigin(0.5).setScrollFactor(0);
      
      // Store reference and remove after short delay
      this.targetingText = targetingText;
      this.time.delayedCall(2000, () => {
        if (this.targetingText) this.targetingText.destroy();
      });
    } else {
      // Hide targeting UI
      this.reticle.setVisible(false);
      this.reticleDirection.setVisible(false);
      
      // Remove targeting message if it exists
      if (this.targetingText) {
        this.targetingText.destroy();
        this.targetingText = null;
      }
    }
  }
  
  createLeftEnemy() {
    // Create enemy from the left side
    const enemy = new Enemy(this, 
      this.player.x - Phaser.Math.Between(500, 700), 
      this.groundY, 
      GameData.levelConfigs[2].enemySpeed
    );
    enemy.fromLeft = true;
    enemy.setTint(0xFF6666); // Red tint for left enemies
    
    // Add health to make enemies more interesting
    enemy.health = 2;
    
    this.enemiesLeft.add(enemy);
    this.enemies.add(enemy); // Add to combined group
    return enemy;
  }
  
  createRightEnemy() {
    // Create enemy from the right side
    const enemy = new Enemy(this, 
      this.player.x + Phaser.Math.Between(500, 700), 
      this.groundY, 
      GameData.levelConfigs[2].enemySpeed - 10
    );
    enemy.fromLeft = false;
    enemy.setTint(0x6666FF); // Blue tint for right enemies
    
    // Add health to make enemies more interesting
    enemy.health = 2;
    
    this.enemiesRight.add(enemy);
    this.enemies.add(enemy); // Add to combined group
    return enemy;
  }
  
  createFlyingEnemy() {
    // Create flying enemies that swoop down
    const x = this.player.x + Phaser.Math.Between(-400, 400);
    const y = Phaser.Math.Between(100, 200);
    
    const enemy = new Enemy(this, x, y, GameData.levelConfigs[2].enemySpeed + 20);
    enemy.isFlying = true;
    enemy.setTint(0xDDA0DD); // Purple tint for flying enemies
    enemy.setScale(0.25); // Smaller size for flying enemies
    
    // Custom movement pattern
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (enemy.active) {
          // Swoop toward player
          this.tweens.add({
            targets: enemy,
            y: this.player.y - 20,
            duration: 1000,
            ease: 'Sine.easeIn',
            yoyo: true,
            onComplete: () => {
              if (enemy.active) {
                // Move to new position after swooping
                enemy.x = this.player.x + Phaser.Math.Between(-400, 400);
                enemy.y = Phaser.Math.Between(100, 200);
              }
            }
          });
        }
      },
      callbackScope: this,
      loop: true
    });
    
    this.enemies.add(enemy);
    return enemy;
  }
  
  showPowerGrantSequence() {
    // Create overlay
    const overlay = this.add.rectangle(
      this.cameras.main.scrollX + 480,
      270,
      960,
      540,
      0x000000,
      0.7
    );
    overlay.setScrollFactor(1);
    
    // Add Dadi with magic effect
    const dadi = new Dadi(this, this.player.x + 100, this.groundY);
    dadi.appear();
    
    // Add magical effect around player
    const magicCircle = this.add.circle(this.player.x, this.player.y - 30, 50, 0xFF6600, 0.7);
    
    // Add power text with improved story
    const powerText = this.add.text(
      this.cameras.main.scrollX + 480,
      150,
      `Dadi: The ancient village is under an evil curse, Aarav!\n\nThese magical flames will help you defeat the shadow spirits.\nUse SPACE to shoot or activate Targeting Mode with the 🎯 button.\n\nThe village elders left ${this.coinsToComplete} sacred coins to break the curse.\nFind them all to save your father!`,
      {
        font: '20px Arial',
        fill: '#FFFFFF',
        stroke: '#FF0000',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 700 }
      }
    ).setOrigin(0.5).setScrollFactor(1);
    
    // Create dramatic light rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ray = this.add.rectangle(
        this.player.x,
        this.player.y - 30,
        5,
        200,
        0xFFFF00,
        0.6
      );
      ray.setOrigin(0.5, 0);
      ray.setAngle(angle * (180/Math.PI));
      
      this.tweens.add({
        targets: ray,
        scaleY: 1.5,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: 2,
        onComplete: () => ray.destroy()
      });
    }
    
    // Player power-up animation with dramatic effects
    this.tweens.add({
      targets: this.player,
      alpha: 0.8,
      duration: 200,
      yoyo: true,
      repeat: 5,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Reset player alpha
        this.player.setAlpha(1);
        
        // Add a dramatic flash
        this.cameras.main.flash(500, 255, 200, 100);
        
        // Power surge effect
        const surge = this.add.circle(
          this.player.x,
          this.player.y - 30,
          5,
          0xFFFFFF,
          1
        );
        
        this.tweens.add({
          targets: surge,
          radius: 200,
          alpha: 0,
          duration: 800,
          ease: 'Cubic.easeOut',
          onComplete: () => surge.destroy()
        });
      }
    });
    
    // Magic circle animation
    this.tweens.add({
      targets: magicCircle,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0.4,
      duration: 500,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Clean up
        overlay.destroy();
        dadi.destroy();
        magicCircle.destroy();
        powerText.destroy();
        
        // Start the challenge
        this.chaseStarted = true;
        
        // Show controls hint with improved instructions
        const controlsHint = this.add.text(
          480,
          50,
          `QUEST: Break the village curse by collecting ${this.coinsToComplete} magical coins!\n🎯 = Toggle Targeting Mode | SPACE = Shoot | ARROWS = Move`,
          {
            font: '18px Arial',
            fill: '#FFFF00',
            backgroundColor: '#00000099',
            padding: { x: 10, y: 5 }
          }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Remove hint after 8 seconds
        this.time.delayedCall(8000, () => {
          controlsHint.destroy();
        });
        
        // Start enemy spawning
        this.startEnemySpawning();
      }
    });
  }
  
    startEnemySpawning() {
    // Set up recurring spawns from both sides - REDUCED FREQUENCY
    this.enemySpawnTimer = this.time.addEvent({
      delay: 8000, // Increased from 5000 to 8000ms (fewer enemies)
      callback: () => {
        // Randomly determine which type of enemy to spawn
        const enemyType = Phaser.Math.Between(0, 10);
        
        if (enemyType < 4) {
          this.createLeftEnemy();
        } else if (enemyType < 8) {
          this.createRightEnemy();
        } else {
          // Sometimes spawn flying enemies - reduced chance
          if (Phaser.Math.Between(0, 2) === 0) { // 1/3 chance instead of always
            this.createFlyingEnemy();
          }
        }
      },
      callbackScope: this,
      loop: true
    });
  }
  
  shootFireballAtPointer(pointer) {
    // Check cooldown
    if (this.fireballCooldown) return;
    
    // Set cooldown (400ms between shots - faster firing)
    this.fireballCooldown = true;
    this.fireballPower = Math.max(0, this.fireballPower - 15); // Reduce power on each shot
    this.updatePowerMeter(this.fireballPower);
    
    // Restore power over time
    this.time.delayedCall(400, () => {
      this.fireballCooldown = false;
    });
    
    // Check if we have enough power to shoot
    if (this.fireballPower < 10) {
      // Show out of power message
      const nopower = this.add.text(
        this.player.x,
        this.player.y - 50,
        "Recharging...",
        {
          font: '16px Arial',
          fill: '#FF0000',
          stroke: '#000000',
          strokeThickness: 3
        }
      ).setOrigin(0.5);
      
      this.tweens.add({
        targets: nopower,
        y: nopower.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => nopower.destroy()
      });
      
      return;
    }
    
    // Convert screen position to world position
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    
    // Calculate direction from player to pointer
    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y - 30,
      worldPoint.x, worldPoint.y
    );
    
    // Create fireball at player position
    const fireball = this.fireballs.get(
      this.player.x,
      this.player.y - 30
    );
    
    if (!fireball) return;
    
    // Set fireball properties
    fireball.setActive(true);
    fireball.setVisible(true);
    fireball.setScale(0.3);
    
    // Check if the body exists, if not create one
    if (!fireball.body) {
      this.physics.add.existing(fireball);
    }
    
    // Reset fireball physics properties
    fireball.body.setSize(20, 20);
    fireball.body.setAllowGravity(true);
    fireball.body.setGravity(0, 80); // Light gravity
    
    // Calculate velocity from angle
    const speed = this.fireballSpeed;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    fireball.setVelocity(velocityX, velocityY);
    fireball.rotation = angle;
    
    // Add rotation effect
    this.tweens.add({
      targets: fireball,
      rotation: fireball.rotation + (Math.PI * 4),
      duration: 1000,
      repeat: -1
    });
    
    // Add glow effect
    fireball.setAlpha(0.8);
    this.tweens.add({
      targets: fireball,
      alpha: 1,
      duration: 100,
      yoyo: true,
      repeat: -1
    });
    
    // Add multishot if player has the powerup
    if (this.player.hasMultishot) {
      // Create two additional fireballs at slight angles
      for (let i = -1; i <= 1; i += 2) {
        const offset = i * 0.3; // Angle offset in radians (about 17 degrees)
        const multiball = this.fireballs.get(
          this.player.x,
          this.player.y - 30
        );
        
        if (!multiball) continue;
        
        multiball.setActive(true);
        multiball.setVisible(true);
        multiball.setScale(0.25); // Slightly smaller
        
        if (!multiball.body) {
          this.physics.add.existing(multiball);
        }
        
        multiball.body.setSize(15, 15);
        multiball.body.setAllowGravity(true);
        multiball.body.setGravity(0, 80);
        
        const multiAngle = angle + offset;
        const multiVelocityX = Math.cos(multiAngle) * (speed * 0.9);
        const multiVelocityY = Math.sin(multiAngle) * (speed * 0.9);
        
        multiball.setVelocity(multiVelocityX, multiVelocityY);
        multiball.rotation = multiAngle;
        
        // Slightly different rotation effect
        this.tweens.add({
          targets: multiball,
          rotation: multiball.rotation + (Math.PI * 4),
          duration: 800,
          repeat: -1
        });
        
        multiball.setTint(0xFF00FF); // Purple tint for multishot
        multiball.setAlpha(0.8);
        
        // Auto-destroy after 3 seconds
        this.time.delayedCall(3000, () => {
          if (multiball && multiball.active) {
            const fizzle = this.add.circle(multiball.x, multiball.y, 10, 0xFF3300, 0.6);
            this.tweens.add({
              targets: fizzle,
              scale: 1.5,
              alpha: 0,
              duration: 200,
              onComplete: () => fizzle.destroy()
            });
            
            multiball.setActive(false);
            multiball.setVisible(false);
          }
        });
      }
    }
    
    // Create fire trail effect
    this.time.addEvent({
      delay: 40,
      callback: () => {
        if (fireball.active) {
          const trail = this.add.circle(
            fireball.x - (Math.cos(angle) * Phaser.Math.Between(5, 15)),
            fireball.y - (Math.sin(angle) * Phaser.Math.Between(5, 15)),
            Phaser.Math.Between(3, 8),
            0xFF6600,
            0.7
          );
          
          this.tweens.add({
            targets: trail,
            alpha: 0,
            scale: 0.5,
            duration: 300,
            onComplete: () => trail.destroy()
          });
        }
      },
      repeat: 25
    });
    
    // Play sound
    try {
      if (this.sound && this.sound.context) {
        const audioContext = this.sound.context;
        
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
        gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(900, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(450, audioContext.currentTime + 0.2);
        gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.3);
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.log('Error playing fireball sound:', error);
    }
    
    // Auto-destroy after 3 seconds
    this.time.delayedCall(3000, () => {
      if (fireball && fireball.active) {
        const fizzle = this.add.circle(fireball.x, fireball.y, 15, 0xFF3300, 0.8);
        this.tweens.add({
          targets: fizzle,
          scale: 2,
          alpha: 0,
          duration: 300,
          onComplete: () => fizzle.destroy()
        });
        
        fireball.setActive(false);
        fireball.setVisible(false);
      }
    });
  }
  
  hitPlatform(fireball, platform) {
    // Create spark effect when fireball hits platform
    const sparks = this.add.particles(fireball.x, fireball.y, 'fire_ball', {
      scale: { start: 0.2, end: 0.01 },
      speed: { min: 50, max: 100 },
      angle: { min: 0, max: 360 },
      lifespan: 500,
      quantity: 10,
      alpha: { start: 0.8, end: 0 }
    });
    
    // Stop particle emission after short time
    this.time.delayedCall(200, () => {
      sparks.destroy();
    });
    
    // Disable fireball
    fireball.setActive(false);
    fireball.setVisible(false);
  }
  
  hitEnemyWithFireball(fireball, enemy) {
    // Disable fireball
    fireball.setActive(false);
    fireball.setVisible(false);
    
    // Create dramatic explosion effect
    const explosion = this.add.circle(enemy.x, enemy.y, 30, 0xFF0000, 0.8);
    this.tweens.add({
      targets: explosion,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => explosion.destroy()
    });
    
    // Create multiple explosion particles
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(
        enemy.x + Phaser.Math.Between(-20, 20),
        enemy.y + Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(5, 10),
        0xFF7700,
        0.8
      );
      
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-60, 60),
        y: particle.y + Phaser.Math.Between(-60, 60),
        scale: 0.5,
        alpha: 0,
        duration: Phaser.Math.Between(300, 600),
        onComplete: () => particle.destroy()
      });
    }
    
    // Create flash effect
    this.cameras.main.flash(200, 255, 150, 50);
    
    // Enemy takes damage or dies
    if (enemy.health > 1) {
      // Reduce enemy health
      enemy.health--;
      
      // Show damage text
      const damageText = this.add.text(
        enemy.x, 
        enemy.y - 40, 
        'HIT!', 
        {
          font: '16px Arial',
          fill: '#FFFFFF',
          stroke: '#FF0000',
          strokeThickness: 3
        }
      ).setOrigin(0.5);
      
      this.tweens.add({
        targets: damageText,
        y: damageText.y - 30,
        alpha: 0,
        duration: 800,
        onComplete: () => damageText.destroy()
      });
      
      // Flash enemy
      this.tweens.add({
        targets: enemy,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 3
      });
      
      return;
    }
    
    // Enemy is destroyed
    // Make enemy fly off screen and fall when hit
    const enemyDirection = enemy.x > this.player.x ? 1 : -1;
    enemy.body.setVelocity(enemyDirection * 300, -300);
    enemy.body.setGravityY(1200);
    enemy.body.setAngularVelocity(enemyDirection * 300);
    
    // Add coins for enemy defeated - increment both UI counter and game stats
    this.coinsCollected++;
    GameData.playerStats.coins++;
    this.coinText.setText(`Coins: ${this.coinsCollected}/${this.coinsToComplete}`);
    this.updateProgressBar(this.coinsCollected);
    
    // Show score popup
    const scoreText = this.add.text(enemy.x, enemy.y - 40, '+1', {
      font: '20px Arial',
      fill: '#FFFF00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: scoreText,
      y: scoreText.y - 60,
      alpha: 0,
      duration: 1000,
      onComplete: () => scoreText.destroy()
    });
    
    // Destroy enemy after animation
    this.time.delayedCall(1000, () => {
      if (enemy && enemy.active) {
        enemy.destroy();
      }
    });
    
    // Restore some power on successful hit
    this.fireballPower = Math.min(100, this.fireballPower + 20);
    this.updatePowerMeter(this.fireballPower);
    
    // Add new enemy after some time
    this.time.delayedCall(2000, () => {
      // Spawn from either side randomly
      if (Phaser.Math.Between(0, 1) === 0) {
        this.createLeftEnemy();
      } else {
        this.createRightEnemy();
      }
    });
    
    // Check for level completion
    this.checkLevelCompletion();
  }
  
   createCoins() {
    // Clear any existing coins first
    if (this.coins) {
      this.coins.clear(true, true);
    }
    
    // Create 50+ coins distributed throughout the EXTENDED level
    
    // Base coins spread across entire level (30 coins)
    for (let i = 0; i < 30; i++) {
      const x = 300 + (i * 350) + Phaser.Math.Between(-30, 30); // Spread across 10500 units
      const y = this.groundY - Phaser.Math.Between(50, 120);
      
      const coin = new Coin(this, x, y);
      this.coins.add(coin);
    }
    
    // Platform coins (15 coins)
    const platformCoins = 15;
    
    if (!this.platformsCreated) {
      this.time.delayedCall(100, () => this.createPlatformCoins(platformCoins));
    } else {
      this.createPlatformCoins(platformCoins);
    }
    
    // Special pattern coins (10 coins)
    const patternCount = 10;
    this.createPatternCoins(patternCount);
    
    console.log(`Created coins for extended level - need ${this.coinsToComplete} to complete`);
  }
  
  createPlatformCoins(count) {
    // Add coins on top of platforms
    if (this.platforms && this.platforms.children && this.platforms.children.entries) {
      const platforms = this.platforms.children.entries;
      
      for (let i = 0; i < Math.min(count, platforms.length); i++) {
        const platform = platforms[i];
        const x = platform.x + Phaser.Math.Between(-platform.width/3, platform.width/3);
        const y = platform.y - platform.height - 15;
        
        const coin = new Coin(this, x, y);
        this.coins.add(coin);
      }
    }
  }
  
  createPatternCoins(count) {
    // Create coins in special patterns (circles, rows, etc.)
    
    // Circle pattern
    const centerX = 2500;
    const centerY = 250;
    const radius = 80;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const coin = new Coin(this, x, y);
      this.coins.add(coin);
    }
    
    // Vertical stacks
    for (let i = 0; i < 2; i++) {
      const baseX = 1200 + (i * 1500);
      
      for (let j = 0; j < 5; j++) {
        const coin = new Coin(this, baseX, this.groundY - 50 - (j * 50));
        this.coins.add(coin);
      }
    }
  }
  
  createUI() {
    // Coin counter - updated with new target
    this.coinText = this.add.text(20, 20, `Coins: 0/${this.coinsToComplete}`, {
      font: '24px Arial',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: "#000000AA", 
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Distance tracker
    this.distanceText = this.add.text(20, 60, 'Distance: 0/100m', {
      font: '24px Arial',
      fill: '#00FF00',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: "#000000AA", 
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Health indicator
    this.healthText = this.add.text(20, 100, `Health: ${GameData.playerStats.health}`, {
      font: '24px Arial',
      fill: '#FF0000',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: "#000000AA", 
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Direction indicator for enemies
    this.directionIndicator = this.add.container(480, 20).setScrollFactor(0);
    
    const indicatorBg = this.add.rectangle(0, 0, 200, 30, 0x000000, 0.7);
    const leftArrow = this.add.text(-70, 0, '←', { 
      fontSize: '20px', 
      fill: '#FF6666' 
    }).setOrigin(0.5);
    const rightArrow = this.add.text(70, 0, '→', { 
      fontSize: '20px', 
      fill: '#6666FF' 
    }).setOrigin(0.5);
    const warningText = this.add.text(0, 0, 'ENEMIES!', { 
      fontSize: '16px', 
      fill: '#FFFFFF' 
    }).setOrigin(0.5);
    
    this.directionIndicator.add([indicatorBg, leftArrow, rightArrow, warningText]);
    
    // Make arrows pulse
    this.tweens.add({
      targets: [leftArrow, rightArrow],
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // Progress bar for coin collection
    this.progressBarBg = this.add.graphics()
      .fillStyle(0x000000, 0.7)
      .fillRoundedRect(300, 20, 200, 20, 5)
      .setScrollFactor(0);
    
    this.progressBarFill = this.add.graphics().setScrollFactor(0);
    this.updateProgressBar(0);
    
    // Targeting mode indicator
    this.targetingIndicator = this.add.text(660, 20, '🎯 OFF', {
      font: '20px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#000000AA',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Initialize fireball power to 100%
    this.fireballPower = 100;
  }
  
       updateProgressBar(value) {
    // Add robust null checks for all operations
    if (!this.progressBarFill || this.progressBarFill.destroyed) return;
    
    try {
      // Update progress bar based on coin collection
      this.progressBarFill.clear();
      this.progressBarFill.fillStyle(0x00FF00, 1);
      this.progressBarFill.fillRoundedRect(302, 22, 196 * (value/this.coinsToComplete), 16, 3);
      
      // Update targeting indicator with extensive null check
      if (this.targetingIndicator && !this.targetingIndicator.destroyed) {
        this.targetingIndicator.setText(this.targetingMode ? '🎯 ON' : '🎯 OFF');
        
        // Safe check before setting background color
        if (this.targetingIndicator.style && typeof this.targetingIndicator.setBackgroundColor === 'function') {
          this.targetingIndicator.setBackgroundColor(this.targetingMode ? '#880000AA' : '#000000AA');
        }
      }
    } catch (error) {
      console.log('Error in updateProgressBar:', error);
    }
  }
  
  collectCoin(player, coin) {
    // Prevent double collection
    if (coin.collected) return;
     try {
      if (this.sound && this.sound.context) {
        const audioContext = this.sound.context;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log('Error playing coin sound:', error);
    }
    
    // Collect the coin
    coin.collect();
    this.coinsCollected++;
    this.coinText.setText(`Coins: ${this.coinsCollected}/${this.coinsToComplete}`);
    this.updateProgressBar(this.coinsCollected);
    
    // Update global stats
    GameData.playerStats.coins++;
    
    // Ensure player doesn't fall after collection
    // By setting velocityY to 0 if player is near ground
    const onGround = player.y >= this.groundY - 10;
    if (onGround) {
      player.y = this.groundY;
      player.setVelocityY(0);
    }
    
    // Restore some firepower when collecting coins
    this.fireballPower = Math.min(100, this.fireballPower + 15);
    this.updatePowerMeter(this.fireballPower);
    
    // Check for level completion
    this.checkLevelCompletion();
  }
  
  checkLevelCompletion() {
    // Check if both conditions are met
    if (this.coinsCollected >= this.coinsToComplete && this.distanceRun >= 100) {
      this.completeLevel();
    } else if (this.coinsCollected >= this.coinsToComplete) {
      // If only coins are collected, notify player about distance
      if (!this.distanceNotification) {
        this.distanceNotification = this.add.text(
          480, 150,
          "Coins collected! Now run 100 meters to break the curse!",
          {
            font: '20px Arial',
            fill: '#FFFF00',
            backgroundColor: '#000000AA',
            padding: { x: 10, y: 5 }
          }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Remove after 5 seconds
        this.time.delayedCall(5000, () => {
          if (this.distanceNotification) {
            this.distanceNotification.destroy();
            this.distanceNotification = null;
          }
        });
      }
    }
  }

  hitByEnemy(player, enemy) {
    // ADDED: Early return if game is already over
    if (this.levelComplete) return;
    
    // Check if player has shield
    if (this.player.hasShield) {
      // ADDED: Check shield cooldown to prevent spam
      if (this.shieldCooldown) return;
      
      // Set cooldown
      this.shieldCooldown = true;
      this.time.delayedCall(500, () => {
        this.shieldCooldown = false;
      });
      
      // Shield blocks damage
      const shieldHitEffect = this.add.circle(player.x, player.y, 45, 0x0088ff, 0.6);
      this.tweens.add({
        targets: shieldHitEffect,
        scale: 2,
        alpha: 0,
        duration: 500,
        onComplete: () => shieldHitEffect.destroy()
      });
      
      // Show shield block message
      const shieldText = this.add.text(player.x, player.y - 60, 'SHIELD BLOCK!', {
        font: '18px Arial',
        fill: '#0088FF',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: shieldText,
        y: shieldText.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => shieldText.destroy()
      });
      
      return;
    }
    
    // Prevent rapid damage
    if (this.damageTime && this.time.now - this.damageTime < 1000) return;
    
    this.damageTime = this.time.now;
    GameData.playerStats.health -= 10;
    this.healthText.setText(`Health: ${GameData.playerStats.health}`);
    
    // Different flash effect based on enemy direction
    if (enemy.fromLeft) {
      this.cameras.main.flash(200, 255, 100, 100); // Reddish flash
    } else {
      this.cameras.main.flash(200, 100, 100, 255); // Bluish flash
    }
    
    // Reduce firepower when hit
    this.fireballPower = Math.max(0, this.fireballPower - 25);
    this.updatePowerMeter(this.fireballPower);
    
    // Game over if health depleted - MODIFIED to restart Level2
    if (GameData.playerStats.health <= 0) {
      // ADDED: Set levelComplete immediately to prevent multiple calls
      this.levelComplete = true;
      this.showGameOverScreen();
    }
  }
  
  // hitByEnemy(player, enemy) {
  //   // Check if player has shield
  //   if (this.player.hasShield) {
  //     // Shield blocks damage
  //     const shieldHitEffect = this.add.circle(player.x, player.y, 45, 0x0088ff, 0.6);
  //     this.tweens.add({
  //       targets: shieldHitEffect,
  //       scale: 2,
  //       alpha: 0,
  //       duration: 500,
  //       onComplete: () => shieldHitEffect.destroy()
  //     });
      
  //     // Show shield block message
  //     const shieldText = this.add.text(player.x, player.y - 60, 'SHIELD BLOCK!', {
  //       font: '18px Arial',
  //       fill: '#0088FF',
  //       stroke: '#000000',
  //       strokeThickness: 3
  //     }).setOrigin(0.5);
      
  //     this.tweens.add({
  //       targets: shieldText,
  //       y: shieldText.y - 30,
  //       alpha: 0,
  //       duration: 1000,
  //       onComplete: () => shieldText.destroy()
  //     });
      
  //     return;
  //   }
    
  //   // Prevent rapid damage
  //   if (this.damageTime && this.time.now - this.damageTime < 1000) return;
    
  //   this.damageTime = this.time.now;
  //   GameData.playerStats.health -= 10;
  //   this.healthText.setText(`Health: ${GameData.playerStats.health}`);
    
  //   // Different flash effect based on enemy direction
  //   if (enemy.fromLeft) {
  //     this.cameras.main.flash(200, 255, 100, 100); // Reddish flash
  //   } else {
  //     this.cameras.main.flash(200, 100, 100, 255); // Bluish flash
  //   }
    
  //   // Reduce firepower when hit
  //   this.fireballPower = Math.max(0, this.fireballPower - 25);
  //   this.updatePowerMeter(this.fireballPower);
    
  //   // Game over if health depleted - MODIFIED to restart Level2
  //   if (GameData.playerStats.health <= 0) {
  //     this.showGameOverScreen();
  //   }
  // }
  
  //   showGameOverScreen() {
  //   // Disable all game functionality
  //   this.levelComplete = true; // Prevents update logic
  //   this.chaseStarted = false;
    
  //   // Stop all movement and enemies
  //   this.player.setVelocity(0, 0);
    
  //   // Disable player controls
  //   this.player.active = false;
  //   this.player.body.moves = false;
    
  //   // Stop enemy spawning
  //   if (this.enemySpawnTimer) {
  //     this.enemySpawnTimer.destroy();
  //   }
    
  //   // Freeze all enemies
  //   this.enemies.getChildren().forEach(enemy => {
  //     enemy.setVelocity(0, 0);
  //     enemy.body.moves = false;
  //   });
    
  //   // Create overlay with fade-in
  //   const overlay = this.add.rectangle(
  //     this.cameras.main.scrollX + 480,
  //     270,
  //     960, 
  //     540,
  //     0x000000,
  //     0
  //   ).setScrollFactor(1);
    
  //   this.tweens.add({
  //     targets: overlay,
  //     alpha: 0.9,
  //     duration: 1000
  //   });
    
  //   // Game over text with animation
  //   const gameOverText = this.add.text(
  //     this.cameras.main.scrollX + 480,
  //     100,
  //     'GAME OVER',
  //     {
  //       font: '64px Arial',
  //       fill: '#FF0000',
  //       stroke: '#000000',
  //       strokeThickness: 6,
  //       align: 'center'
  //     }
  //   ).setOrigin(0.5).setScrollFactor(1).setAlpha(0);
    
  //   this.tweens.add({
  //     targets: gameOverText,
  //     alpha: 1,
  //     y: 200,
  //     duration: 1000,
  //     ease: 'Bounce.easeOut'
  //   });
    
  //   // Create a proper button for retrying instead of just text
  //   const buttonBackground = this.add.rectangle(
  //     this.cameras.main.scrollX + 480,
  //     350,
  //     250,
  //     60,
  //     0x660000,
  //     1
  //   ).setOrigin(0.5).setScrollFactor(1).setAlpha(0).setInteractive();
    
  //   const retryText = this.add.text(
  //     this.cameras.main.scrollX + 480,
  //     350,
  //     'TRY AGAIN',
  //     {
  //       font: '32px Arial',
  //       fill: '#FFFFFF',
  //       stroke: '#000000',
  //       strokeThickness: 3,
  //       align: 'center'
  //     }
  //   ).setOrigin(0.5).setScrollFactor(1).setAlpha(0);
    
  //   // Show button with delay
  //   this.tweens.add({
  //     targets: [buttonBackground, retryText],
  //     alpha: 1,
  //     delay: 1000,
  //     duration: 1000
  //   });
    
  //   // Button hover effect
  //   buttonBackground.on('pointerover', () => {
  //     buttonBackground.fillColor = 0x990000;
  //   });
    
  //   buttonBackground.on('pointerout', () => {
  //     buttonBackground.fillColor = 0x660000;
  //   });
    
  //   // Wait for click on the button to restart (not anywhere on screen)
  //   buttonBackground.on('pointerdown', () => {
  //     // Proper cleanup before restart
  //     this.cleanup();
      
  //     // Completely stop the current scene and restart it fresh
  //     this.scene.stop('Level2Scene');
  //     this.scene.start('Level2Scene');
  //   });
  // }
  // showGameOverScreen() {
  // // Disable all game functionality
  // this.levelComplete = true;
  // this.chaseStarted = false;
  
  // // Stop all movement and enemies
  // this.player.setVelocity(0, 0);
  // this.player.active = false;
  // this.player.body.moves = false;
  
  // // Stop enemy spawning
  // if (this.enemySpawnTimer) {
  //   this.enemySpawnTimer.destroy();
  // }
  
  // // Freeze all enemies
  // if (this.enemies) {
  //   this.enemies.getChildren().forEach(enemy => {
  //     enemy.setVelocity(0, 0);
  //     enemy.body.moves = false;
  //   });
  // }
  showGameOverScreen() {
  // ADDED: Prevent multiple game over screens
  if (this.gameOverShown) return;
  this.gameOverShown = true;
  
  // Disable all game functionality
  this.levelComplete = true;
  this.chaseStarted = false;
  
  // Stop all movement and enemies
  this.player.setVelocity(0, 0);
  this.player.setAcceleration(0, 0); // ADDED: Clear any acceleration
  this.player.body.stop(); // ADDED: Stop all movement
  this.player.active = false;
  this.player.body.moves = false;
  // ADDED: Disable player physics to prevent further collisions
  this.player.body.enable = false;
  
  // Stop enemy spawning
  if (this.enemySpawnTimer) {
    this.enemySpawnTimer.destroy();
  }
  
  // Freeze all enemies
  if (this.enemies) {
    this.enemies.getChildren().forEach(enemy => {
      enemy.setVelocity(0, 0);
      enemy.body.moves = false;
      // ADDED: Disable enemy physics to stop collisions
      if (enemy.body) {
        enemy.body.enable = false;
      }
    });
  }
  
  // Create overlay with fade-in
  const overlay = this.add.rectangle(
    this.cameras.main.scrollX + 480,
    270,
    960, 
    540,
    0x000000,
    0
  ).setScrollFactor(1).setDepth(9998);
  
  this.tweens.add({
    targets: overlay,
    alpha: 0.9,
    duration: 1000
  });
  
  // Game over text with animation
  const gameOverText = this.add.text(
    this.cameras.main.scrollX + 480,
    100,
    'GAME OVER',
    {
      font: '64px Arial',
      fill: '#FF0000',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(1).setAlpha(0).setDepth(9999);
  
  this.tweens.add({
    targets: gameOverText,
    alpha: 1,
    y: 200,
    duration: 1000,
    ease: 'Bounce.easeOut'
  });
  
  // Create a proper button for retrying
  const buttonBackground = this.add.rectangle(
    this.cameras.main.scrollX + 480,
    350,
    250,
    60,
    0x660000,
    1
  ).setOrigin(0.5).setScrollFactor(1).setAlpha(0).setInteractive().setDepth(9999);
  
  const retryText = this.add.text(
    this.cameras.main.scrollX + 480,
    350,
    'TRY AGAIN',
    {
      font: '32px Arial',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(1).setAlpha(0).setDepth(10000);
  
  // Show button with delay
  this.tweens.add({
    targets: [buttonBackground, retryText],
    alpha: 1,
    delay: 1000,
    duration: 1000
  });
  
  // Button hover effect
  buttonBackground.on('pointerover', () => {
    buttonBackground.fillColor = 0x990000;
  });
  
  buttonBackground.on('pointerout', () => {
    buttonBackground.fillColor = 0x660000;
  });
  
  // FIXED: Proper restart logic
  buttonBackground.once('pointerdown', () => {
    console.log('🔄 Retry button clicked - Restarting Level 2...');
    
    // Disable the button immediately to prevent double-clicks
    buttonBackground.disableInteractive();
    retryText.setAlpha(0.5);

     this.gameOverShown = false;
    
    // Fade out
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Clean up mobile controls specifically
      if (this.mobileControls) {
        this.mobileControls.left = false;
        this.mobileControls.right = false;
        this.mobileControls.up = false;
        this.mobileControls.shoot = false;
      }
      
      // Proper cleanup
      this.cleanup();
      
      // Reset game data for fresh start
      GameData.playerStats.health = 100;
      GameData.playerStats.coins = 0;
      GameData.playerStats.currentLevel = 2;
      
      // Stop and restart the scene
      this.scene.stop('Level2Scene');
      this.scene.start('Level2Scene');
    });
  });
}


    // Add cleanup method to properly clean up the scene
  cleanup() {
    // Destroy all tweens
    this.tweens.killAll();
    
    // Destroy all timers
    if (this.enemySpawnTimer) this.enemySpawnTimer.destroy();
    this.time.removeAllEvents();

    // FIXED: Properly clean up background images
    if (this.backgrounds && this.backgrounds.length > 0) {
      this.backgrounds.forEach(bg => {
        if (bg && !bg.destroyed) {
          bg.destroy();
        }
      });
      this.backgrounds = [];
    }
    
    // Properly destroy all UI elements
    if (this.coinText) this.coinText.destroy();
    if (this.distanceText) this.distanceText.destroy();
    if (this.healthText) this.healthText.destroy();
    if (this.directionIndicator) this.directionIndicator.destroy();
    if (this.targetingIndicator) this.targetingIndicator.destroy();
    if (this.progressBarFill) this.progressBarFill.destroy();
    if (this.progressBarBg) this.progressBarBg.destroy();
    if (this.powerMeterFill) this.powerMeterFill.destroy();
    if (this.powerMeterBg) this.powerMeterBg.destroy();
    if (this.reticle) this.reticle.destroy();
    if (this.reticleDirection) this.reticleDirection.destroy();
    if (this.storyText) this.storyText.destroy();
    
    // Clear all graphics objects
    if (this.progressBarFill && !this.progressBarFill.destroyed) this.progressBarFill.clear();
    if (this.progressBarBg && !this.progressBarBg.destroyed) this.progressBarBg.clear();
    if (this.powerMeterFill && !this.powerMeterFill.destroyed) this.powerMeterFill.clear();
    if (this.powerMeterBg && !this.powerMeterBg.destroyed) this.powerMeterBg.clear();
    

     // FIXED: Clean up groups properly
    if (this.coins) {
      this.coins.clear(true, true);
      this.coins = null;
    }
    if (this.enemies) {
      this.enemies.clear(true, true);
      this.enemies = null;
    }
    if (this.enemiesLeft) {
      this.enemiesLeft.clear(true, true);
      this.enemiesLeft = null;
    }
    if (this.enemiesRight) {
      this.enemiesRight.clear(true, true);
      this.enemiesRight = null;
    }
    if (this.fireballs) {
      this.fireballs.clear(true, true);
      this.fireballs = null;
    }
    if (this.platforms) {
      this.platforms.clear(true, true);
      this.platforms = null;
    }
    if (this.hazards) {
      this.hazards.clear(true, true);
      this.hazards = null;
    }
    if (this.checkpoints) {
      this.checkpoints.clear(true, true);
      this.checkpoints = null;
    }
    if (this.powerups) {
      this.powerups.clear(true, true);
      this.powerups = null;
    }


    this.gameOverShown = false;
    this.levelComplete = false;
    this.chaseStarted = false;
    this.shieldCooldown = false;
    // Nullify all references to UI elements
    this.coinText = null;
    this.distanceText = null;
    this.healthText = null;
    this.directionIndicator = null;
    this.targetingIndicator = null;
    this.progressBarFill = null;
    this.progressBarBg = null;
    this.powerMeterFill = null;
    this.powerMeterBg = null;
    this.powerMeterPulse = null;
    this.targetingText = null;
    this.distanceNotification = null;
    this.reticle = null;
    this.reticleDirection = null;
    this.storyText = null;

    this.backgrounds = null;
  }
  
 completeLevel() {
  if (this.levelComplete) return;
  this.levelComplete = true;
  
  // Stop enemy spawning
  if (this.enemySpawnTimer) {
    this.enemySpawnTimer.destroy();
  }
  
  // Freeze player and enemies
  this.player.setVelocity(0, 0);
  this.enemies.getChildren().forEach(enemy => {
    enemy.setVelocity(0, 0);
  });
  
  // Create overlay
  const overlay = this.add.rectangle(
    this.cameras.main.scrollX + 480,
    270,
    960,
    540,
    0x000000,
    0.7
  ).setScrollFactor(1);
  
  // Add congratulations text
  const victoryText = this.add.text(
    this.cameras.main.scrollX + 480,
    200,
    'LEVEL COMPLETE!',
    {
      font: '48px Arial',
      fill: '#00FF00',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(1);
  
  // Add dadi with congratulations
  this.time.delayedCall(2000, () => {
    const dadi = new Dadi(this, this.player.x + 150, this.groundY);
    dadi.appear();
    
    const messageText = this.add.text(
      this.cameras.main.scrollX + 480,
      300,
      'Dadi: Well done, Aarav! You broke the village curse!\nNow we must continue our journey to save your father!',
      {
        font: '24px Arial',
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 600 }
      }
    ).setOrigin(0.5).setScrollFactor(1);
    
    // MODIFIED: Continue button that shows construction message
    const continueButton = this.add.text(
      this.cameras.main.scrollX + 480,
      400,
      'Continue to Level 3',
      {
        font: '32px Arial',
        fill: '#FFD700',
        backgroundColor: '#000000AA',
        padding: { x: 16, y: 8 }
      }
    ).setOrigin(0.5).setScrollFactor(1).setInteractive();
    
    // Add glow effect to button
    this.tweens.add({
      targets: continueButton,
      alpha: 0.7,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // MODIFIED: Click event shows construction message
    continueButton.on('pointerdown', () => {
      // Stop the glow animation
      this.tweens.killTweensOf(continueButton);
      continueButton.setAlpha(1);
      
      // Hide the continue button
      continueButton.setVisible(false);
      
      // Show construction message
      this.showLevel3ConstructionMessage();
    });
  });
}

// NEW METHOD: Show Level 3 under construction message
// NEW METHOD: Show Level 3 under construction message
showLevel3ConstructionMessage() {
  // Create construction overlay with gradient background
  const constructionOverlay = this.add.rectangle(
    this.cameras.main.scrollX + 480,
    270,
    900,
    400,
    0x1a1a2e,
    0.95
  ).setScrollFactor(1);
  
  // Add decorative border
  const border = this.add.graphics().setScrollFactor(1);
  border.lineStyle(4, 0xFFD700);
  border.strokeRoundedRect(
    this.cameras.main.scrollX + 30,
    70,
    900,
    400,
    10
  );
  
  // Construction icon with animation
  const constructionIcon = this.add.text(
    this.cameras.main.scrollX + 480,
    150,
    '🚧',
    {
      font: '64px Arial'
    }
  ).setOrigin(0.5).setScrollFactor(1);
  
  // Animate the construction icon
  this.tweens.add({
    targets: constructionIcon,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });
  
  // Main construction message
  const constructionTitle = this.add.text(
    this.cameras.main.scrollX + 480,
    220,
    'LEVEL 3 UNDER CONSTRUCTION',
    {
      font: '36px Arial',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(1);
  
  // Friendly message from Dadi
  const friendlyMessage = this.add.text(
    this.cameras.main.scrollX + 480,
    280,
    'Dadi: "Be patient, dear Aarav!\nThe village elders are still preparing the next temple.\nFor now, rest and practice your skills!"',
    {
      font: '20px Arial',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 700 },
      lineSpacing: 8
    }
  ).setOrigin(0.5).setScrollFactor(1);
  
  // Encouraging subtitle
  const subtitle = this.add.text(
    this.cameras.main.scrollX + 480,
    350,
    'Thank you for playing! More adventures await...',
    {
      font: '18px Arial',
      fill: '#CCCCCC',
      fontStyle: 'italic',
      align: 'center'
    }
  ).setOrigin(0.5).setScrollFactor(1);
  
  // Sparkle effects around the message
  for (let i = 0; i < 12; i++) {
    const sparkle = this.add.circle(
      this.cameras.main.scrollX + 480 + Phaser.Math.Between(-400, 400),
      270 + Phaser.Math.Between(-150, 150),
      Phaser.Math.Between(2, 5),
      0xFFD700,
      0.8
    ).setScrollFactor(1);
    
    this.tweens.add({
      targets: sparkle,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: Phaser.Math.Between(1500, 3000),
      delay: i * 200,
      onComplete: () => sparkle.destroy()
    });
  }
  
  // MODIFIED: Return to Home Screen button
  const returnButton = this.add.text(
    this.cameras.main.scrollX + 480,
    420,
    'Return to Home Screen',
    {
      font: '28px Arial',
      fill: '#00FF00',
      backgroundColor: '#004400AA',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 2
    }
  ).setOrigin(0.5).setScrollFactor(1).setInteractive();
  
  // Button hover effects
  returnButton.on('pointerover', () => {
    returnButton.setScale(1.05);
    returnButton.setBackgroundColor('#006600AA');
  });
  
  returnButton.on('pointerout', () => {
    returnButton.setScale(1);
    returnButton.setBackgroundColor('#004400AA');
  });
  
  // MODIFIED: Button click animation and redirect to home screen
 returnButton.on('pointerdown', () => {
  // Button press animation
  this.tweens.add({
    targets: returnButton,
    scaleX: 0.95,
    scaleY: 0.95,
    duration: 100,
    yoyo: true,
    onComplete: () => {
      // Fade out effect
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      
      // Wait for fade then redirect
      this.time.delayedCall(1000, () => {
        // FIXED: Proper cleanup before switching scenes
        this.cleanup();
        
        // Reset player stats for fresh start
        GameData.playerStats.health = 100;
        GameData.playerStats.coins = 0;
        GameData.playerStats.currentLevel = 1;
        
        // FIXED: Stop current scene properly before starting new one
        this.scene.stop('Level2Scene');
        this.scene.start('PreloadScene');
      });
    }
  });
});
  
  // Add entrance animation for the whole message
  const elementsToAnimate = [
    constructionOverlay, border, constructionIcon, 
    constructionTitle, friendlyMessage, subtitle, returnButton
  ];
  
  elementsToAnimate.forEach((element, index) => {
    element.setAlpha(0);
    this.tweens.add({
      targets: element,
      alpha: 1,
      y: element.y + 20,
      duration: 600,
      delay: index * 100,
      ease: 'Back.easeOut'
    });
  });
}


  
//  update() {
//   if (this.levelComplete) return;
  
//   // Player movement
//   this.player.move(this.cursors, this.mobileControls);
  
//   // Track player facing direction for shooting
//   if (this.player.body.velocity.x > 0) {
//     this.playerFacingRight = true;
//   } else if (this.player.body.velocity.x < 0) {
//     this.playerFacingRight = false;
//   }
  
//   // Fire control with space key
//   if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
//     if (this.targetingMode) {
//       // In targeting mode, shoot at reticle
//       const mockPointer = {
//         x: this.reticle.x,
//         y: this.reticle.y
//       };
//       this.shootFireballAtPointer(mockPointer);
//     } else {
//       // Direct shooting in facing direction
//       const worldPoint = this.playerFacingRight ? 
//         { x: this.player.x + 200, y: this.player.y - 30 } : 
//         { x: this.player.x - 200, y: this.player.y - 30 };
        
//        // Replace worldToScreen with the correct method
//    const screenX = (worldPoint.x - this.cameras.main.scrollX);
//    const screenY = (worldPoint.y - this.cameras.main.scrollY);
    
//       const mockPointer = {
//       x: screenX,
//       y: screenY
//     };
//     this.shootFireballAtPointer(mockPointer);
//   }
// }
update() {
    if (this.levelComplete) return;
    
    // Player movement
    this.player.move(this.cursors, this.mobileControls);
    
    // Track player facing direction for shooting
    if (this.player.body.velocity.x > 0) {
      this.playerFacingRight = true;
    } else if (this.player.body.velocity.x < 0) {
      this.playerFacingRight = false;
    }
    
    // Fire control with space key OR mobile shoot button
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
        (this.mobileControls && this.mobileControls.shoot)) {
      // Reset shoot control to prevent continuous firing
      if (this.mobileControls) {
        this.mobileControls.shoot = false;
      }
      
      // FIXED: Shoot in the direction player is facing
      const direction = this.player.flipX ? 1 : -1; // flipX true = facing right
      const worldPoint = {
        x: this.player.x + (direction * 200),
        y: this.player.y - 30
      };
        
      const screenX = (worldPoint.x - this.cameras.main.scrollX);
      const screenY = (worldPoint.y - this.cameras.main.scrollY);
      
      const mockPointer = {
        x: screenX,
        y: screenY
      };
      this.shootFireballAtPointer(mockPointer);
}
  
  // Update targeting reticle if active
  if (this.targetingMode) {
    const pointer = this.input.activePointer;
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    
    this.reticle.x = pointer.x;
    this.reticle.y = pointer.y;
    
    // WITH THIS:
this.reticleDirection.setTo(
  (this.player.x - this.cameras.main.scrollX),
  (this.player.y - 30 - this.cameras.main.scrollY),
  pointer.x,
  pointer.y
);
  }
  
  if (this.chaseStarted) {
    // Enemy behavior
    this.enemiesLeft.children.entries.forEach(enemy => {
      // If enemy is too far to the left, teleport closer
      if (enemy.x < this.player.x - 800) {
        enemy.x = this.player.x - Phaser.Math.Between(500, 600);
      }
      
      // Chase the player
      if (enemy.x < this.player.x) {
        enemy.setVelocityX(enemy.speed);
        enemy.setFlipX(false);
      } else {
        enemy.setVelocityX(-enemy.speed);
        enemy.setFlipX(true);
      }
      
      // Keep enemy on ground
      if (enemy.y > this.groundY) {
        enemy.y = this.groundY;
        enemy.setVelocityY(0);
      }
    });
    
    this.enemiesRight.children.entries.forEach(enemy => {
      // If enemy is too far to the right, teleport closer
      if (enemy.x > this.player.x + 800) {
        enemy.x = this.player.x + Phaser.Math.Between(500, 600);
      }
      
      // Chase the player
      if (enemy.x > this.player.x) {
        enemy.setVelocityX(-enemy.speed);
        enemy.setFlipX(true);
      } else {
        enemy.setVelocityX(enemy.speed);
        enemy.setFlipX(false);
      }
      
      // Keep enemy on ground
      if (enemy.y > this.groundY) {
        enemy.y = this.groundY;
        enemy.setVelocityY(0);
      }
    });
    
    // Update distance tracker
    if (this.player.x > this.startX) {
      const distanceRun = Math.floor((this.player.x - this.startX) / 50);
      this.distanceRun = distanceRun;
      this.distanceText.setText(`Distance: ${distanceRun}/100m`);
      
      // Check for level completion
      if (distanceRun >= 100 && this.coinsCollected >= this.coinsToComplete) {
        this.completeLevel();
      }
    }
    
    // Clean up off-screen fireballs
    this.fireballs.getChildren().forEach(fireball => {
      if (fireball.active) {
        // Check if fireball is out of camera view + buffer
        if (fireball.x < this.cameras.main.scrollX - 100 || 
            fireball.x > this.cameras.main.scrollX + 1060 ||
            fireball.y > 540) {
          fireball.setActive(false);
          fireball.setVisible(false);
        }
      }
    });
    
    // Continuously regenerate fire power
    if (this.fireballPower < 100 && !this.fireballCooldown) {
      this.fireballPower = Math.min(100, this.fireballPower + 0.2);
      if (this.fireballPower % 5 < 0.2) {  // Update less frequently
        this.updatePowerMeter(this.fireballPower);
      }
    }
    
    // Camera parallax effect for background
    // this.backgrounds.forEach((bg, i) => {
    //   // If this background is off-screen to the left
    //   if (bg.x + 480 < this.cameras.main.scrollX) {
    //     // Move it to the right end
    //     const rightmostBg = this.backgrounds.reduce((prev, curr) => {
    //       return (curr.x > prev.x) ? curr : prev;
    //     });
    //     bg.x = rightmostBg.x + 960;
    //   }
    //   // If this background is off-screen to the right
    //   else if (bg.x - 480 > this.cameras.main.scrollX + this.cameras.main.width) {
    //     // Move it to the left end
    //     const leftmostBg = this.backgrounds.reduce((prev, curr) => {
    //       return (curr.x < prev.x) ? curr : prev;
    //     });
    //     bg.x = leftmostBg.x - 960;
    //   }
    // });
  }
}
}