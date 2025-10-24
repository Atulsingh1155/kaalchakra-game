export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = 80) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.3); // Reasonable size
    this.speed = speed;
    this.baseSpeed = speed;
    this.body.setSize(80, 150);
    this.groundLevel = 480;
    this.alwaysChase = false;
    this.preferredDistance = 100; // Distance to maintain behind player
    
    // Add menacing appearance
    this.setTint(0xFF4444);
  }

  // ADDED: Method to play hit sound
  playHitSound() {
    try {
      if (this.scene.sound && this.scene.sound.context) {
        // Try to play the loaded hit sound
        if (this.scene.cache.audio.exists('hitSound')) {
          this.scene.sound.play('hitSound');
        } else {
          // Create a simple hit sound programmatically
          const audioContext = this.scene.sound.context;
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Lower frequency for hit sound
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        }
      }
    } catch (error) {
      console.log('Error playing hit sound:', error);
    }
  }

  chasePlayer(player) {
    const horizontalDistance = player.x - this.x;
    const verticalDistance = player.y - this.y;
    
    // FIXED: Enhanced chasing - follow player in ALL directions
    if (Math.abs(horizontalDistance) > 20) {
      // Follow horizontally
      if (horizontalDistance > 0) {
        // Player is to the right - chase right
        this.setVelocityX(this.speed * 0.9);
        this.setFlipX(false);
      } else {
        // Player is to the left - chase left
        this.setVelocityX(-this.speed * 0.9);
        this.setFlipX(true);
      }
    } else {
      // Very close horizontally - slow down
      this.setVelocityX(this.speed * 0.2);
    }
    
    // FIXED: Always maintain distance but follow direction changes
    const distance = Math.abs(horizontalDistance);
    
    if (distance > this.preferredDistance + 100) {
      // Too far - speed up to catch up
      this.setVelocityX(this.body.velocity.x * 1.3);
    } else if (distance < this.preferredDistance - 50) {
      // Too close - slow down but don't stop completely
      this.setVelocityX(this.body.velocity.x * 0.6);
    }
    
    // Keep on ground
    if (this.y > this.groundLevel) {
      this.y = this.groundLevel;
      this.setVelocityY(0);
    }
    
    // Jumping logic - jump if player is above
    if (player.y < this.y - 50 && this.y >= this.groundLevel - 10) {
      this.setVelocityY(-280);
    }
    
    // FIXED: Teleport if enemy gets too far away (in any direction)
    if (Math.abs(horizontalDistance) > 800) {
      // Teleport to maintain chase
      if (horizontalDistance > 0) {
        // Player went right, teleport behind them
        this.x = player.x - this.preferredDistance;
      } else {
        // Player went left, teleport behind them
        this.x = player.x + this.preferredDistance;
      }
      this.y = this.groundLevel;
    }
  }
}