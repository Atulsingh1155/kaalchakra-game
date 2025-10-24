export class EnemyScene extends Phaser.Scene {
  constructor() { super('EnemyScene'); }
  create() {
    this.add.image(480, 270, 'temple');
    this.enemy = this.add.sprite(700, 400, 'shadowWarrior').setScale(1.2);
    this.add.text(100, 100, [
      "Aarav (panting): Who... who are you?",
      "Shadow Warrior: I am what your future becomes... if you fail.",
      "",
      "Suddenly, Dadi appears...",
      "Dadi: Beta! Your father is very sick! You need to collect money for his medicine!",
      "Run and collect coins! I'll help you!"
    ], { font: "22px serif", fill: "#fff", wordWrap: { width: 760 } });
    this.input.once('pointerdown', () => this.scene.start('Level1Scene'));
  }
}