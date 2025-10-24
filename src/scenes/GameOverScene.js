import { GameData } from '../data/gameData.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  
  create() {
    this.add.image(480, 270, 'temple').setAlpha(0.3);
    
    this.add.text(480, 200, 'GAME OVER', {
      font: '48px Arial',
      fill: '#FF0000',
      align: 'center'
    }).setOrigin(0.5);
    
    this.add.text(480, 270, [
      "Aarav couldn't save his father...",
      `Coins collected: ${GameData.playerStats.coins}`,
      "Click to restart from Level 1"
    ], {
      font: '24px Arial',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    this.input.once('pointerdown', () => {
      // Reset game data
      GameData.playerStats = {
        health: 100,
        coins: 0,
        totalCoinsNeeded: 50,
        currentLevel: 1
      };
      this.scene.start('Level1Scene');
    });
  }
}