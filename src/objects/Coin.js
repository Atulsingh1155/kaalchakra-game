// export class Coin extends Phaser.Physics.Arcade.Sprite {
//   constructor(scene, x, y) {
//     super(scene, x, y, 'coin');
//     scene.add.existing(this);
//     scene.physics.add.existing(this);
    
//     // Keep your perfect scale and size - don't change these
//     this.setScale(.05);
//     this.body.setSize(30, 30);
    
//     // FIXED: Completely disable gravity and make coin immovable
//     this.body.setGravityY(0);
//     this.body.setImmovable(true);
//     this.body.moves = false; // ADDED: Prevent any physics movement
    
//     // FIXED: Add collection flag to prevent multiple collections
//     this.collected = false;
    
//     // FIXED: Store original Y position to prevent drift
//     this.originalY = y;
    
//     // FIXED: Floating animation - use absolute positioning to prevent drift
//     scene.tweens.add({
//       targets: this,
//       y: this.originalY - 15, // Float up from original position
//       duration: 2000,
//       yoyo: true,
//       repeat: -1,
//       ease: 'Sine.easeInOut',
//       onUpdate: () => {
//         // Ensure coin never goes below original position
//         if (this.y > this.originalY + 15) {
//           this.y = this.originalY + 15;
//         }
//       }
//     });
    
//     // Spinning animation
//     scene.tweens.add({
//       targets: this,
//       rotation: Math.PI * 2,
//       duration: 3000,
//       repeat: -1,
//       ease: 'Linear'
//     });
    
//     // Enhanced glowing effect
//     scene.tweens.add({
//       targets: this,
//       alpha: 0.7,
//       duration: 800,
//       yoyo: true,
//       repeat: -1,
//       ease: 'Power2'
//     });
    
//     // Add golden tint for visibility
//     this.setTint(0xFFD700);
//   }
  
//   collect() {
//     // FIXED: Prevent multiple collections and ensure proper disappearance
//     if (this.collected) return;
//     this.collected = true;
    
//     // Stop all animations before destroying
//     this.scene.tweens.killTweensOf(this);
    
//     // Enhanced collection effect with guaranteed destruction
//     this.scene.tweens.add({
//       targets: this,
//       scaleX: this.scaleX * 30, // Scale from current size
//       scaleY: this.scaleY * 30, // Scale from current size  
//       alpha: 0,
//       rotation: this.rotation + Math.PI,
//       duration: 300,
//       ease: 'Power2',
//       onComplete: () => {
//         this.destroy();
//       }
//     });
//   }
// }

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Keep your perfect scale and size
    this.setScale(0.05);
    this.body.setSize(30, 30);
    
    // Disable gravity and make coin immovable
    this.body.setGravityY(0);
    this.body.setImmovable(true);
    this.body.moves = false;
    
    // Add collection flag to prevent multiple collections
    this.collected = false;
    
    // Store original Y position to prevent drift
    this.originalY = y;
    
    // Floating animation - use absolute positioning
    scene.tweens.add({
      targets: this,
      y: this.originalY - 15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        // Ensure coin never goes below original position
        if (this.y > this.originalY + 15) {
          this.y = this.originalY + 15;
        }
      }
    });
    
    // Spinning animation
    scene.tweens.add({
      targets: this,
      rotation: Math.PI * 2,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Enhanced glowing effect
    scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Power2'
    });
    
    // Add golden tint for visibility
    this.setTint(0xFFD700);
  }
  
  collect() {
    // Prevent multiple collections
    if (this.collected) return;
    this.collected = true;
    
    // Stop all animations before destroying
    this.scene.tweens.killTweensOf(this);
    
    // FIXED: Scale UP from current size (make it grow, not shrink)
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.15, // Grow to 3x current size (0.05 * 3 = 0.15)
      scaleY: 0.15,
      alpha: 0,
      rotation: this.rotation + Math.PI * 2, // Full rotation
      duration: 400,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}