import { Aarav } from '../objects/Aarav.js';
import { Enemy } from '../objects/Enemy.js';
import { Coin } from '../objects/Coin.js';
// import { Dadi } from '../objects/Dadi.js';
import { GameData } from '../data/gameData.js';
import { createMobileControls } from '../utils/mobileControlUtility.js';
export class Level1Scene extends Phaser.Scene {
  constructor() { 
    super('Level1Scene'); 
    this.coinsCollected = 0;
    this.coinsNeeded = 50;
    this.levelComplete = false;
  }
  
  create() {
  // FIXED: Reset all game data and ensure clean state
  GameData.playerStats.coins = 0;
  GameData.playerStats.health = 100;
  GameData.playerStats.currentLevel = 1;
  
  
  // FIXED: Reset level-specific flags
  this.coinsCollected = 0;
  this.coinsNeeded = 50;
  this.levelComplete = false;
  this.damageTime = 0;
  
  const worldWidth = 22500; 
  this.physics.world.setBounds(0, 0, worldWidth, 540);
  
  // Background creation
  this.backgrounds = [];
  const numBackgrounds = Math.ceil(worldWidth / 960) + 2; 
  for (let i = 0; i < numBackgrounds; i++) {
    const bg = this.add.image(480 + (i * 960), 270, 'gameBackground');
    this.backgrounds.push(bg);
  }
  
  this.groundY = 480;
  
  // Wall creation
  this.leftWall = this.add.rectangle(-10, 270, 20, 540, 0x000000, 0);
  this.physics.add.existing(this.leftWall, true);
  
  this.rightWall = this.add.rectangle(worldWidth + 10, 270, 20, 540, 0x000000, 0);
  this.physics.add.existing(this.rightWall, true);
  
  // Mission text
  this.missionText = this.add.text(480, 50, 'MISSION: Collect 50 coins to save your father!', {
    font: '28px Arial',
    fill: '#FFD700',
    stroke: '#000000',
    strokeThickness: 4,
    align: 'center'
  }).setOrigin(0.5);
  this.missionText.setScrollFactor(0);
  
  // FIXED: Create player with fresh state
  this.player = new Aarav(this, 100, this.groundY);

  this.player.setFlipX(true);
  
  // FIXED: Ensure player is properly initialized
  this.player.setActive(true);
  this.player.setVisible(true);
  this.player.body.moves = true;
  this.player.body.setEnable(true);
  
  // FIXED: Create controls after player is created
  this.cursors = this.input.keyboard.createCursorKeys();
  
  // FIXED: Add collision with both walls
  this.physics.add.collider(this.player, this.leftWall);
  this.physics.add.collider(this.player, this.rightWall);
  
  // Camera
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  this.cameras.main.setBounds(0, 0, worldWidth, 540);
  
  // Create enemies - FIXED: Better positioning
  this.enemies = this.physics.add.group();
  this.createEnemies();
  
  // Create coins on ground level
  this.coins = this.physics.add.group();
  this.createCoins();
  
  // UI
  this.createUI();
  
  // Add mobile controls for touch devices
  const mobileControlsResult = createMobileControls(this, { includeShoot: false });
  if (mobileControlsResult) {
    this.mobileControls = mobileControlsResult.controls;
    this.mobileControlsContainer = mobileControlsResult.container;
  }
  
  // FIXED: Collisions - ensure they're set up after all objects are created
  this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  this.physics.add.overlap(this.player, this.enemies, this.hitByEnemy, null, this);
  
  // FIXED: Add collision for enemies with walls
  this.physics.add.collider(this.enemies, this.leftWall);
  this.physics.add.collider(this.enemies, this.rightWall);
  
  // Instructions
  this.showInstructions();
  
  // Add fullscreen key for functionality only, but no visible button
  this.fullscreenKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  
  // FIXED: Add camera fade-in for smooth transition
  this.cameras.main.fadeIn(1000, 0, 0, 0);
}
  showInstructions() {
    this.instructionText = this.add.text(480, 150, [
      "Use ARROW KEYS to move",
      "UP to jump, LEFT/RIGHT to run",
      "Avoid enemies and collect coins!"
    ], {
      font: '20px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#000000AA',
      padding: { x: 10, y: 8 },
      align: 'center'
    }).setOrigin(0.5);
    this.instructionText.setScrollFactor(0);
    
    this.time.delayedCall(4000, () => {
      if (this.instructionText) {
        this.instructionText.destroy();
      }
    });
  }
  
  // Keep toggle fullscreen method but don't display UI for it
  toggleFullscreen() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
    }
  }
  
  createEnemies() {
    // FIXED: Create enemies that start behind and stay behind
    const enemyOffsets = [-80, -120, -160, -100, -140, -180];
    
    enemyOffsets.forEach((offset, index) => {
      const enemy = new Enemy(this, this.player.x + offset, this.groundY, 80 + (index * 5));
      this.enemies.add(enemy);
      
      // Mark enemy for persistent chasing
      enemy.alwaysChase = true;
      enemy.preferredDistance = Math.abs(offset); // Distance to maintain behind player
    });
  }
  
  createCoins() {
    // FIXED: Clear any existing coins first to prevent duplicates
    if (this.coins) {
      this.coins.clear(true, true);
    }
    this.coins = this.physics.add.group();
    
    // FIXED: Create coins with better spacing and positioning
    const coinSpacing = 150; // Keep your perfect spacing
    const startX = 300; // Start placing coins after some distance
    
    for (let i = 0; i < this.coinsNeeded; i++) {
      // Place coins in sequence with some variation
      const x = startX + (i * coinSpacing) + Phaser.Math.Between(-30, 30);
      const y = this.groundY - 80; // Higher above ground for better visibility
      
      const coin = new Coin(this, x, y);
      coin.collected = false; // Ensure flag is set
      this.coins.add(coin);
    }
    
    console.log(`✅ Created ${this.coinsNeeded} coins for collection`);
    console.log(`Coins group size: ${this.coins.children.size}`);
  }
  
 createUI() {
  // Coin counter with proper target
  this.coinText = this.add.text(20, 20, `Coins: 0/${this.coinsNeeded}`, {
    font: '24px Arial',
    fill: '#FFD700',
    stroke: '#000000',
    strokeThickness: 2
  }).setScrollFactor(0);
    
    // Health bar
    this.healthText = this.add.text(20, 150, `Health: ${GameData.playerStats.health}`, {
      font: '28px Arial',
      fill: '#FF0000',
      stroke: '#000000',
      strokeThickness: 3,
      backgroundColor: '#000000AA',
      padding: { x: 10, y: 5 }
    });
    this.healthText.setScrollFactor(0);
    
    // Progress bar
    this.progressBar = this.add.graphics();
    this.progressBar.setScrollFactor(0);
    this.updateProgressBar();
  }
  
  updateProgressBar() {
    this.progressBar.clear();
    const progress = this.coinsCollected / this.coinsNeeded;
    const barWidth = 300;
    const barHeight = 20;
    
    // Background
    this.progressBar.fillStyle(0x000000);
    this.progressBar.fillRect(20, 200, barWidth, barHeight);
    
    // Progress fill
    this.progressBar.fillStyle(0x00FF00);
    this.progressBar.fillRect(20, 200, barWidth * progress, barHeight);
    
    // Border
    this.progressBar.lineStyle(2, 0xFFFFFF);
    this.progressBar.strokeRect(20, 200, barWidth, barHeight);
  }
  
  collectCoin(player, coin) {
    // FIXED: More robust collection check
    if (coin.collected || !coin.active) return; // Check both flags
    
    console.log('✅ Collecting coin at:', coin.x, coin.y);
    
    // Mark coin as collected IMMEDIATELY
    coin.collected = true;
    
    // FIXED: Play coin collection sound
    try {
      if (this.sound && this.sound.context) {
        // Try to play the loaded sound
        if (this.cache.audio.exists('coinSound')) {
          this.sound.play('coinSound', { volume: 0.5 });
        } else {
          // Create a simple beep sound programmatically
          const audioContext = this.sound.context;
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }
      }
    } catch (error) {
      console.log('Error playing coin sound:', error);
    }
    
    // Remove coin from physics group immediately
    this.coins.remove(coin, true, true); // Remove from group and destroy
    
    // FIXED: Increment by exactly 1
    this.coinsCollected += 1;
    GameData.playerStats.coins += 1;
    
    console.log(`✅ Collected coin ${this.coinsCollected}/${this.coinsNeeded}`);
    
    this.coinText.setText(`Coins: ${this.coinsCollected}/${this.coinsNeeded}`);
    this.updateProgressBar();
    
    // Show collection effect
    const collectText = this.add.text(coin.x, coin.y - 30, '+1', {
      font: '24px Arial',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: collectText,
      y: collectText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => collectText.destroy()
    });
    
    // Collection effect on coin position
    const sparkle = this.add.circle(coin.x, coin.y, 20, 0xFFD700);
    this.tweens.add({
      targets: sparkle,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => sparkle.destroy()
    });
    
    // FIXED: Check if mission complete with exact count
    if (this.coinsCollected === this.coinsNeeded) {
      this.completeLevel();
    }
  }
  
  hitByEnemy(player, enemy) {
    // Health reduction when touching enemy
    if (this.damageTime && this.time.now - this.damageTime < 300) return;
    
    this.damageTime = this.time.now;
    
    // ADDED: Play hit sound when enemy touches player
    enemy.playHitSound();
    
    GameData.playerStats.health -= 8;
    this.healthText.setText(`Health: ${GameData.playerStats.health}`);
    
    // Visual feedback
    this.cameras.main.flash(200, 255, 0, 0);
    
    if (GameData.playerStats.health <= 0) {
      this.scene.start('GameOverScene');
    }
  }
  
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    
    console.log('🎉 Level completed! Starting completion sequence...');
    
    // FIXED: Stop player movement and keep on ground
    this.player.setVelocity(0, 0);
    this.player.y = this.groundY; // Ensure player stays on ground
    this.player.body.setGravityY(0); // Disable gravity to prevent falling
    
    // Stop all enemies
    this.enemies.children.entries.forEach(enemy => {
      enemy.setVelocity(0, 0);
    });
    
    // Show completion message
    const completionText = this.add.text(
      this.cameras.main.scrollX + 480, 
      270, 
      'MISSION COMPLETE!', 
      {
        font: '48px Arial',
        fill: '#00FF00',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);
    
    console.log('✅ Mission complete text shown, waiting 5 seconds for Dadi...');
    
    // CHANGED: Wait 5 seconds then show Dadi congratulations
    this.time.delayedCall(5000, () => {
      console.log('⏰ 5 seconds passed, removing completion text and showing Dadi...');
      completionText.destroy();
      this.showDadiCongratulations();
    });
  }
  
 showDadiCongratulations() {
  console.log('👵 Showing Dadi congratulations dialogue...');
  
  // FIXED: Create intro-style background overlay
  this.overlayBackground = this.add.rectangle(
    this.cameras.main.scrollX + 480, 
    270, 
    960, 
    540, 
    0x000000, 
    0.9
  );
  
  // ADDED: Play intro music like IntroScene
  try {
    if (this.cache.audio.exists('introMusic')) {
      this.congratsMusic = this.sound.add('introMusic', { 
        loop: true, 
        volume: 0.3 
      });
      this.congratsMusic.play();
    }
  } catch (error) {
    console.log('Error playing congratulations music:', error);
  }
  
  // FIXED: Add Aarav image on LEFT side
  this.aaravImage = this.add.image(
    this.cameras.main.scrollX + 200, 
    350, 
    'boy'
  );
  
  const boyScale = Math.min(150 / this.aaravImage.width, 150 / this.aaravImage.height);
  this.aaravImage.setScale(boyScale);
  
  // ADDED: Flip Aarav to face RIGHT (toward grandmother)
  this.aaravImage.setFlipX(true);
  
  // FIXED: Add grandmother image on RIGHT side
  this.dadiImage = this.add.image(
    this.cameras.main.scrollX + 760, 
    350, 
    'grandmother'
  );
  
  // FIXED: Scale like IntroScene - reasonable size
  const grandmaScale = Math.min(150 / this.dadiImage.width, 150 / this.dadiImage.height);
  this.dadiImage.setScale(grandmaScale);
  
  console.log('👵 Dadi and Aarav images created');
  
  // ...existing code for congratsLines...
  this.congratsLines = [
    "Grandmother: 'Well done, dear! You collected all 50 coins!'",
    "Grandmother: 'I'm so proud of you, Aarav!'",
    "Aarav: 'Thank you, Grandma! Is Papa getting better?'",
    "Grandmother: 'Yes, dear, but we need more medicine!'",
    "Grandmother: 'The village doctor needs special herbs!'",
    "Grandmother: 'These herbs grow deep in the forest!'",
    "Grandmother: 'Go to the village and collect them!'",
    "Grandmother: 'But be careful! Forest enemies are stronger!'",
    "Click to start Level 2 – Village Mission..."
  ];
  
  this.currentCongratsLine = 0;
  
  // FIXED: Display text like IntroScene - centered and properly sized
  this.congratsText = this.add.text(
    this.cameras.main.scrollX + 480, 
    100, 
    '', 
    {
      font: '24px Arial',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: 800 }
    }
  ).setOrigin(0.5);
  
  console.log('💬 Starting congratulations dialogue...');
  
  // Start showing story like IntroScene
  this.showNextCongratsLine();
}
  showNextCongratsLine() {
    if (this.currentCongratsLine < this.congratsLines.length) {
      const line = this.congratsLines[this.currentCongratsLine];
      this.congratsText.setText(line);
      
      // FIXED: Animate characters based on dialogue like IntroScene
      if (line.includes('Grandmother:')) {
        this.tweens.add({
          targets: this.aaravImage,
          scaleX: this.aaravImage.scaleX * 1.2,
          scaleY: this.aaravImage.scaleY * 1.2,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });
      } else if (line.includes('Aarav:')) {
        this.tweens.add({
          targets: this.dadiImage,
          scaleX: this.dadiImage.scaleX * 1.2,
          scaleY: this.dadiImage.scaleY * 1.2,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });
      }
      
      this.currentCongratsLine++;
      
      if (this.currentCongratsLine < this.congratsLines.length) {
        // Continue to next line after 3 seconds
        this.time.delayedCall(3000, () => this.showNextCongratsLine());
      } else {
        // Last line - wait for click
        this.input.once('pointerdown', () => {
          console.log('🖱️ Click detected! Going to Level 2...');
          
          // FIXED: Stop congratulations music
          if (this.congratsMusic) {
            this.congratsMusic.stop();
          }
          
          // FIXED: Clean up all dialogue elements
          if (this.overlayBackground) this.overlayBackground.destroy();
          if (this.dadiImage) this.dadiImage.destroy();
          if (this.aaravImage) this.aaravImage.destroy();
          if (this.congratsText) this.congratsText.destroy();
          
          this.scene.start('Level2Scene');
        });
      }
    }
  }
  
  createSparkleEffect() {
    console.log('✨ Creating sparkle effects...');
    // Create sparkle particles around the dialogue
    for (let i = 0; i < 10; i++) {
      const sparkle = this.add.circle(
        this.cameras.main.scrollX + 480 + Phaser.Math.Between(-400, 400),
        300 + Phaser.Math.Between(-150, 150),
        3,
        0xFFD700
      );
      
      this.tweens.add({
        targets: sparkle,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 1500,
        delay: i * 200,
        onComplete: () => sparkle.destroy()
      });
    }
  }
  
  update() {
    // Keep F key functionality but don't show UI
    if (Phaser.Input.Keyboard.JustDown(this.fullscreenKey)) {
      this.toggleFullscreen();
    }
    
    if (!this.levelComplete) {
      this.player.move(this.cursors, this.mobileControls);
      
      // FIXED: Enhanced enemy behavior - follow player in ALL directions
      this.enemies.children.entries.forEach(enemy => {
        // Always chase the player regardless of direction
        enemy.chasePlayer(this.player);
        
        // FIXED: Maintain relative positioning based on player movement
        const playerDirection = this.player.body.velocity.x;
        const distanceToPlayer = this.player.x - enemy.x;
        
        // If player is moving left and enemy is behind, enemy should follow left
        if (playerDirection < 0 && distanceToPlayer > 0) {
          enemy.setVelocityX(-enemy.speed * 0.8);
        }
        // If player is moving right and enemy is behind, enemy should follow right
        else if (playerDirection > 0 && distanceToPlayer > 0) {
          enemy.setVelocityX(enemy.speed * 0.8);
        }
        
        // Keep enemy on ground
        if (enemy.y > this.groundY) {
          enemy.y = this.groundY;
          enemy.setVelocityY(0);
        }
        
        // FIXED: Better teleportation logic for directional following
        const absoluteDistance = Math.abs(distanceToPlayer);
        if (absoluteDistance > 700) {
          // Teleport enemy to appropriate side based on player movement
          if (this.player.body.velocity.x > 0) {
            // Player moving right, place enemy behind (left side)
            enemy.x = this.player.x - enemy.preferredDistance;
          } else if (this.player.body.velocity.x < 0) {
            // Player moving left, place enemy behind (right side)  
            enemy.x = this.player.x + enemy.preferredDistance;
          } else {
            // Player not moving, place enemy at preferred distance
            enemy.x = this.player.x - enemy.preferredDistance;
          }
          enemy.y = this.groundY;
        }
      });
    }
  }
}