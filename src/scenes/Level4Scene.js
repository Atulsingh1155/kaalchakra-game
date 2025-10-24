import { Aarav } from '../objects/Aarav.js';
import { Enemy } from '../objects/Enemy.js';
import { Coin } from '../objects/Coin.js';
import { Dadi } from '../objects/Dadi.js';
import { GameData } from '../data/gameData.js';

export class Level4Scene extends Phaser.Scene {
  constructor() { 
    super('Level4Scene'); 
    this.distanceRun = 0;
    this.coinsCollected = 0;
    this.levelComplete = false;
  }
  
  create() {
    this.add.image(480, 270, 'home');
    
    this.add.text(50, 50, [
      "Level 4: Final Sprint",
      "Dadi: Almost there beta! The medicine is within reach!",
      "Collect 10 coins and run 100 meters! (Maximum difficulty!)"
    ], { font: "18px serif", fill: "#fff", wordWrap: { width: 860 } });
    
    this.player = new Aarav(this, 100, 400);
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Maximum enemies for level 4
    this.enemies = this.physics.add.group();
    for (let i = 0; i < 4; i++) {
      this.enemies.add(new Enemy(this, 50 + (i * 20), 400, GameData.levelConfigs[4].enemySpeed - (i * 10)));
    }
    
    this.coins = this.physics.add.group();
    this.createCoins();
    this.createUI();
    
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitByEnemy, null, this);
    
    this.time.delayedCall(2000, () => {
      this.chaseStarted = true;
    });
  }
  
  createCoins() {
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(200, 900);
      const y = Phaser.Math.Between(200, 400);
      const coin = new Coin(this, x, y);
      this.coins.add(coin);
    }
  }
  
  createUI() {
    this.coinText = this.add.text(16, 16, 'Coins: 0/10', { 
      font: '24px Arial', fill: '#FFD700' 
    });
    this.distanceText = this.add.text(16, 50, 'Distance: 0/100m', { 
      font: '24px Arial', fill: '#00FF00' 
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
    GameData.playerStats.health -= 20;
    if (GameData.playerStats.health <= 0) {
      this.scene.start('GameOverScene');
    }
  }
  
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    
    this.dadi = new Dadi(this, this.player.x + 100, 400);
    this.dadi.appear();
    
    this.enemies.setVelocity(0, 0);
    
    this.add.text(300, 200, [
      "Dadi: One more level beta! Your father is waiting!",
      "Final challenge ahead...",
      "Click to continue..."
    ], { 
      font: "20px serif", 
      fill: "#fff", 
      backgroundColor: "#000", 
      padding: { x: 10, y: 10 },
      wordWrap: { width: 400 } 
    });
    
    this.input.once('pointerdown', () => {
      GameData.playerStats.currentLevel = 5;
      this.scene.start('Level5Scene');
    });
  }
  
  update() {
    if (!this.levelComplete) {
      this.player.move(this.cursors);
      
      if (this.chaseStarted) {
        this.enemies.children.entries.forEach(enemy => {
          enemy.chasePlayer(this.player);
        });
        
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
          this.distanceRun += 0.1;
          this.distanceText.setText(`Distance: ${Math.floor(this.distanceRun)}/100m`);
          
          if (this.distanceRun >= 100 && this.coinsCollected >= 10) {
            this.completeLevel();
          }
        }
      }
    }
  }
}