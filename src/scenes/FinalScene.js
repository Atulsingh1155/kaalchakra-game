export class FinalScene extends Phaser.Scene {
  constructor() { super('FinalScene'); }
  create() {
    this.add.image(480, 270, 'shard');
    this.add.text(100, 80, [
      "Narrator: All five shards are found. But the Kaalchakra demands one last offering... A memory you can never reclaim.",
      "Daadi (tearful): You will forget me, beta. But the world will remember you.",
      "Do you rebuild the Kaalchakra and reset time?",
      "[Y] Yes. Even if I lose everything.",
      "[N] No. I will protect this world as it is."
    ], { font: "22px serif", fill: "#fff", wordWrap: { width: 760 } });

    this.input.keyboard.once('keydown-Y', () => this.scene.start('EpilogueScene', { ending: 'yes' }));
    this.input.keyboard.once('keydown-N', () => this.scene.start('EpilogueScene', { ending: 'no' }));
  }
}