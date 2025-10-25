// export class Aarav extends Phaser.Physics.Arcade.Sprite {
//   constructor(scene, x, y) {
//     super(scene, x, y, 'boy');
//     scene.add.existing(this);
//     scene.physics.add.existing(this);
    
//     // Set proper body size and ground level
//     this.setScale(0.4);
//     this.setBounce(0.2);
//     this.body.setSize(80,250); // Set collision box size

//     // Set ground level - game height is 540, so ground should be around 450
//     this.groundLevel = 480;
//     this.isJumping = false; // Add jumping state
//     this.body.setCollideWorldBounds(true);
    
//     // Initialize powerup states
//     this.speedBoost = 1;
//     this.hasShield = false;
//     this.hasMultishot = false;
//   }

//   move(cursors, mobileControls = null) {
//     // Get if player is touching the ground or a platform
//     const onGround = this.body.blocked.down || this.body.touching.down || this.y >= this.groundLevel - 5;
    
//     // Combine keyboard and mobile inputs
//     const left = (cursors && cursors.left.isDown) || (mobileControls && mobileControls.left);
//     const right = (cursors && cursors.right.isDown) || (mobileControls && mobileControls.right);
//     const up = (cursors && cursors.up.isDown) || (mobileControls && mobileControls.up);
    
//     // Apply speed boost if player has it
//     const speedMultiplier = this.speedBoost || 1;
    
//     // Horizontal movement
//     if (left) {
//       this.setVelocityX(-200 * speedMultiplier);
//       this.setFlipX(false); // Face left
//     } else if (right) {
//       this.setVelocityX(200 * speedMultiplier);
//       this.setFlipX(true); // Face right
//     } else {
//       this.setVelocityX(0);
//     }
    
//     // Jumping - only if on ground and not already jumping
//     if (up && onGround) {
//       this.setVelocityY(-400);
//       this.isJumping = true;
//     }
    
//     // Reset jumping state if on any ground (platform or floor)
//     if (onGround && this.body.velocity.y === 0) {
//       this.isJumping = false;
//     }
//   }

//   // ADD THIS METHOD: Reset player state when returning to Level 1
//   reinitialize() {
//     // Reset any player-specific flags
//     this.setActive(true);
//     this.setVisible(true);
//     this.body.moves = true;
//     this.body.setEnable(true);
//     this.setVelocity(0, 0);
    
//     // Reset any powerups or special states
//     this.speedBoost = 1;
//     this.hasShield = false;
//     this.hasMultishot = false;
    
//     // Reset alpha and scale in case they were modified
//     this.setAlpha(1);
//     this.setScale(0.4); // Use the proper scale for Aarav
    
//     // Reset jumping state
//     this.isJumping = false;
    
//     // Ensure physics body is properly configured
//     this.body.setSize(70, 150);
//     this.setBounce(0.2);
//     this.body.setCollideWorldBounds(true);
//   }
// }

export class Aarav extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set proper body size and ground level
    this.setScale(0.4);
    this.setBounce(0.2);
    this.body.setSize(80, 200); // match reinitialize and avoid super-tall body

    // Ground level used across scenes
    this.groundLevel = 480;
    // Lift the standing position slightly above the ground line
    this.standOffset = 8; // tweak to raise/lower visual standing height

    this.isJumping = false;
    this.body.setCollideWorldBounds(true);
    
    // Initialize powerup states
    this.speedBoost = 1;
    this.hasShield = false;
    this.hasMultishot = false;

    // Ensure we start on ground, not at world bottom
    this.snapToGround();
  }

  move(cursors, mobileControls = null) {
    // Use feet-ground (groundLevel - standOffset) for accurate ground detection
    const groundY = this.feetGroundY();
    const onGround =
      this.body.blocked.down ||
      this.body.touching.down ||
      this.y >= groundY - 1; // allow tiny epsilon for floating point precision
    
    // Combine keyboard and mobile inputs
    const left = (cursors && cursors.left.isDown) || (mobileControls && mobileControls.left);
    const right = (cursors && cursors.right.isDown) || (mobileControls && mobileControls.right);
    const up = (cursors && cursors.up.isDown) || (mobileControls && mobileControls.up);
    
    // Apply speed boost if player has it
    const speedMultiplier = this.speedBoost || 1;
    
    // Horizontal movement
    if (left) {
      this.setVelocityX(-200 * speedMultiplier);
      this.setFlipX(false); // Face left
    } else if (right) {
      this.setVelocityX(200 * speedMultiplier);
      this.setFlipX(true); // Face right
    } else {
      this.setVelocityX(0);
    }
    
    // Jumping - only if on ground and not already jumping
    if (up && onGround) {
      this.setVelocityY(-400);
      this.isJumping = true;
    }
    
    // Reset jumping state if on any ground (platform or floor)
    if (onGround && this.body.velocity.y === 0) {
      this.isJumping = false;
    }

    // Keep player on scene ground (not world bottom), slightly above it
    this.snapToGround();
  }

  // Keep feet a little above the scene's ground line
  snapToGround() {
    const targetY = this.feetGroundY();
    if (this.y > targetY) {
      this.y = targetY;
      this.setVelocityY(0);
    }
  }

  // Helper: y where Aarav should stand (accounts for standOffset)
  feetGroundY() {
    return this.groundLevel - (this.standOffset || 0);
  }

  // Reset player state when returning to Level 1
  reinitialize() {
    // Reset any player-specific flags
    this.setActive(true);
    this.setVisible(true);
    this.body.moves = true;
    this.body.setEnable(true);
    this.setVelocity(0, 0);
    
    // Reset any powerups or special states
    this.speedBoost = 1;
    this.hasShield = false;
    this.hasMultispot = false;
    
    // Reset alpha and scale in case they were modified
    this.setAlpha(1);
    this.setScale(0.4); // Use the proper scale for Aarav
    
    // Reset jumping state
    this.isJumping = false;
    
    // Ensure physics body is properly configured
    this.body.setSize(80, 2000);
    this.setBounce(0.2);
    this.body.setCollideWorldBounds(true);

    // Stand slightly above ground after re-init
    this.snapToGround();
  }
}