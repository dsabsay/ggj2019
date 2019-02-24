/* GGJ 2019
   Grandmother's House
   Emily Thomforde, Alex Benton, Daniel Sabsay
   Share & Share Alike
*/
import { Player } from './player.js';
import {
  getResourcePath,
  startLevel,
  Sound,
  textBox,
  resetButton,
  bg,
  slot,
  tile,
  platform,
  credits,
  apple,
  cloud,
  leaf,
  tinyLeaf,
  updateGameArea,
} from './demoGame.js';
import globals from './globals.js';


globals.myGameArea = {
  canvas: document.getElementById("gameArea"), // "gameArea" is what the canvas is called in the html document index.html
  start: function() {

  	this.width = this.canvas.width;
  	this.height = this.canvas.height;

  	this.canvas.style.width = this.canvas.width + "px"; // set pretty pixels through sorcery
  	this.canvas.style.height = this.canvas.height + "px";
  	this.canvas.width *= window.devicePixelRatio || 1;
  	this.canvas.height *= window.devicePixelRatio || 1;

  	this.context = this.canvas.getContext("2d");
  	this.context.scale(2,2);

        this.boundingRect = this.canvas.getBoundingClientRect();
        this.xOffset = this.boundingRect.x;
        this.yOffset = this.boundingRect.y;

    this.frameNumber = 0;
    this.keys = new Set();
    this.interval = setInterval(updateGameArea, 20); //update every 20ms
    //listen for when the user pushes key
    window.addEventListener('mousedown', function(e) {globals.myGameArea.mousedown = true; globals.myGameArea.mouseX = e.clientX-globals.myGameArea.xOffset; globals.myGameArea.mouseY = e.clientY-globals.myGameArea.yOffset;})
    window.addEventListener('mouseup', function(e) {globals.myGameArea.mousedown = false; globals.myGameArea.mouseX = false; globals.myGameArea.mouseY = false;})
    window.addEventListener('mousemove', function(e) {globals.myGameArea.mouseX = e.clientX-globals.myGameArea.xOffset; globals.myGameArea.mouseY = e.clientY-globals.myGameArea.yOffset;})
    window.addEventListener('keydown', function (e) {globals.myGameArea.keys.add(e.keyCode);})
    window.addEventListener('keyup', function (e) {globals.myGameArea.keys.delete(e.keyCode);})
  },
  clear: function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/* Entry point to game. */
function startGame() { // the html document index.html calls startGame()
  globals.myGameArea.start();
  //mText = new textBox("14px", "Helvetica", 100,120);
  globals.bgMusic = new Sound(getResourcePath("assets/sound/main.mp3"));
  globals.bgMusic.loop();
  globals.bgMusic.play();
  globals.jumpSound = new Sound(getResourcePath("assets/sound/jump_start.mp3"));
  globals.landSound = new Sound(getResourcePath("assets/sound/jump_land.mp3"));
  globals.walkSound = new Sound(getResourcePath("assets/sound/Walking.mp3"));
  globals.pickupSound = new Sound(getResourcePath("assets/sound/pickup_item_2.mp3"));

  startLevel(1);
}

startGame();
