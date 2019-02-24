import globals from './globals.js';
import { Player } from './player.js';

/* Return the full path to a resource. */
function getResourcePath(name) {
  console.log(window.location.hostname);
  if (window.location.hostname.includes("dsabsay.github.io")) {
    // return "https://raw.githubusercontent.com/dsabsay/ggj2019/master/" + name;
    return name + "?raw=true";
  }
  return name;
}

function startLevel(index) {
  if (index <= globals.levels.length) {
  	globals.background = new bg();
  	globals.tiles = [];
  	globals.tiles.push(new tile(globals.levels[index-1][0],270,160,2));    // the first tile must start in the middle, big
  	globals.background.slots[1].acceptTile(globals.tiles[0].platforms);

  	var x = 20;
  	for (var i = 1; i<globals.levels[index-1].length; i++) {
      globals.tiles.push(new tile(globals.levels[index-1][i],x,20,1));
      x += 120;
  	}

  	for (let j = 1; j < 8; j++) {
	    globals.clouds.push(new cloud('r'));
  	}

  	if (globals.player1) {
	    globals.player1.x = 290;
	    globals.player1.y = globals.myGameArea.height-200;
	    globals.player1.reset();
  	} else {
	    globals.player1 = new Player(40, 49, "assets/graphics/player/Idle.png", 290, globals.myGameArea.height-200);
  	}

        //reset button
        globals.resetButton = new resetButton();

  } else {
    credits = new credits();
  }
}

class Sound {
  constructor(src) {
    this.sound = new Howl({
      src: [src]
    });
  }

  play() {
    this.sound.play();
  }

  stop() {
    this.sound.pause();
  }

  loop() {
      this.sound.loop = true;
  }
}

function textBox(size, font, x, y) { // text like the score
  this.size = size;
  this.font = font;
  this.x = x;
  this.y = y;

  this.update = function() {
    let ctx = globals.myGameArea.context; //draw text on the screen
    ctx.font = this.size + " " + this.font;
    ctx.filStyle = "black";
    ctx.fillText(this.text, this.x, this.y);
  }
}

function resetButton() {
  this.x = globals.myGameArea.width - 60;
  this.y = globals.myGameArea.height - 60;
  this.width = 50;
  this.height = 50;
  this.image = new Image();
  this.image.src = "assets/graphics/ui/RestartButton.png";

  this.update = function() {
    let ctx = globals.myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (globals.myGameArea.mouseX && globals.myGameArea.mouseY && globals.myGameArea.mousedown) {
      if (globals.myGameArea.mouseX > this.x &&
          globals.myGameArea.mouseX < this.x + this.width &&
          globals.myGameArea.mouseY > this.y &&
          globals.myGameArea.mouseY < this.y + this.height){
          startLevel(globals.level);
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

  for (let i=0; i<3; i++) {
    this.slots.push(new slot(this.x, this.y, this.width, this.height));
    let ctx = globals.myGameArea.context;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.x+=this.width+this.gap;
  }

  this.update = function() {
    // draw bg image
    let ctx = globals.myGameArea.context;
    ctx.drawImage(this.bgImage, 0, -100, 760, 500);

    for (var j=0; j<this.slots.length; j++){
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
    let ctx = globals.myGameArea.context;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    //ctx.fillStyle = "blue";
    //	for (var i=0; i < this.cBoxes.length; i++){
    //   ctx.fillRect(this.cBoxes[i][0], this.cBoxes[i][1], this.cBoxes[i][2], this.cBoxes[i][3]);
    //}
    this.checkPlayer();
  }

  this.checkPlayer = function() {
    if (this.x < globals.player1.x + globals.player1.width &&
      this.x + this.width > globals.player1.x &&
      this.y < globals.player1.y + globals.player1.height &&
      this.y + this.height > globals.player1.y){
      this.player = 1;
    }
    else {
      this.player = 0;
    }
  }
}

function tile(map, x, y, scale){
  this.map = map;
  this.x = x;
  this.y = y;
  this.platforms = [];
  this.zIndex = 1;
  this.width = 24;
  this.height = 17;
  this.scale = scale;
  this.color = "lightblue";

  this.drawx = this.x;
  this.drawy = this.y;
  this.image = new Image();
  this.Twidth = 100;
  this.Theight = 80;
  //this.bgImage = new Image();
  //this.bgImage.src = "Cloud1.png";

  for (var i = 0; i<map.length; i++){ // populate platform array
    for (var j = map[i].length-1; j >=0; j--){
      if (map[i][j] > 0){
        if (map[i][j] >= 9) { // these are globals.apples
            globals.apples.add(new apple(j,i,map[i][j]));
        }
        this.platforms.push(new platform(j,i,map[i][j]));
      }
    }
  }

    this.update = function() {

        let ctx = globals.myGameArea.context;
        ctx.lineWidth = 0.5;
        //ctx.fillRect(this.x, this.y, this.Twidth*this.scale, this.Theight*this.scale); // tile bg
        ctx.strokeRect(this.x, this.y, this.Twidth*this.scale, this.Theight*this.scale); // tile bg
        //ctx.drawImage(this.bgImage, this.x, this.y, this.Twidth*this.scale, this.Theight*0.5*this.scale);

        this.drawx = this.x-2*this.scale;
        this.drawy = this.y;
        for (let i = 0; i < map.length; i++){
            for (let j = 0; j < map[i].length; j++){
                if (map[i][j] > 0 && map[i][j] < 9){
                    this.image.src = "assets/graphics/tiles/Tile" + map[i][j] + ".png"; // draw globals.platforms
                    //ctx.globalAlpha = 0.5;
                    ctx.drawImage(this.image, this.drawx, this.drawy, this.width*this.scale, this.height*this.scale);
                } else if (map[i][j] === 12){
                    for (let apple of globals.apples){
                        if (apple.num === map[i][j]){
                            apple.drawApple(this.drawx-10*this.scale, this.drawy-15*this.scale, (this.width*2)*this.scale, (this.height*2)*this.scale);
                        }
                    }
                } else if (map[i][j] >= 9){
                    for (let apple of globals.apples){
                        if (apple.num === map[i][j]){
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
    } else if (type >= 9){ // apple
        this.type = type;
    } else { // side
        type = 2;
    }

    this.update = function() {
    }
}

function credits() {
    let ctx = globals.myGameArea.context;
    this.image = new Image();
    this.image.src = "assets/graphics/ui/Credits.png";
    this.x = 0;
    this.y = 0;

    this.update = function() {
        ctx.drawImage(this.image, this.x, this.y, 760, 1500);
        if (this.y > -1150){
            this.y -= 1;
        }
    }
}

function apple(x,y,num){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 17;
    this.scale = 1;
    this.num = num;
    this.image = new Image();
    this.image.src;

    this.drawApple = function(dx,dy,height,width){
        if (this.num >= 9){
            if (this.num === 12){
                this.image.src = "assets/graphics/environment/HouseClosed.png";
                //    ctx.drawImage(this.image, dx-20, dy-40, height*4, width*4);
            } else {
                this.image.src = "assets/graphics/items/Apple" + (this.num-8) + ".png";
            }
            let ctx = globals.myGameArea.context;
            ctx.drawImage(this.image, dx, dy, height, width);
        }
    }

    this.touchingPlayer = function(){
        if (this.x < globals.player1.x + globals.player1.width &&
            this.x + this.width > globals.player1.x &&
            this.y < globals.player1.y + globals.player1.height &&
            this.y + this.height > globals.player1.y){
            return 1;
        }
        else {
            return 0;
        }
    }
}

function cloud(type){
    this.image = new Image();
    this.image.src = "assets/graphics/environment/Cloud" + Math.ceil(Math.random()*3) + ".png";
    this.width = Math.floor(Math.random()*150)+100;
    this.height = Math.floor(this.width*(Math.random()*0.25+0.5));

    if (type === 'r'){
        this.x = Math.floor(Math.random()*globals.myGameArea.width);
    } else {
        this.x = -this.width;
    }

    this.y = Math.floor(Math.random()*120);

    this.changeX = Math.random()+0.2;

    this.update = function() {
        this.x += this.changeX;
        let ctx = globals.myGameArea.context;
        ctx.drawImage(this.image, this.x,this.y, this.width, this.height);
    }
}

function leaf(){
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
        let ctx = globals.myGameArea.context;
        ctx.save();
        ctx.translate(this.x+this.width*0.5, this.y+this.width*0.5);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.image, 0,0, this.width, this.height);
        ctx.restore();
    }
}

function tinyLeaf(x,y){
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
        let ctx = globals.myGameArea.context;
        ctx.save();
        ctx.translate(this.x+this.width*0.5, this.y+this.width*0.5);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.image, 0,0, this.width, this.height);
        ctx.restore();
        this.changeY += this.gravity;
    }
}

function updateGameArea() {

    globals.myGameArea.clear();
    globals.myGameArea.frameNumber += 1;
    globals.background.update();


    if (globals.myGameArea.frameNumber === globals.nextLeafAt) { // wait until ready
    	globals.nextLeafAt = Math.floor(Math.random()*60)+20 + globals.myGameArea.frameNumber; //chose a new time
    	globals.leaves.push(new leaf());
    }

    if (globals.myGameArea.frameNumber === globals.nextCloudAt) { // wait until ready
    	globals.nextCloudAt = Math.floor(Math.random()*60)+20 + globals.myGameArea.frameNumber; //chose a new time
    	globals.clouds.push(new cloud('n'));
    }

    for (let c = globals.clouds.length-1; c >=0; c -=1){
        if (globals.clouds[c].x > globals.myGameArea.width) {
            globals.clouds.splice(c,1);
        } else {
            globals.clouds[c].update();
        }
    }

    globals.player1.changeX = 0; // player controls

    if (globals.myGameArea.keys.has(37)) { // left arrow pushed
        globals.player1.moveLeft();
    }
    if (globals.myGameArea.keys.has(39)) { // right arrow pushed
        globals.player1.moveRight();
    }
    if (globals.myGameArea.keys.has(32)) {// space bar pushed
        if (globals.player1.colliding()){
            globals.jumpSound.play();
            globals.player1.image.src = "assets/graphics/player/Jump.png";
            globals.player1.state = "jump";
            globals.player1.changeY = -3.8;
        }
    }

    for (let i = globals.platforms.length-1; i >=0;  i -= 1) { //look at every platform
        globals.platforms[i].update();
    }

    for (let j = 0; j < globals.tiles.length; j++){
        if (globals.myGameArea.mouseX && globals.myGameArea.mouseY && globals.myGameArea.mousedown && (globals.pickup === -1 || globals.pickup === j)){ // touching mouse

            if (globals.myGameArea.mouseX > globals.tiles[j].x &&
                globals.myGameArea.mouseX < globals.tiles[j].x+120*globals.tiles[j].scale
                && globals.myGameArea.mouseY >globals.tiles[j].y
                && globals.myGameArea.mouseY < globals.tiles[j].y+100*globals.tiles[j].scale){


                if (globals.pickup === -1){ // pick up a new tile
                    globals.startTileX = globals.tiles[j].x; // save coordinates for snapping back
                    globals.startTileY = globals.tiles[j].y;
                    globals.startSlotNum = -1;
                    for (var i = 0; i < globals.background.slots.length; i++){
                        if (globals.tiles[j].x === globals.background.slots[i].x && globals.tiles[j].y === globals.background.slots[i].y){ // which slot did i pick up from
                            globals.startSlotNum = i;
                        }
                    }
                    //
                    if (globals.startSlotNum === -1 || globals.background.slots[globals.startSlotNum].player === 0){ // globals.pickup ok
                      if (globals.startSlotNum != -1){
                          globals.background.slots[globals.startSlotNum].removeTile();
                      }
                      globals.pickup = j;

                      if (globals.tiles[j].scale === 2) {
                        globals.pickupOffsetX = (globals.myGameArea.mouseX - globals.tiles[j].x);
                        globals.pickupOffsetY = (globals.myGameArea.mouseY - globals.tiles[j].y);
                      } else {
                        globals.pickupOffsetX = 2*(globals.myGameArea.mouseX - globals.tiles[j].x);
                        globals.pickupOffsetY = 2*(globals.myGameArea.mouseY - globals.tiles[j].y);
                      }
                      globals.tiles[j].scale = 2; // set scale

                    }
                }
                if (globals.pickup === j){ // globals.tiles should place relative to inital mousepos
                  globals.tiles[j].x=globals.myGameArea.mouseX - globals.pickupOffsetX*globals.tiles[j].scale*0.5; // set pos
                  globals.tiles[j].y=globals.myGameArea.mouseY - globals.pickupOffsetY*globals.tiles[j].scale*0.5;
                }
            }
        }
        else { // put something down
            if (globals.pickup === j) {
                globals.pickup = -1;

                if (globals.tiles[j].y > 100){
                    globals.tiles[j].y = 160;
                    globals.tiles[j].scale = 2; //snap to grid


                    for (let slot of globals.background.slots){
                        if (globals.tiles[j].x > slot.x - slot.width*0.5 && globals.tiles[j].x < slot.x + slot.width){
                            if (slot.occupied){ // snap back
                                globals.tiles[j].x = globals.startTileX; // fix this with actual stuff
                                globals.tiles[j].y = globals.startTileY;  // save starting tile position instead of starting mouse
                                globals.tiles[j].scale = 1;
                                if (globals.startSlotNum >= 0){
                                    globals.tiles[j].scale = 2;
                                    globals.background.slots[globals.startSlotNum].acceptTile(globals.tiles[j].platforms);
                                }
                            }
                            else {
                                globals.tiles[j].x = slot.x; // snap
                                slot.acceptTile(globals.tiles[j].platforms);
                            }
                        }
                    }
                } else { // end up back at top
                    globals.tiles[j].scale = 1;
                    var currentX = globals.tiles[j].x;
                    var currentY = globals.tiles[j].y;
                    globals.tiles[j].x = currentX + globals.pickupOffsetX*0.5;
                    globals.tiles[j].y = currentY + globals.pickupOffsetY*0.5;

                }
            }
        }
        globals.tiles[j].update();
    }
    //mText.text="yv: " + globals.player1.changeY; //update score
    //mText.update();
    globals.player1.update(); // update globals.player1

    for (let t = 0; t < globals.tinyLeaves.length; t++){ // don't draw globals.tinyLeaves over credits
        if (globals.tinyLeaves[t].age < globals.tinyLeaves[t].maxAge){
            globals.tinyLeaves[t].update();
        } else {
            globals.tinyLeaves.splice(t,1);
        }
    }

    globals.resetButton.update();

    if (globals.level > globals.levels.length){
        credits.update();
    }

    for (let k = globals.leaves.length-1; k >=0; k -=1){
        if (globals.leaves[k].y > 340) {
            globals.leaves.splice(k,1);
        } else {
            globals.leaves[k].update();
        }
    }
}

export {
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
};
