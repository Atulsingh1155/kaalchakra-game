import { Aarav } from '../objects/Aarav.js';
import { createMobileControls } from '../utils/mobileControlUtility.js';

export class TempleScene extends Phaser.Scene {
  constructor() { 
    super('TempleScene'); 
    this.mobileControls = null;
  }
  
  create() {
    this.add.image(480, 270, 'temple');
    this.add.text(100, 60, [
      "The forgotten temple opens... only for those marked by destiny. Every step you take, time shifts — memories echo, and the shadow of Kaal watches."
    ], { font: "22px serif", fill: "#fff", wordWrap: { width: 760 } });
    
    this.player = new Aarav(this, 100, 400);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shard = this.physics.add.sprite(800, 400, 'shard');
    
    // Add mobile controls for touch devices
    const mobileControlsResult = createMobileControls(this);
    if (mobileControlsResult) {
      this.mobileControls = mobileControlsResult.controls;
      this.mobileControlsContainer = mobileControlsResult.container;
    }
    
    this.physics.add.overlap(this.player, this.shard, () => this.scene.start('ShardScene'));
  }
  
  update() { 
    this.player.move(this.cursors, this.mobileControls); 
  }
}