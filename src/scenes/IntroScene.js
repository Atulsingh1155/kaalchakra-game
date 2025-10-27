// export class IntroScene extends Phaser.Scene {
//   constructor() { 
//     super('IntroScene'); 
//   }
  
//   create() {
//     // Try to play intro music with better error handling
//     try {
//       if (this.cache.audio.exists('introMusic')) {
//         this.introMusic = this.sound.add('introMusic', { 
//           loop: true, 
//           volume: 0.5 
//         });
//         this.introMusic.play();
//       }
//     } catch (error) {
//       console.log('Error playing intro music:', error);
//     }
    
//     // FIXED: Background - fit to screen properly
//     this.backgroundImage = this.add.image(480, 270, 'introBackground');
//     // Scale the background to fit the screen
//     const scaleX = 960 / this.backgroundImage.width;
//     const scaleY = 540 / this.backgroundImage.height;
//     const scale = Math.max(scaleX, scaleY); // Use max to cover entire screen
//     this.backgroundImage.setScale(scale);
    
//     // FIXED: Characters - proper sizing and positioning
//     this.boy = this.add.image(200, 350, 'boy');
//     // Scale boy to reasonable size
//     const boyScale = Math.min(350 / this.boy.width, 350 / this.boy.height);
//     this.boy.setScale(boyScale);
    
//     this.grandmother = this.add.image(760, 350, 'grandmother');
//     // Scale grandmother to reasonable size
//     const grandmaScale = Math.min(350 / this.grandmother.width, 350 / this.grandmother.height);
//     this.grandmother.setScale(grandmaScale);
    
//     // Story text with typing effect
//     this.storyLines = [
//       "Once upon a time, in a peaceful village...",
//       "A young boy named Aarav lived with his loving grandmother...",
//       "One dark night, evil powers kidnapped his father...",
//       "Grandmother: 'Dear, your father has been taken by dark forces!'",
//       "Grandmother: 'To rescue him, you must collect 100 magical coins!'",
//       "Grandmother: 'These coins hold the power to break evil spells!'",
//       "Grandmother: 'But be careful! Dark enemies will try to stop you!'",
//       "Grandmother: 'Run swiftly, gather the coins, and save your father!'",
//       "Click to begin your adventure..."
//     ];
    
//     this.currentLine = 0;
//     this.displayText = this.add.text(480, 100, '', {
//       font: '24px Arial',
//       fill: '#FFFFFF',
//       stroke: '#000000',
//       strokeThickness: 3,
//       align: 'center',
//       wordWrap: { width: 800 }
//     }).setOrigin(0.5);
    
//     // Setup fullscreen functionality
//     // this.setupFullscreen();
//      this.addSkipButton();
    
//     // Start showing story
//     this.showNextLine();
//   }
  
//   showNextLine() {
//     if (this.currentLine < this.storyLines.length) {
//       const line = this.storyLines[this.currentLine];
//       this.displayText.setText(line);
      
//       // Animate characters based on dialogue
//       if (line.includes('Dadi:')) {
//         this.tweens.add({
//           targets: this.grandmother,
//           scaleX: 1.7,
//           scaleY: 1.7,
//           duration: 200,
//           yoyo: true,
//           ease: 'Power2'
//         });
//       }
      
//       this.currentLine++;
      
//       if (this.currentLine < this.storyLines.length) {
//         this.time.delayedCall(3000, () => this.showNextLine());
//       } else {
//         // Last line - wait for click
//         this.input.once('pointerdown', () => {
//           if (this.introMusic) {
//             this.introMusic.stop();
//           }
//           this.scene.start('Level1Scene');
//         });
//       }
//     }
//   }
//   addSkipButton() {
//     const skipBtn = this.add.text(860, 30, 'Skip', {
//       font: '22px Arial',
//       fill: '#fff',
//       backgroundColor: '#000000AA',
//       padding: { x: 16, y: 8 }
//     }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
//     skipBtn.on('pointerdown', () => {
//       if (this.introMusic) this.introMusic.stop();
//       this.scene.start('Level1Scene');
//     });
//   }
// }


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
    
    // FIXED: Characters - proper sizing and positioning
    this.boy = this.add.image(200, 350, 'boy');
    // Scale boy to reasonable size
    const boyScale = Math.min(350 / this.boy.width, 350 / this.boy.height);
    this.boy.setScale(boyScale);
    
    // ADDED: Flip Aarav to face right (toward grandmother)
    this.boy.setFlipX(true);
    
    this.grandmother = this.add.image(760, 350, 'grandmother');
    // Scale grandmother to reasonable size
    const grandmaScale = Math.min(350 / this.grandmother.width, 350 / this.grandmother.height);
    this.grandmother.setScale(grandmaScale);
    
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
      
      // Animate characters based on dialogue
      if (line.includes('Grandmother:')) {
        this.tweens.add({
          targets: this.grandmother,
          scaleX: this.grandmother.scaleX * 1.1,
          scaleY: this.grandmother.scaleY * 1.1,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });
      }
      
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