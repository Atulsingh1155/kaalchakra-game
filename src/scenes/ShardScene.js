export class ShardScene extends Phaser.Scene {
  constructor() { super('ShardScene'); }
  create() {
    this.add.image(480, 270, 'shard');
    this.add.text(120, 120, [
      "Shard Spirit: You have found me, bearer of the anklet... but time demands more. Four shards remain. Beware: the shadows twist your mind."
    ], { font: "22px serif", fill: "#fff", wordWrap: { width: 760 } });
    this.input.once('pointerdown', () => this.scene.start('EnemyScene'));
  }
}