import globals from './globals.js';
import {
  tinyLeaf,
  startLevel,
} from './demoGame.js';

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
        if (!this.collidingRight()){
            this.changeX = 1.8;
            this.facing = "right";
            this.advanceWalkCycle();
        }
    }

  moveLeft() {
        if (!this.collidingLeft()){
            this.changeX = -1.8;
            this.facing = "left";
            this.advanceWalkCycle();
        }
    }

    /* Starts the globals.pickup animation. */
  startPickupAnimation() {
        this.isPickingUp = true;
        /* Start at -1 so that the animation begins in advancePickupAnimation() */
        /* numApples is already incremented before this method is called */
        this.pickupAnimFrame = [this.numApples - 1, -1];
    }

  endPickupAnimation() {
        globals.pickupSound.play();
        this.isPickingUp = false;
        this.image.src = "assets/graphics/player/Base.png";
        this.appleBeingPicked.num = 0; // remove apple type
        globals.apples.delete(this.appleBeingPicked);
        this.appleBeingPicked = null;
    }

    /* Advances to the next frame of the globals.pickup animation. */
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

        switch (globals.apples.size){
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

        if (this.colliding()){
            if (this.gravitySpeed > 0){
                globals.landSound.play();
		for(var i = 0; i < Math.ceil(Math.random()*4); i++){
		    globals.tinyLeaves.push(new tinyLeaf(this.x+Math.random()*this.width, this.y+this.height*0.75));
		}
                this.image.src = "assets/graphics/player/Idle.png";
            }
            this.gravitySpeed = 0;
        }
        else {
            //console.log(this.changeY);
            if (this.changeY + this.gravitySpeed > 0){
                this.image.src = "assets/graphics/player/Falling1.png";
                this.state = "fall";
            }
            this.gravitySpeed += this.gravity;
            if (this.changeY < 0){
                if (this.changeY + this.gravity > 0){ // don't sink in
                    this.changeY = 0;
                } else {
                    this.changeY += this.gravity;
                }
            }
        }
        this.y += this.changeY + this.gravitySpeed;
        this.x += this.changeX;

        let ctx = globals.myGameArea.context; // draw player
        ctx.save();
        if (this.facing === "left"){
            ctx.scale(-1,1);
            ctx.drawImage(this.image,
                -this.x - this.width,
                this.y,
                this.width, this.height);

            //if (this.state === "jump"){
            //ctx.rotate(15);
            //}

            ctx.drawImage(this.basket, -this.x+20 - this.width, this.y+20, 25, 17);
        } else  {
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
        for (let slot of globals.background.slots){ // all the slots
            for (var i = 0; i<slot.cBoxes.length; i++){ // all the globals.platforms
                if (slot.cBoxes[i][4] >=9){ // platform type
                    //console.log(slot.cBoxes[i][4]);
                    if (slot.cBoxes[i][0] < this.x + this.width &&
                        slot.cBoxes[i][0]+slot.cBoxes[i][2] > this.x &&
                        slot.cBoxes[i][1] < this.y + this.height -10){
                        if (slot.cBoxes[i][4] === 12){ // touching house
                            if (globals.apples.size === 1) { // all globals.apples collected
                                globals.apples.clear();
				globals.level ++;
				startLevel(globals.level); //play next globals.level
                                //window.location.replace("credits.html");
                            }
                        } else {

                            //index is slot.cBoxes[i][4]
                            for (let apple of globals.apples){
                                /* Don't collide with an apple being picked */
                                if (apple == this.appleBeingPicked) {
                                    continue;
                                }
                                //console.log(apple.num, slot.cBoxes[i][4]);
                                if (apple.num === slot.cBoxes[i][4]){
                                    this.appleBeingPicked = apple;
                                    /* apple is deleted after animation finishes */
                                    this.numApples += 1;
                                    this.startPickupAnimation();
                                    //console.log(globals.apples.size);
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
        for (let slot of globals.background.slots) {
            for (let cBox of slot.cBoxes){ //look at every platform
                //console.log(cBox[4]);
                if (cBox[4] < 9){
                    if (cBox[0] < this.x + this.width &&
                        cBox[0] > this.x &&
                        cBox[1] < this.y + this.height -10){
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    collidingLeft() {
        for (let slot of globals.background.slots) {
            for (let cBox of slot.cBoxes){ //look at every platform
                if (cBox[4] < 9){
                    if (cBox[0] + 45 > this.x &&
                        cBox[0] + 45 < this.x + this.width&&
                        cBox[1] < this.y + this.height -10){
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

  colliding() {
        for (let slot of globals.background.slots) {
            for (let cBox of slot.cBoxes){ //look at every platform
                //console.log(cBox, this.x, this.width);
                if (cBox[4] === 1 &&
                    cBox[1] < this.y + this.height &&
                    cBox[1] > this.y + this.height - 10 &&
                    cBox[0] < this.x + this.width &&
                    cBox[0] + 40 > this.x){ //check if it's touching globals.player1 from below
                    return 1;
                }
            }
        }
        return 0;
    }
}

export { Player };
