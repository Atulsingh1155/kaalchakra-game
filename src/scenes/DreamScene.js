export class DreamScene extends Phaser.Scene {
  constructor() { super('DreamScene'); }
  create() {
    this.add.image(480, 270, 'home');
    this.add.text(120, 120, [
      "Father (memory): If time ever turns against the world, find the Kaalchakra... and fix my mistake.",
      "Aarav wakes up, teary-eyed."
    ], { font: "22px serif", fill: "#fff", wordWrap: { width: 760 } });
    this.input.once('pointerdown', () => this.scene.start('FinalScene'));
  }
}