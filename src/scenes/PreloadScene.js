export class PreloadScene extends Phaser.Scene {
  constructor() { 
    super({ key: 'PreloadScene' }); 
  }
  
 preload() {
  // Show loading text
  this.loadingText = this.add.text(480, 270, 'Loading Kaalchakra Game...', {
    font: '32px Arial',
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5);

  // Progress bar
  this.createLoadingBar();

  // Load images without leading slash
  this.load.image('introBackground', 'assets/images/intro_bg.png');
  this.load.image('boy', 'assets/images/boy.png');
  this.load.image('grandmother', 'assets/images/grandmother.png');
  this.load.image('gameBackground', 'assets/images/game_bg.png');
  this.load.image('coin', 'assets/images/coin.png');
  this.load.image('enemy', 'assets/images/enemy.png');
  this.load.image('game_bg2', 'assets/images/game_bg2.png');
  this.load.image('fire_ball', 'assets/images/fire_ball.png');
  
  // Audio files
  this.load.audio('introMusic', 'assets/audio/intro_music.mp3');
  this.load.audio('coinSound', 'assets/audio/coin_collect.wav');
  this.load.audio('hitSound', 'assets/audio/hit_sound.wav');
  
  // Handle successful loads
  this.load.on('filecomplete', (key, type, data) => {
    console.log('Successfully loaded:', key, type);
  });
  
  // Handle load errors and create fallbacks
  this.load.on('loaderror', (fileObj) => {
    console.error('Failed to load:', fileObj.key, fileObj.url);
    
    // Create fallback for coin specifically
    if (fileObj.key === 'coin') {
      this.createFallbackCoin();
    } else {
      this.createFallbackAsset(fileObj.key);
    }
  });
  
  // When all loading is complete
  this.load.on('complete', () => {
    console.log('All assets loaded');
    // Create missing assets if needed
    this.createMissingAssets();
  });
}

// Create a visible fallback coin
createFallbackCoin() {
  const graphics = this.add.graphics();
  
  // Outer gold circle
  graphics.fillStyle(0xFFD700);
  graphics.fillCircle(24, 24, 20);
  
  // Inner lighter circle for depth
  graphics.fillStyle(0xFFFACD);
  graphics.fillCircle(24, 24, 15);
  
  // White border
  graphics.lineStyle(3, 0xFFFFFF);
  graphics.strokeCircle(24, 24, 20);
  
  // Add a simple symbol (dollar sign or star)
  graphics.lineStyle(4, 0xB8860B);
  graphics.beginPath();
  // Vertical line
  graphics.moveTo(24, 8);
  graphics.lineTo(24, 40);
  // Horizontal lines
  graphics.moveTo(16, 18);
  graphics.lineTo(32, 18);
  graphics.moveTo(16, 30);
  graphics.lineTo(32, 30);
  graphics.strokePath();
  
  // Generate the texture
  graphics.generateTexture('coin', 48, 48);
  graphics.destroy();
  
  console.log('✅ Created fallback coin texture');
}

createMissingAssets() {
  // Ensure coin texture exists
  if (!this.textures.exists('coin')) {
    this.createFallbackCoin();
  }
  
  // Create other required assets
  const requiredAssets = ['anklet', 'home', 'temple', 'shard', 'shadowWarrior'];
  
  requiredAssets.forEach(key => {
    if (!this.textures.exists(key)) {
      this.createFallbackAsset(key);
    }
  });
}
  
  create() {
    this.add.text(480, 380, 'Game Ready! Click to Begin Adventure', {
      font: '24px Arial',
      fill: '#00FF00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    this.input.once('pointerdown', () => {
      this.scene.start('IntroScene');
    });
  }
}