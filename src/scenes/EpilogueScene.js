export class EpilogueScene extends Phaser.Scene {
  constructor() { super('EpilogueScene'); }
  init(data) { this.ending = data.ending; }
  create() {
    if (this.ending === 'yes') {
      this.add.text(100, 100, [
        "He who gave up his past… rebuilt our future. And in the flow of time, his name became legend — Aarav, the Last Guardian of Kaal."
      ], { font: "24px serif", fill: "#fff", wordWrap: { width: 760 } });
    } else {
      this.add.text(100, 100, [
        "Time didn’t reset. But neither did hope die. For now... there’s a guardian."
      ], { font: "24px serif", fill: "#fff", wordWrap: { width: 760 } });
    }
  }
}
