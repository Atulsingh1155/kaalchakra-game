import { Aarav } from '../objects/Aarav.js';
import { Enemy } from '../objects/Enemy.js';
import { Coin } from '../objects/Coin.js';
import { Dadi } from '../objects/Dadi.js';
import { GameData } from '../data/gameData.js';
import { createMobileControls } from '../utils/mobileControlUtility.js';

export class Level3Scene extends Phaser.Scene {
  constructor() { 
    super('Level3Scene'); 
    this.distanceRun = 0;
    this.coinsCollected = 0;
    this.levelComplete = false;
    this.fireballs = null;
    this.fireballCooldown = false;
    this.enemySpawnTimer = null;
  }
  
  create() {
    this.add.image(480, 270, 'temple');
    
    this.add.text(50, 50, [
      "Level 3: Temple Depths",
      "Dadi: The temple guards are awakening from BOTH sides!",
      "Collect 10 coins and run 100 meters! (Enemies coming from all sides!)"
    ], { 
      font: "18px serif", 
      fill: "#fff", 
      wordWrap: { width: 860 },
      backgroundColor: "#000000AA",
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);
    
    // Extend world bounds for a larger level
    this.physics.world.setBounds(0, 0, 4000, 540);
    
    // Multiple backgrounds
    this.backgrounds = [];
    for (let i = 0; i < 5; i++) {
      const bg = this.add.image(480 + (i * 960), 270, 'temple');
      this.backgrounds.push(bg);
    }
    
    // Set ground level
    this.groundY = 480;
    
    this.player = new Aarav(this, 100, this.groundY);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Camera follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 4000, 540);
    
    // Create fireballs group (keeping fire power from level 2)
    this.fireballs = this.physics.add.group({
      defaultKey: 'fire_ball',
      maxSize: 10
    });
    
    // Create enemy groups - separate by direction
    this.leftEnemies = this.physics.add.group();
    this.rightEnemies = this.physics.add.group();
    
    // Initial enemies
    this.spawnLeftEnemy();
    this.spawnRightEnemy();
    
    // Combine all enemies into one group for collision detection
    this.enemies = this.physics.add.group();
    
    this.coins = this.physics.add.group();
    this.createCoins();
    this.createUI();
    
    // Add mobile controls for touch devices
    const mobileControlsResult = createMobileControls(this);
    if (mobileControlsResult) {
      this.mobileControls = mobileControlsResult.controls;
      this.mobileControlsContainer = mobileControlsResult.container;
      
      // Add fire button for mobile (keeping from level 2)
      const fireButtonStyle = {
        fontSize: '32px',
        backgroundColor: '#FF000080',
        padding: { x: 20, y: 15 },
        fixedWidth: 80,
        fixedHeight: 80,
        align: 'center'
      };
      
      const fireButton = this.add.text(660, 450, '🔥', fireButtonStyle)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive();
      
      fireButton.on('pointerdown', () => {
        this.shootFireball();
      });
      
      this.mobileControlsContainer.add(fireButton);
    }
    
    // Collisions
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitByEnemy, null, this);
    this.physics.add.overlap(this.fireballs, this.enemies, this.hitEnemyWithFireball, null, this);
    
    // Warning message about enemies from both sides
    const warningText = this.add.text(480, 270, 'WARNING! Enemies coming from BOTH SIDES!', {
      font: '26px Arial',
      fill: '#FF0000',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Flash warning and remove
    this.tweens.add({
      targets: warningText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: 5,
      onComplete: () => warningText.destroy()
    });
    
    // Start enemy spawning after warning
    this.time.delayedCall(4000, () => {
      this.chaseStarted = true;
      this.startEnemySpawning();
    });
  }
  
  startEnemySpawning() {
    // Set up recurring spawns from both sides
    this.enemySpawnTimer = this.time.addEvent({
      delay: 4000,
      callback: () => {
        // Randomly determine which side to spawn from
        if (Phaser.Math.Between(0, 1) === 0) {
          this.spawnLeftEnemy();
        } else {
          this.spawnRightEnemy();
        }
      },
      callbackScope: this,
      loop: true
    });
  }
  
  spawnLeftEnemy() {
    // Spawn from left side of screen
    const enemy = new Enemy(
      this, 
      this.player.x - Phaser.Math.Between(600, 900), 
      this.groundY,
      GameData.levelConfigs[3].enemySpeed
    );
    
    enemy.setTint(0xFF6666); // Reddish tint for left enemies
    this.leftEnemies.add(enemy);
    this.enemies.add(enemy);
    
    // Set enemy to chase from left side
    enemy.fromLeft = true;
    
    return enemy;
  }
  
  spawnRightEnemy() {
    // Spawn from right side of screen
    const enemy = new Enemy(
      this, 
      this.player.x + Phaser.Math.Between(600, 900), 
      this.groundY,
      GameData.levelConfigs[3].enemySpeed - 10 // Slightly slower from right side
    );
    
    enemy.setTint(0x6666FF); // Bluish tint for right enemies
    this.rightEnemies.add(enemy);
    this.enemies.add(enemy);
    
    // Set enemy to chase from right side
    enemy.fromLeft = false;
    
    return enemy;
  }
  
  shootFireball() {
    // Check cooldown
    if (this.fireballCooldown) return;
    
    // Set cooldown (500ms between shots)
    this.fireballCooldown = true;
    this.time.delayedCall(500, () => {
      this.fireballCooldown = false;
    });
    
    // Create fireball
    const fireball = this.fireballs.get(this.player.x, this.player.y - 20);
    
    if (!fireball) return;
    
    fireball.setActive(true);
    fireball.setVisible(true);
    fireball.setScale(0.5);
    
    // Determine direction based on player facing
    const direction = this.player.flipX ? 1 : -1;
    fireball.setVelocityX(direction * 400);
    
    // Add glow effect
    fireball.setAlpha(0.8);
    this.tweens.add({
      targets: fireball,
      alpha: 1,
      duration: 100,
      yoyo: true,
      repeat: -1
    });
    
    // Play sound
    try {
      if (this.sound && this.sound.context) {
        // Create a simple shoot sound programmatically
        const audioContext = this.sound.context;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.log('Error playing fireball sound:', error);
    }
    
    // Auto-destroy after 1.5 seconds
    this.time.delayedCall(1500, () => {
      if (fireball.active) {
        fireball.setActive(false);
        fireball.setVisible(false);
      }
    });
  }
  
  hitEnemyWithFireball(fireball, enemy) {
    // Disable fireball
    fireball.setActive(false);
    fireball.setVisible(false);
    
    // Create explosion effect
    const explosion = this.add.circle(enemy.x, enemy.y, 30, 0xFF0000, 0.8);
    this.tweens.add({
      targets: explosion,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => explosion.destroy()
    });
    
    // Enemy takes damage or is destroyed
    enemy.destroy();
    
    // Add points for enemy defeated
    GameData.playerStats.coins++;
    this.coinText.setText(`Coins: ${this.coinsCollected}/${10}`);
  }
  
  createCoins() {
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(200, 3800);
      const y = Phaser.Math.Between(200, 400);
      const coin = new Coin(this, x, y);
      this.coins.add(coin);
    }
  }
  
  createUI() {
    this.coinText = this.add.text(16, 16, 'Coins: 0/10', { 
      font: '24px Arial', fill: '#FFD700',
      backgroundColor: "#000000AA", padding: { x: 5, y: 5 }
    });
    this.coinText.setScrollFactor(0);
    
    this.distanceText = this.add.text(16, 50, 'Distance: 0/100m', { 
      font: '24px Arial', fill: '#00FF00',
      backgroundColor: "#000000AA", padding: { x: 5, y: 5 }
    });
    this.distanceText.setScrollFactor(0);
    
    this.healthText = this.add.text(16, 84, `Health: ${GameData.playerStats.health}`, {
      font: '24px Arial', fill: '#FF0000',
      backgroundColor: "#000000AA", padding: { x: 5, y: 5 }
    });
    this.healthText.setScrollFactor(0);
    
    // Direction indicator (new for level 3)
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
  }
  
  collectCoin(player, coin) {
    coin.collect();
    this.coinsCollected++;
    this.coinText.setText(`Coins: ${this.coinsCollected}/10`);
    GameData.playerStats.coins++;
    
    if (this.coinsCollected >= 10 && this.distanceRun >= 100) {
      this.completeLevel();
    }
  }
  
  hitByEnemy(player, enemy) {
    if (this.damageTime && this.time.now - this.damageTime < 1000) return;
    
    this.damageTime = this.time.now;
    GameData.playerStats.health -= 20;
    this.healthText.setText(`Health: ${GameData.playerStats.health}`);
    
    // Flash red from the direction the enemy came from
    if (enemy.fromLeft) {
      this.cameras.main.flash(200, 255, 100, 100); // Reddish flash
    } else {
      this.cameras.main.flash(200, 100, 100, 255); // Bluish flash
    }
    
    if (GameData.playerStats.health <= 0) {
      this.scene.start('GameOverScene');
    }
  }
  
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    
    // Stop enemy spawning
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.destroy();
    }
    
    this.dadi = new Dadi(this, this.player.x + 100, 400);
    this.dadi.appear();
    
    // Stop all enemies
    this.leftEnemies.children.entries.forEach(enemy => enemy.setVelocity(0, 0));
    this.rightEnemies.children.entries.forEach(enemy => enemy.setVelocity(0, 0));
    
    const completionText = this.add.text(
      this.cameras.main.scrollX + 480, 
      200, 
      [
        "Dadi: Amazing beta! You've survived attacks from all sides!",
        "Continue to the next challenge...",
        "Click to continue..."
      ], 
      { 
        font: "20px serif", 
        fill: "#fff", 
        backgroundColor: "#000", 
        padding: { x: 10, y: 10 },
        wordWrap: { width: 400 },
        align: 'center'
      }
    ).setOrigin(0.5);
    
    this.input.once('pointerdown', () => {
      GameData.playerStats.currentLevel = 4;
      this.scene.start('Level4Scene');
    });
  }
  
  update() {
    if (!this.levelComplete) {
      this.player.move(this.cursors, this.mobileControls);
      
      // Fire control with space key
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.shootFireball();
      }
      
      if (this.chaseStarted) {
        // Update left side enemies
        this.leftEnemies.children.entries.forEach(enemy => {
          // Chase player from the left
          if (enemy.x < this.player.x - 700) {
            // Teleport closer if too far left
            enemy.x = this.player.x - Phaser.Math.Between(500, 600);
          } 
          
          // Chase player
          if (enemy.x < this.player.x) {
            enemy.setVelocityX(enemy.speed);
            enemy.setFlipX(false); // Face right
          } else {
            enemy.setVelocityX(-enemy.speed);
            enemy.setFlipX(true); // Face left
          }
          
          // Keep on ground
          if (enemy.y > this.groundY) {
            enemy.y = this.groundY;
            enemy.setVelocityY(0);
          }
        });
        
        // Update right side enemies
        this.rightEnemies.children.entries.forEach(enemy => {
          // Chase player from the right
          if (enemy.x > this.player.x + 700) {
            // Teleport closer if too far right
            enemy.x = this.player.x + Phaser.Math.Between(500, 600);
          }
          
          // Chase player
          if (enemy.x > this.player.x) {
            enemy.setVelocityX(-enemy.speed);
            enemy.setFlipX(true); // Face left
          } else {
            enemy.setVelocityX(enemy.speed);
            enemy.setFlipX(false); // Face right
          }
          
          // Keep on ground
          if (enemy.y > this.groundY) {
            enemy.y = this.groundY;
            enemy.setVelocityY(0);
          }
        });
        
        const distanceMoved = Math.abs(this.player.x - 100); // Starting X was 100
        this.distanceRun = Math.floor(distanceMoved / 10);
        this.distanceText.setText(`Distance: ${this.distanceRun}/100m`);
        
        if (this.distanceRun >= 100 && this.coinsCollected >= 10) {
          this.completeLevel();
        }
      }
      
      // Cleanup inactive fireballs
      this.fireballs.getChildren().forEach(fireball => {
        if (fireball.active && 
            (fireball.x < this.cameras.main.scrollX - 100 || 
             fireball.x > this.cameras.main.scrollX + 1060)) {
          fireball.setActive(false);
          fireball.setVisible(false);
        }
      });
      
      // Background parallax
      this.backgrounds.forEach((bg, index) => {
        if (bg.x < this.cameras.main.scrollX - 480) {
          bg.x = this.cameras.main.scrollX + (960 * 4);
        } else if (bg.x > this.cameras.main.scrollX + (960 * 4)) {
          bg.x = this.cameras.main.scrollX - 480;
        }
      });
    }
  }
}