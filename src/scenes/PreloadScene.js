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

    // TO (remove leading slash):
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
      console.log('Error loading asset:', fileObj.key);
      
      // Create a fallback asset for required files
      if (fileObj.key === 'coin') {
        this.createFallbackCoin();
      } else {
        // Handle other assets with the general fallback method
        this.createFallbackAsset(fileObj.key);
      }
      
      // Handle audio errors
      if (fileObj.key === 'coinSound' || fileObj.key === 'hitSound') {
        console.log('Audio load failed, will use programmatically generated sounds');
      }
    });
    
    // When all loading is complete
    this.load.on('complete', () => {
      console.log('All assets loaded');
      // Create any missing assets
      this.createMissingAssets();
    });
  }
  
  createLoadingBar() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222);
    progressBox.fillRect(240, 320, 480, 50);
    
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xFFD700);
      progressBar.fillRect(250, 330, 460 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });
  }

  // Add this method to create a fallback coin
  createFallbackCoin() {
    const graphics = this.add.graphics();
    // Draw a simple golden circle
    graphics.fillStyle(0xFFD700);
    graphics.fillCircle(24, 24, 20);
    graphics.lineStyle(3, 0xFFFFFF);
    graphics.strokeCircle(24, 24, 20);
    // Generate texture
    graphics.generateTexture('coin', 48, 48);
    graphics.destroy();
    console.log('Created fallback coin texture');
  }
  
  createFallbackAsset(key) {
    const graphics = this.add.graphics();
    
    switch(key) {
      case 'introBackground':
        graphics.fillGradientStyle(0x4A4A4A, 0x4A4A4A, 0x2A2A2A, 0x2A2A2A);
        graphics.fillRect(0, 0, 960, 540);
        graphics.generateTexture(key, 960, 540);
        break;
        
      case 'boy':
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(64, 64, 50);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(50, 50, 5);
        graphics.fillCircle(78, 50, 5);
        graphics.fillCircle(64, 80, 3);
        graphics.generateTexture(key, 128, 128);
        break;
        
      case 'grandmother':
        // FIXED: Better grandmother sprite with more detail
        graphics.fillStyle(0xFFB6C1); // Pink face
        graphics.fillCircle(64, 64, 50);
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillCircle(50, 50, 5);
        graphics.fillCircle(78, 50, 5);
        // Mouth
        graphics.fillCircle(64, 80, 3);
        // Hair (grey)
        graphics.fillStyle(0x808080);
        graphics.fillCircle(64, 40, 30);
        // Sari (traditional dress)
        graphics.fillStyle(0x800080);
        graphics.fillRect(30, 90, 68, 40);
        graphics.generateTexture(key, 128, 128);
        break;
        
      case 'gameBackground':
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x90EE90, 0x90EE90);
        graphics.fillRect(0, 0, 960, 540);
        graphics.generateTexture(key, 960, 540);
        break;
        
      case 'coin':
        // This case is now handled by createFallbackCoin() method
        this.createFallbackCoin();
        break;
        
      case 'enemy':
        graphics.fillStyle(0x330033);
        graphics.fillRect(10, 10, 76, 76);
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(30, 30, 5);
        graphics.fillCircle(66, 30, 5);
        graphics.generateTexture(key, 96, 96);
        break;
    }
    
    if (key !== 'coin') {
      graphics.destroy();
    }
  }
  
  createMissingAssets() {
    // Create assets that are needed but weren't in the load list
    const requiredAssets = ['anklet', 'home', 'temple', 'shard', 'shadowWarrior'];
    
    requiredAssets.forEach(key => {
      if (!this.textures.exists(key)) {
        this.createFallbackAsset(key);
      }
    });
    
    // FIXED: Create better coin asset with improved visibility
    if (!this.textures.exists('coin')) {
      const graphics = this.add.graphics();
      // Outer gold circle
      graphics.fillStyle(0xFFD700);
      graphics.fillCircle(24, 24, 20);
      // Inner lighter circle
      graphics.fillStyle(0xFFFACD);
      graphics.fillCircle(24, 24, 15);
      // Border
      graphics.lineStyle(2, 0xB8860B);
      graphics.strokeCircle(24, 24, 20);
      // Dollar sign or symbol
      graphics.lineStyle(3, 0xB8860B);
      graphics.beginPath();
      graphics.moveTo(20, 12);
      graphics.lineTo(28, 12);
      graphics.moveTo(18, 18);
      graphics.lineTo(30, 18);
      graphics.moveTo(20, 36);
      graphics.lineTo(28, 36);
      graphics.moveTo(24, 8);
      graphics.lineTo(24, 40);
      graphics.strokePath();
      graphics.generateTexture('coin', 48, 48);
      graphics.destroy();
    }
    
    // Create player asset (anklet)
    if (!this.textures.exists('anklet')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x8B4513);
      graphics.fillCircle(32, 32, 25);
      graphics.fillStyle(0xFFD700);
      graphics.fillRect(15, 50, 34, 8);
      graphics.fillStyle(0x000000);
      graphics.fillCircle(25, 25, 3);
      graphics.fillCircle(39, 25, 3);
      graphics.generateTexture('anklet', 64, 64);
      graphics.destroy();
    }
    
    // Create other required assets
    if (!this.textures.exists('home')) {
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x8B4513, 0x8B4513, 0x654321, 0x654321);
      graphics.fillRect(0, 0, 960, 540);
      graphics.generateTexture('home', 960, 540);
      graphics.destroy();
    }
    
    if (!this.textures.exists('temple')) {
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x2F2F2F, 0x2F2F2F, 0x1F1F1F, 0x1F1F1F);
      graphics.fillRect(0, 0, 960, 540);
      graphics.generateTexture('temple', 960, 540);
      graphics.destroy();
    }
    
    if (!this.textures.exists('shard')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00FFFF);
      graphics.fillRect(20, 20, 8, 8);
      graphics.generateTexture('shard', 48, 48);
      graphics.destroy();
    }
    
    if (!this.textures.exists('shadowWarrior')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x1A0A1A);
      graphics.fillRect(10, 10, 76, 76);
      graphics.generateTexture('shadowWarrior', 96, 96);
      graphics.destroy();
    }
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