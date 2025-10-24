export class Aarav extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set proper body size and ground level
    this.setScale(0.4);
    this.setBounce(0.2);
    this.body.setSize(70, 150); // Set collision box size
    
    // Set ground level - game height is 540, so ground should be around 480
    this.groundLevel = 480;
    this.isJumping = false; // Add jumping state
    this.body.setCollideWorldBounds(true);
  }

  move(cursors, mobileControls = null) {
  // Get if player is touching the ground or a platform
  const onGround = this.body.blocked.down || this.body.touching.down || this.y >= this.groundLevel - 5;
  
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
}
}