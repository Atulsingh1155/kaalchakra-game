export class IntroScene extends Phaser.Scene {
  constructor() { 
    super('IntroScene'); 
  }
  
  create() {
    // Try to play intro music with better error handling
    try {
      if (this.cache.audio.exists('introMusic')) {
        this.introMusic = this.sound.add('introMusic', { 
          loop: true, 
          volume: 0.5 
        });
        this.introMusic.play();
      }
    } catch (error) {
      console.log('Error playing intro music:', error);
    }
    
    // FIXED: Background - fit to screen properly
    this.backgroundImage = this.add.image(480, 270, 'introBackground');
    // Scale the background to fit the screen
    const scaleX = 960 / this.backgroundImage.width;
    const scaleY = 540 / this.backgroundImage.height;
    const scale = Math.max(scaleX, scaleY); // Use max to cover entire screen
    this.backgroundImage.setScale(scale);
    
    // REMOVED: Character images - no longer showing boy and grandmother images
    
    // Story text with typing effect
    this.storyLines = [
      "Once upon a time, in a peaceful village...",
      "A young boy named Aarav lived with his loving grandmother...",
      "One dark night, evil powers kidnapped his father...",
      "Grandmother: 'Dear, your father has been taken by dark forces!'",
      "Grandmother: 'To rescue him, you must collect 100 magical coins!'",
      "Grandmother: 'These coins hold the power to break evil spells!'",
      "Grandmother: 'But be careful! Dark enemies will try to stop you!'",
      "Grandmother: 'Run swiftly, gather the coins, and save your father!'",
      "Click to begin your adventure..."
    ];
    
    this.currentLine = 0;
    
    // MODIFIED: Move text down by changing y position from 100 to 250
    this.displayText = this.add.text(480, 170, '', {
      font: '24px Arial',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);
    
    // Setup fullscreen functionality
    // this.setupFullscreen();
    this.addSkipButton();
    
    // Start showing story
    this.showNextLine();
  }

  showNextLine() {
    if (this.currentLine < this.storyLines.length) {
      const line = this.storyLines[this.currentLine];
      this.displayText.setText(line);
      
      // REMOVED: Character animation code since we no longer have character images
      
      this.currentLine++;
      
      if (this.currentLine < this.storyLines.length) {
        this.time.delayedCall(3000, () => this.showNextLine());
      } else {
        // Last line - wait for click
        this.input.once('pointerdown', () => {
          if (this.introMusic) {
            this.introMusic.stop();
          }
          this.scene.start('Level1Scene');
        });
      }
    }
  }

  addSkipButton() {
    const skipBtn = this.add.text(860, 30, 'Skip', {
      font: '22px Arial',
      fill: '#fff',
      backgroundColor: '#000000AA',
      padding: { x: 16, y: 8 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    skipBtn.on('pointerdown', () => {
      if (this.introMusic) this.introMusic.stop();
      this.scene.start('Level1Scene');
    });
  }
}