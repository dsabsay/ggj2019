import globals from './globals.js';
import {
  tinyLeaf,
  startLevel,
} from './demoGame.js';

class Player {
  constructor(width, height, x, y) {
    this.imgSrcs = {
      idle: "assets/graphics/player/Idle.png",
      base: "assets/graphics/player/Base.png",
      falling: "assets/graphics/player/Falling1.png",
      jump: "assets/graphics/player/Jump.png",
      baskets: [
        "assets/graphics/player/Basket0.png",
        "assets/graphics/player/Basket1.png",
        "assets/graphics/player/Basket2.png",
        "assets/graphics/player/Basket3.png",
      ],
      walkCycle: [
          "assets/graphics/player/Base.png",
          "assets/graphics/player/Walk1.png",
          "assets/graphics/player/Walk2.png",
          "assets/graphics/player/Base.png",
          "assets/graphics/player/Walk2.png",
          "assets/graphics/player/Walk1.png"
      ],
      pickupAnims: {
          0: ["assets/graphics/player/Pick0A.png", "assets/graphics/player/Pick0B.png"],
          1: ["assets/graphics/player/Pick1A.png", "assets/graphics/player/Pick1B.png"],
          2: ["assets/graphics/player/Pick2A.png", "assets/graphics/player/Pick2B.png"],
      },
    };

    this.imgs = {
      idle: null,
      base: null,
      falling: null,
      jump: null,
      baskets: [],
      walkCycle: [],
      pickupAnims: {},
    };

    this.image = null;
    this.basket = null;
    this.zIndex = 1000;
    this.width = width;
    this.height = height;
    this.changeX = 0;
    this.changeY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.08;

    this.walkCycleImgs = [];

    this.walkCycleDelay = 7;

    this.reset();
  }

  reset() {
  	this.state = "idle";
  	this.facing = "right";
  	this.gravitySpeed = 0;
  	this.walkCycleFrame = 0;
  	this.pickupAnimDelay = 7;
  	this.isPickingUp = false;
  	this.numApples = 0;
  	this.appleBeingPicked = null;
  }

  /* Load all images needed for player animations. */
  // TODO: make this return a promise rather than blocking
  async loadImages() {
    let self = this;
    async function _loadImages(sources, dest) {
      for (let key in sources) {
        if (typeof sources[key] === 'string') {
          await self.loadImage(sources[key])
            .then(val => dest[key] = val);
        } else if (Array.isArray(sources[key])) {
          let proms = sources[key].map(src => self.loadImage(src));
          await Promise.all(proms)
            .then(vals => dest[key] = vals);
        } else {
          await _loadImages(sources[key], self.imgs[key]);
        }
      }
    }

    await _loadImages(this.imgSrcs, this.imgs);
    this.image = this.imgs.idle;
  }

  /* Wrap image loading in a Promise. */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(img);
      img.src = src;
    });
  }

  advanceWalkCycle() {
    if (this.walkCycleDelay != 0) {
      this.walkCycleDelay -= 1;
      return;
    }
    this.walkCycleFrame = (this.walkCycleFrame + 1) % this.imgs.walkCycle.length;
    this.image = this.imgs.walkCycle[this.walkCycleFrame];
    this.walkCycleDelay = 7;
  }

  jump() {
    globals.jumpSound.play();
    this.image = this.imgs.jump;
    this.state = "jump";
    this.changeY = -3.8;
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
    this.pickupAnimNum = this.numApples - 1;
    this.pickupAnimFrameNum = -1;
  }

  endPickupAnimation() {
    globals.pickupSound.play();
    this.isPickingUp = false;
    this.image = this.imgs.base;
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

    /* Stop the animation after playing once. */
    /* animNum is -1 the first time this function is called after starting the animation */
    this.pickupAnimFrameNum += 1;
    if (this.pickupAnimFrameNum == this.imgs.pickupAnims[this.pickupAnimNum].length) {
      return this.endPickupAnimation();
    }
    this.image = this.imgs.pickupAnims[this.pickupAnimNum][this.pickupAnimFrameNum];
  }

  update() {
    if (this.isPickingUp) {
      this.advancePickupAnimation();
    }

  	this.touchingApple();

    switch (globals.apples.size){
      case 4:
        this.basket = this.imgs.baskets[0];
        break;
      case 3:
        this.basket = this.imgs.baskets[1];
        break;
      case 2:
        this.basket = this.imgs.baskets[2];
        break;
      case 1:
        this.basket = this.imgs.baskets[3];
        break;
    }

    if (this.colliding()) {
      if (this.gravitySpeed > 0) {
        globals.landSound.play();
        for(var i = 0; i < Math.ceil(Math.random()*4); i++) {
          globals.tinyLeaves.push(new tinyLeaf(this.x+Math.random()*this.width, this.y+this.height*0.75));
        }
        this.image = this.imgs.idle;
      }
      this.gravitySpeed = 0;
    } else {
      if (this.changeY + this.gravitySpeed > 0) {
        this.image = this.imgs.falling;
        this.state = "fall";
      }
      this.gravitySpeed += this.gravity;
      if (this.changeY < 0) {
        if (this.changeY + this.gravity > 0) { // don't sink in
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
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
                    if (slot.cBoxes[i][0] < this.x + this.width &&
                        slot.cBoxes[i][0]+slot.cBoxes[i][2] > this.x &&
                        slot.cBoxes[i][1] < this.y + this.height -10){
                        if (slot.cBoxes[i][4] === 12){ // touching house
                            if (globals.apples.size === 1) { // all globals.apples collected
                                globals.apples.clear();
                                globals.level ++;
                                startLevel(globals.level); //play next globals.level
                            }
                        } else {
                            for (let apple of globals.apples){
                                /* Don't collide with an apple being picked */
                                if (apple == this.appleBeingPicked || this.isPickupUp) {
                                    continue;
                                }
                                if (apple.num === slot.cBoxes[i][4]){
                                    this.appleBeingPicked = apple;
                                    /* apple is deleted after animation finishes */
                                    this.numApples += 1;
                                    this.startPickupAnimation();
                                }
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
        for (let cBox of slot.cBoxes) { //look at every platform
          if (cBox[4] < 9){
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
      for (let slot of globals.background.slots) {
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
      for (let slot of globals.background.slots) {
        for (let cBox of slot.cBoxes) { //look at every platform
          if (cBox[4] === 1 &&
              cBox[1] < this.y + this.height &&
              cBox[1] > this.y + this.height - 10 &&
              cBox[0] < this.x + this.width &&
              cBox[0] + 40 > this.x) { //check if it's touching globals.player1 from below
            return 1;
          }
        }
      }
      return 0;
    }
  }

export { Player };
