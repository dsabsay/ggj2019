/* GGJ 2019
   Grandmother's House
   Emily Thomforde, Alex Benton, Daniel Sabsay
   Share & Share Alike
   */

/* Globals */

var player1;
var levelComplete = 0;
var platforms = [];
var apples = new Set();
var tinyLeaves = [];
var aleaf;
var mText;
var nextLeafAt = 50;
var nextCloudAt = 20;
var leaves = [];
var clouds = [];
var startTileX = -1;
var startTileY = -1;
var startSlotNum = -1;
var pickup = -1;
var counter = 0;
var credits;
var tiles = [];
var background;
var level = 1;
var levels = [level1, level2, level3];
/* Sound Globals */
var bgMusic;
var jumpSound;
var landSound;
var walkSound;
var pickupSound;
var reset;


/* Return the full path to a resource. */
function getResourcePath(name) {
  console.log(window.location.hostname);
  if (window.location.hostname.includes("dsabsay.github.io")) {
    // return "https://raw.githubusercontent.com/dsabsay/ggj2019/master/" + name;
    return name + "?raw=true";
  }
  return name;
}

function startGame() { // the html document index.html calls startGame()
  myGameArea.start();
  //mText = new textBox("14px", "Helvetica", 100,120);
  bgMusic = new sound(getResourcePath("assets/sound/main.mp3"));
  bgMusic.loop();
  bgMusic.play();
  jumpSound = new sound(getResourcePath("assets/sound/jump_start.mp3"));
  landSound = new sound(getResourcePath("assets/sound/jump_land.mp3"));
  walkSound = new sound(getResourcePath("assets/sound/Walking.mp3"));
  pickupSound = new sound(getResourcePath("assets/sound/pickup_item_2.mp3"));

  startLevel(1);
}

function startLevel(index) {
  if (index <= levels.length) {
  	background = new bg();
  	tiles = [];
  	tiles.push(new tile(levels[index-1][0],270,160,2));    // the first tile must start in the middle, big
  	background.slots[1].acceptTile(tiles[0].platforms);

  	var x = 20;
  	for (var i = 1; i<levels[index-1].length; i++) {
      tiles.push(new tile(levels[index-1][i],x,20,1));
      x += 120;
  	}

  	for (j = 1; j < 8; j++) {
	    clouds.push(new cloud('r'));
  	}

  	if (player1) {
	    player1.x = 290;
	    player1.y = myGameArea.height-200;
	    player1.reset();
  	} else {
	    player1 = new Player(40, 49, "assets/graphics/player/Idle.png", 290, myGameArea.height-200);
  	}

        //reset button
        reset = new resetButton();

  } else {
    credits = new credits();
  }
}


var myGameArea = {
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
        window.addEventListener('mousedown', function(e) {myGameArea.mousedown = true; myGameArea.mouseX = e.clientX-myGameArea.xOffset; myGameArea.mouseY = e.clientY-myGameArea.yOffset;})
    window.addEventListener('mouseup', function(e) {myGameArea.mousedown = false; myGameArea.mouseX = false; myGameArea.mouseY = false;})
    window.addEventListener('mousemove', function(e) {myGameArea.mouseX = e.clientX; myGameArea.mouseY = e.clientY;})
    window.addEventListener('keydown', function (e) {myGameArea.keys.add(e.keyCode);})
    window.addEventListener('keyup', function (e) {myGameArea.keys.delete(e.keyCode);})
  },
  clear: function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function sound(src) {
  this.sound = new Howl({
      src: [src]
  });
  this.play = function() {
      this.sound.play();
  }
  this.stop = function() {
      this.sound.pause();
  }
  this.loop = function() {
      this.sound.loop = true;
  }
}

function textBox(size, font, x, y) { // text like the score
  this.size = size;
  this.font = font;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context; //draw text on the screen
    ctx.font = this.size + " " + this.font;
    ctx.filStyle = "black";
    ctx.fillText(this.text, this.x, this.y);
  }
}

function resetButton() {
  this.x = myGameArea.width - 60;
  this.y = myGameArea.height - 60;
  this.width = 50;
  this.height = 50;
  this.image = new Image();
  this.image.src = "assets/graphics/ui/RestartButton.png";

  this.update = function() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (myGameArea.mouseX && myGameArea.mouseY && myGameArea.mousedown) {
      if (myGameArea.mouseX > this.x &&
          myGameArea.mouseX < this.x + this.width &&
          myGameArea.mouseY > this.y &&
          myGameArea.mouseY < this.y + this.height){
          startLevel(level);
      }
    }

  }
}

function bg() {
  this.x = 50;
  this.y = 160;
  this.width = 200;
  this.height = 160;
  this.gap = 20;
  this.slots = [];
  this.bgImage = new Image();
  this.bgImage.src = "assets/graphics/environment/Background.png";

  for (var i=0; i<3; i++) {
    this.slots.push(new slot(this.x, this.y, this.width, this.height));
    ctx = myGameArea.context;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.x+=this.width+this.gap;
  }

  this.update = function() {
    // draw bg image
    ctx = myGameArea.context;
    ctx.drawImage(this.bgImage, 0, -100, 760, 500);

    for (var j=0; j<this.slots.length; j++) {
      this.slots[j].update();
    }
  }
}

function slot(x,y,width,height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.occupied = 0;
  this.player = 0;
  this.cBoxes = [];

  this.acceptTile = function(pArray) {
    this.occupied = 1;
    for (var i=0; i<pArray.length; i++) {
      this.cBoxes.push([this.x+(pArray[i].x*42),
          this.y+((pArray[i].y)*27), 42, 27, pArray[i].type
      ]);
    }
  }
  this.removeTile = function() {
    this.cBoxes = [];
    this.occupied = 0;
  }

  this.update = function() {
    ctx = myGameArea.context;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    //ctx.fillStyle = "blue";
    //	for (var i=0; i < this.cBoxes.length; i++){
    //   ctx.fillRect(this.cBoxes[i][0], this.cBoxes[i][1], this.cBoxes[i][2], this.cBoxes[i][3]);
    //}
    this.checkPlayer();
  }

  this.checkPlayer = function() {
    if (this.x < player1.x + player1.width &&
      this.x + this.width > player1.x &&
      this.y < player1.y + player1.height &&
      this.y + this.height > player1.y){
      this.player = 1;
    }
    else {
      this.player = 0;
    }
  }
}

function tile(map, x, y, scale) {
  this.map = map;
  this.x = x;
  this.y = y;
  this.zIndex = 1;
  this.width = 24;
  this.height = 17;
  this.platforms = [];
  this.scale = scale;
  this.color = "lightblue";

  this.drawx = this.x;
  this.drawy = this.y;
  this.image = new Image();
  this.Twidth = 100;
  this.Theight = 80;
  //this.bgImage = new Image();
  //this.bgImage.src = "Cloud1.png";

  for (var i = 0; i<map.length; i++) { // populate platform array
    for (var j = map[i].length-1; j >=0; j--) {
      if (map[i][j] > 0) {
        if (map[i][j] >= 9) { // these are apples
          apples.add(new apple(j,i,map[i][j]));
        }
        this.platforms.push(new platform(j,i,map[i][j]));
      }
    }
  }

  this.update = function() {

    ctx.lineWidth = 0.5;
    //ctx.fillRect(this.x, this.y, this.Twidth*this.scale, this.Theight*this.scale); // tile bg
    ctx.strokeRect(this.x, this.y, this.Twidth*this.scale, this.Theight*this.scale); // tile bg
    //ctx.drawImage(this.bgImage, this.x, this.y, this.Twidth*this.scale, this.Theight*0.5*this.scale);

    this.drawx = this.x-2*this.scale;
    this.drawy = this.y;
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (map[i][j] > 0 && map[i][j] < 9) {
          this.image.src = "assets/graphics/tiles/Tile" + map[i][j] + ".png"; // draw platforms
          //ctx.globalAlpha = 0.5;
          ctx.drawImage(this.image, this.drawx, this.drawy, this.width*this.scale, this.height*this.scale);
        } else if (map[i][j] === 12) {
          for (let apple of apples) {
            if (apple.num === map[i][j]) {
              apple.drawApple(this.drawx-10*this.scale, this.drawy-15*this.scale, (this.width*2)*this.scale, (this.height*2)*this.scale);
            }
          }
        } else if (map[i][j] >= 9) {
          for (let apple of apples) {
            if (apple.num === map[i][j]) {
              apple.drawApple(this.drawx+5, this.drawy, (this.width-10)*this.scale, (this.height-2)*this.scale);
            }
          }
        }
        this.drawx += this.width*this.scale-4*this.scale;
      }
      this.drawx = this.x-2*this.scale;
      this.drawy += this.height*this.scale-4*this.scale;
    }
  }
}

function platform(x, y, type) { // for things to collide with
  this.x = x;
  this.y = y;
  if (type < 5){
    this.type = 1; // top
  } else if (type >= 9) { // apple
    this.type = type;
  } else { // side
    type = 2;
  }

  this.update = function() {
  }
}

class Player {
  constructor(width, height, image, x, y) {
    this.image = new Image();
    this.image.src = image;
    this.basket = new Image();
    this.basket.src = "assets/graphics/player/Basket0.png";
    this.zIndex = 1000;
    this.width = width;
    this.height = height;
    this.changeX = 0;
    this.changeY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.08;

    this.walkCycle = [
      "assets/graphics/player/Base.png",
      "assets/graphics/player/Walk1.png",
      "assets/graphics/player/Walk2.png",
      "assets/graphics/player/Base.png",
      "assets/graphics/player/Walk2.png",
      "assets/graphics/player/Walk1.png"
    ];
    this.walkCycleDelay = 7;

    this.pickupAnims = [
      ["assets/graphics/player/Pick0A.png", "assets/graphics/player/Pick0B.png"],
      ["assets/graphics/player/Pick1A.png", "assets/graphics/player/Pick1B.png"],
      ["assets/graphics/player/Pick2A.png", "assets/graphics/player/Pick2B.png"]
    ];

    this.loadImages();
    this.reset();
  }

  reset() {
    this.state = "idle";
    this.facing = "right";
    this.gravitySpeed = 0;
    this.walkCycleFrame = 0;
    this.pickupAnimFrame = [0, 0];  /* a tuple of indices for pickupAnims */
    this.pickupAnimDelay = 7;
    this.isPickingUp = false;
    this.numApples = 0;
    this.appleBeingPicked = null;
  }

  /* Load all images needed for player animations. */
  async loadImages() {

  }

  loadImage(img) {

  }

  nextImage() {
    if (this.image.src === "assets/graphics/player/Base.png"){
      this.image.src = "assets/graphics/player/Idle.png";
    } else {
      this.image.src = "assets/graphics/player/Base.png";
    }
  }

  advanceWalkCycle() {
    if (this.walkCycleDelay != 0) {
      this.walkCycleDelay -= 1;
      return;
    }
    this.walkCycleFrame = (this.walkCycleFrame + 1) % this.walkCycle.length;
    this.image.src = this.walkCycle[this.walkCycleFrame];
    this.walkCycleDelay = 7;
  }

  moveRight() {
    if (!this.collidingRight()) {
      this.changeX = 1.8;
      this.facing = "right";
      this.advanceWalkCycle();
    }
  }

  moveLeft() {
    if (!this.collidingLeft()) {
      this.changeX = -1.8;
      this.facing = "left";
      this.advanceWalkCycle();
    }
  }

  /* Starts the pickup animation. */
  startPickupAnimation() {
    this.isPickingUp = true;
    /* Start at -1 so that the animation begins in advancePickupAnimation() */
    /* numApples is already incremented before this method is called */
    this.pickupAnimFrame = [this.numApples - 1, -1];
  }

  endPickupAnimation() {
    pickupSound.play();
    this.isPickingUp = false;
    this.image.src = "assets/graphics/player/Base.png";
    this.appleBeingPicked.num = 0; // remove apple type
    apples.delete(this.appleBeingPicked);
    this.appleBeingPicked = null;
  }

  /* Advances to the next frame of the pickup animation. */
  advancePickupAnimation() {
    if (this.pickupAnimDelay != 0) {
      this.pickupAnimDelay -= 1;
      return;
    }
    this.pickupAnimDelay = 7;

    var animNum = this.pickupAnimFrame[0];
    var frameNum = this.pickupAnimFrame[1];
    frameNum += 1;
    /* Stop the animation after playing once. */
    if (frameNum == this.pickupAnims[animNum].length) {
      return this.endPickupAnimation();
    }
    //console.log(animNum, frameNum);
    this.image.src = this.pickupAnims[animNum][frameNum];

    this.pickupAnimFrame[1] = frameNum;  /* update the frame counter */

  }

  update() {

    if (this.isPickingUp) {
      this.advancePickupAnimation();
    }

    this.touchingApple();

    switch (apples.size) {
      case 4:
        this.basket.src = "assets/graphics/player/Basket0.png";
        break;
      case 3:
        this.basket.src = "assets/graphics/player/Basket1.png";
        break;
      case 2:
        this.basket.src = "assets/graphics/player/Basket2.png";
        break;
      case 1:
        this.basket.src = "assets/graphics/player/Basket3.png";
        break;
    }

    if (this.colliding()) {
      if (this.gravitySpeed > 0) {
        landSound.play();
        for (var i = 0; i < Math.ceil(Math.random()*4); i++) {
          tinyLeaves.push(new tinyLeaf(this.x+Math.random()*this.width, this.y+this.height*0.75));
        }
        this.image.src = "assets/graphics/player/Idle.png";
      }
      this.gravitySpeed = 0;
    }
    else {
      //console.log(this.changeY);
      if (this.changeY + this.gravitySpeed > 0) {
        this.image.src = "assets/graphics/player/Falling1.png";
        this.state = "fall";
      }
      this.gravitySpeed += this.gravity;
      if (this.changeY < 0) {
        if (this.changeY + this.gravity > 0){ // don't sink in
        this.changeY = 0;
      } else {
        this.changeY += this.gravity;
      }
    }
  }
  this.y += this.changeY + this.gravitySpeed;
  this.x += this.changeX;

  ctx = myGameArea.context; // draw player
  ctx.save();
  if (this.facing === "left") {
    ctx.scale(-1,1);
    ctx.drawImage(this.image,
      -this.x - this.width,
      this.y,
      this.width, this.height);

      //if (this.state === "jump"){
      //ctx.rotate(15);
      //}

      ctx.drawImage(this.basket, -this.x+20 - this.width, this.y+20, 25, 17);
    } else {
      ctx.scale(1,1);
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
        //if (this.state === "jump"){
        //ctx.rotate(15);
        //}
        ctx.drawImage(this.basket, this.x+20, this.y+20, 25, 17);
      }
      ctx.restore();
    }


  touchingApple() {
    for (let slot of background.slots) { // all the slots
      for (var i = 0; i<slot.cBoxes.length; i++) { // all the platforms
        if (slot.cBoxes[i][4] >=9){ // platform type
          //console.log(slot.cBoxes[i][4]);
          if (slot.cBoxes[i][0] < this.x + this.width &&
            slot.cBoxes[i][0]+slot.cBoxes[i][2] > this.x &&
            slot.cBoxes[i][1] < this.y + this.height -10) {
              if (slot.cBoxes[i][4] === 12) { // touching house
                if (apples.size === 1) { // all apples collected
                  apples.clear();
                  level ++;
                  startLevel(level); //play next level
                  levelComplete += 1; // you win
                  //window.location.replace("credits.html");
                }
              } else {

                //index is slot.cBoxes[i][4]
                for (let apple of apples) {
                  /* Don't collide with an apple being picked */
                  if (apple == this.appleBeingPicked) {
                    continue;
                  }
                  //console.log(apple.num, slot.cBoxes[i][4]);
                  if (apple.num === slot.cBoxes[i][4]) {
                    this.appleBeingPicked = apple;
                    /* apple is deleted after animation finishes */
                    this.numApples += 1;
                    this.startPickupAnimation();
                    //console.log(apples.size);
                  }
                  //slot.cBoxes.splice(i,1);
                  //console.log(apple.num);
                }
              }
              return 1;
            }
          }
        }
      }
      return 0;
    }

    collidingRight() {
      for (let slot of background.slots) {
        for (let cBox of slot.cBoxes){ //look at every platform
          //console.log(cBox[4]);
          if (cBox[4] < 9) {
            if (cBox[0] < this.x + this.width &&
              cBox[0] > this.x &&
              cBox[1] < this.y + this.height -10) {
                return 1;
            }
          }
        }
      }
      return 0;
    }

    collidingLeft() {
      for (let slot of background.slots) {
        for (let cBox of slot.cBoxes){ //look at every platform
          if (cBox[4] < 9){
            if (cBox[0] + 45 > this.x &&
              cBox[0] + 45 < this.x + this.width &&
              cBox[1] < this.y + this.height -10) {
                return 1;
            }
          }
        }
      }
      return 0;
    }

  colliding() {
    for (let slot of background.slots) {
      for (let cBox of slot.cBoxes) { //look at every platform
        //console.log(cBox, this.x, this.width);
        if (cBox[4] === 1 &&
          cBox[1] < this.y + this.height &&
          cBox[1] > this.y + this.height - 10 &&
          cBox[0] < this.x + this.width &&
          cBox[0] + 40 > this.x) { //check if it's touching player1 from below
          return 1;
        }
      }
    }
    return 0;
  }
}
// End player class


function credits() {
  ctx = myGameArea.context;
  this.image = new Image();
  this.image.src = "assets/graphics/ui/Credits.png";
  this.x = 0;
  this.y = 0;

  this.update = function() {
    ctx.drawImage(this.image, this.x, this.y, 760, 1500);
    if (this.y > -1150) {
      this.y -= 1;
    }
  }
}

function apple(x,y,num) {
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 17;
  this.scale = 1;
  this.num = num;
  this.image = new Image();
  this.image.src;

  this.drawApple = function(dx,dy,height,width) {
    if (this.num >= 9) {
      if (this.num === 12) {
        this.image.src = "assets/graphics/environment/HouseClosed.png";
        //    ctx.drawImage(this.image, dx-20, dy-40, height*4, width*4);
      } else {
        this.image.src = "assets/graphics/items/Apple" + (this.num-8) + ".png";
      }
      ctx.drawImage(this.image, dx, dy, height, width);
    }
  }

  this.touchingPlayer = function() {
    if (this.x < player1.x + player1.width &&
      this.x + this.width > player1.x &&
      this.y < player1.y + player1.height &&
      this.y + this.height > player1.y) {
        return 1;
    }
    else {
      return 0;
    }
  }
}

function cloud(type) {
  this.image = new Image();
  this.image.src = "assets/graphics/environment/Cloud" + Math.ceil(Math.random()*3) + ".png";
  this.width = Math.floor(Math.random()*150)+100;
  this.height = Math.floor(this.width*(Math.random()*0.25+0.5));

  if (type === 'r') {
    this.x = Math.floor(Math.random()*myGameArea.width);
  } else {
    this.x = -this.width;
  }

  this.y = Math.floor(Math.random()*120);

  this.changeX = Math.random()+0.2;

  this.update = function() {
    this.x += this.changeX;
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x,this.y, this.width, this.height);
  }
}

function leaf() {
  this.image = new Image();
  this.image.src = "assets/graphics/environment/Leaf.png";
  this.x = Math.random()*720;
  this.y = -50;
  this.rotation = Math.random()*360;
  this.width = Math.floor(Math.random()*25)+25;
  this.height = this.width;
  this.changeR = Math.random()*3 - 1.5;

  this.changeX = Math.random()*3;
  this.changeY = Math.sqrt(16-Math.pow(this.changeX,2));

  this.update = function() {
    this.x += this.changeX;
    this.y += this.changeY;
    this.rotation += this.changeR;
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x+this.width*0.5, this.y+this.width*0.5);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.drawImage(this.image, 0,0, this.width, this.height);
    ctx.restore();
  }
}

function tinyLeaf(x,y) {
  this.image = new Image();
  this.image.src = "assets/graphics/environment/Leaf.png";
  this.gravity = 0.03;
  this.age = 0;
  this.maxAge = Math.floor(Math.random()*50)+40;

  this.x = x;
  this.y = y;
  this.rotation = Math.random()*360;
  this.width = 10;
  this.height = this.width;
  this.changeR = Math.random()*3 - 1.5;
  this.changeX = Math.random()*2 -1;
  this.changeY = -Math.random();

  this.update = function() {
    this.age++;
    this.x += this.changeX;
    this.y += this.changeY;
    this.rotation += this.changeR;
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x+this.width*0.5, this.y+this.width*0.5);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.drawImage(this.image, 0,0, this.width, this.height);
    ctx.restore();
    this.changeY += this.gravity;
  }
}

          function updateGameArea() {

            myGameArea.clear();
            myGameArea.frameNumber += 1;
            background.update();


            if (myGameArea.frameNumber === nextLeafAt) { // wait until ready
              nextLeafAt = Math.floor(Math.random()*60)+20 + myGameArea.frameNumber; //chose a new time
              leaves.push(new leaf());
            }

            if (myGameArea.frameNumber === nextCloudAt) { // wait until ready
              nextCloudAt = Math.floor(Math.random()*60)+20 + myGameArea.frameNumber; //chose a new time
              clouds.push(new cloud('n'));
            }

            for (c = clouds.length-1; c >=0; c -=1) {
              if (clouds[c].x > myGameArea.width) {
                clouds.splice(c,1);
              } else {
                clouds[c].update();
              }
            }

            player1.changeX = 0; // player controls

            if (myGameArea.keys.has(37)) { // left arrow pushed
              player1.moveLeft();
            }
            if (myGameArea.keys.has(39)) { // right arrow pushed
              player1.moveRight();
            }
            if (myGameArea.keys.has(32)) {// space bar pushed
              if (player1.colliding()) {
                jumpSound.play();
                player1.image.src = "assets/graphics/player/Jump.png";
                player1.state = "jump";
                player1.changeY = -3.8;
              }
            }

            for (i = platforms.length-1; i >=0;  i -= 1) { //look at every platform
              platforms[i].update();
            }



            for (j = 0; j < tiles.length; j++) {
              if (myGameArea.mouseX && myGameArea.mouseY && myGameArea.mousedown && (pickup === -1 || pickup === j)) { // touching mouse

                if (myGameArea.mouseX > tiles[j].x &&
                  myGameArea.mouseX < tiles[j].x+120*tiles[j].scale
                  && myGameArea.mouseY >tiles[j].y
                  && myGameArea.mouseY < tiles[j].y+100*tiles[j].scale) {


                    if (pickup === -1) { // pick up a new tile
                      startTileX = tiles[j].x; // save coordinates for snapping back
                      startTileY = tiles[j].y;
                      startSlotNum = -1;
                      for (var i = 0; i < background.slots.length; i++) {
                        if (tiles[j].x === background.slots[i].x && tiles[j].y === background.slots[i].y) { // which slot did i pick up from
                          startSlotNum = i;
                        }
                      }
                      //
                      if (startSlotNum === -1 || background.slots[startSlotNum].player === 0) { // pickup ok
                        if (startSlotNum != -1) {
                          background.slots[startSlotNum].removeTile();
                        }
                        pickup = j;
                        tiles[j].scale = 2; // set scale
                        //tiles[j].color = "red";
                      }
                      //}
                    }
                    if (pickup === j) {
                      tiles[j].x=myGameArea.mouseX-80; // set pos
                      tiles[j].y=myGameArea.mouseY-80;
                    }
                  }
                  else {
                    tiles[j].color = "lightblue";
                  }
                }
                else { // put something down
                  if (pickup === j) {
                    pickup = -1;

                    if (tiles[j].y > 100) {
                      tiles[j].y = 160;
                      tiles[j].scale = 2; //snap to grid


                      for (let slot of background.slots) {
                        if (tiles[j].x > slot.x - slot.width*0.5 && tiles[j].x < slot.x + slot.width) {
                          if (slot.occupied){ // snap back
                            tiles[j].x = startTileX; // fix this with actual stuff
                            tiles[j].y = startTileY;  // save starting tile position instead of starting mouse
                            tiles[j].scale = 1;
                            if (startSlotNum >= 0){
                              tiles[j].scale = 2;
                              background.slots[startSlotNum].acceptTile(tiles[j].platforms);
                            }
                          }
                          else {
                            tiles[j].x = slot.x; // snap
                            slot.acceptTile(tiles[j].platforms);
                          }
                        }
                      }
                      /*
                      if (tiles[j].x > 400) { // rewrite this by iterating over slots. Check whether starting or ending inside a slot to remove or add
                    }
                  } else if (tiles[j].x < 200){
                  if (!background.slots[0].occupied){
                  tiles[j].x = 50;
                  background.slots[0].acceptTile(tiles[j].platforms);
                }
              } else {
              if (!background.slots[1].occupied){
              tiles[j].x = 270;
              background.slots[1].acceptTile(tiles[j].platforms);
            }
          }
          */
        } else {
          tiles[j].scale = 1;
        }
        tiles[j].color = "lightblue";
      }
    }
    tiles[j].update();
  }
  //mText.text="yv: " + player1.changeY; //update score
  //mText.update();
  player1.update(); // update player1

  for (t = 0; t < tinyLeaves.length; t++) { // don't draw tinyleaves over credits
    if (tinyLeaves[t].age < tinyLeaves[t].maxAge) {
      tinyLeaves[t].update();
    } else {
      tinyLeaves.splice(t,1);
    }
  }

  reset.update();

if (level > levels.length) {
  credits.update();
}

for (k = leaves.length-1; k >=0; k -=1) {
  if (leaves[k].y > 340) {
    leaves.splice(k,1);
  } else {
    leaves[k].update();
  }
}
}
