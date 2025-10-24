export class Dadi extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'anklet'); // Using anklet as placeholder
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1.5);
    this.setTint(0xFFFFFF); // White tint
    this.groundLevel = 480;
    this.y = this.groundLevel; // Place on ground
    this.body.setSize(32, 32);
  }
  
  appear() {
    // Dramatic entrance
    this.setAlpha(0);
    this.setScale(0.5);
    
    // Fade in and grow
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 800,
      ease: 'Back.easeOut'
    });
    
    // Add glow effect
    this.scene.tweens.add({
      targets: this,
      tint: 0xFFFFAA,
      duration: 1000,
      yoyo: true,
      repeat: 2
    });
  }
}