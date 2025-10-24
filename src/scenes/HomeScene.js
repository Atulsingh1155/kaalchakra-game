import { Aarav } from '../objects/Aarav.js';

export class HomeScene extends Phaser.Scene {
  constructor() { super('HomeScene'); }
  
  // Remove the preload function completely
  
  create() {
    this.add.image(480, 270, 'home');
    this.add.text(60, 400, [
      "Daadi: Aarav beta, you're always reading those old books. But some truths... live beyond pages.",
      "Aarav: Daadi, do you believe in Kaalchakra? That time can break?",
      "Daadi (whispering): Your great-grandfather... he was the last Guardian. The anklet he left behind isn't jewelry — it's a key."
    ], { font: "20px serif", fill: "#fff", wordWrap: { width: 840 } });
    this.anklet = this.add.image(800, 400, 'anklet').setScale(0.7).setAlpha(0.8);
    this.tweens.add({ targets: this.anklet, alpha: 1, duration: 1000, yoyo: true, repeat: 2 });
    this.input.once('pointerdown', () => this.scene.start('TempleScene'));
  }
}