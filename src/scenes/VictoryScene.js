import { GameData } from '../data/gameData.js';

export class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }
  
  create() {
    this.add.image(480, 270, 'home');
    
    this.add.text(480, 150, 'VICTORY!', {
      font: '48px Arial',
      fill: '#00FF00',
      align: 'center'
    }).setOrigin(0.5);
    
    this.add.text(480, 270, [
      "Aarav saved his father!",
      `Total coins collected: ${GameData.playerStats.coins}`,
      "Dadi: Well done, beta! Your father is proud of you!",
      "",
      "Click to continue to the Kaalchakra story..."
    ], {
      font: '20px Arial',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    
    this.input.once('pointerdown', () => {
      this.scene.start('IntroScene'); // Continue to original story
    });
  }
}