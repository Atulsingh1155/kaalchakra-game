export class Aarav extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set proper body size and ground level
    this.setScale(0.4);
    this.setBounce(0.15);
    this.body.setSize(100, 300);

    this.groundLevel = 380; // Raised higher so player appears on top of ground line
    this.standOffset = 0; // No offset needed now

    this.isJumping = false;
    this.body.setCollideWorldBounds(true);
    
    // Initialize powerup states
    this.speedBoost = 1;
    this.hasShield = false;
    this.hasMultishot = false;
    
    // Track facing direction (1 = right, -1 = left)
    this.facingDirection = 1;
  }

  move(cursors, mobileControls = null) {
    // Ground detection
    const onGround = this.body.blocked.down || this.body.touching.down;
    
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
      this.facingDirection = -1;
    } else if (right) {
      this.setVelocityX(200 * speedMultiplier);
      this.setFlipX(true); // Face right
      this.facingDirection = 1;
    } else {
      this.setVelocityX(0);
    }
    
    // Jump logic
    if (up && onGround) {
      this.setVelocityY(-430);
      this.isJumping = true;
    }
    
    // Reset jumping state when on ground
    if (onGround) {
      this.isJumping = false;
    }
  }

  // Reset player state when returning to Level 1
  reinitialize() {
    this.setActive(true);
    this.setVisible(true);
    this.body.moves = true;
    this.body.setEnable(true);
    this.setVelocity(0, 0);
    
    this.speedBoost = 1;
    this.hasShield = false;
    this.hasMultispot = false;
    
    this.setAlpha(1);
    this.setScale(0.4);
    
    this.isJumping = false;
    this.facingDirection = 1;
    
    this.body.setSize(100, 300);
    this.setBounce(0.2);
    this.body.setCollideWorldBounds(true);
  }
}