/* GGJ 2019
   Grandmother's House
   Emily Thomforde, Alex Benton, Daniel Sabsay
   Share & Share Alike
 */

var player1;
var platforms = [];
var mText;
var startTileX = -1;
var startTileY = -1;
var startSlotNum = -1;
var pickup = -1;
var counter = 0;
var bgMusic;
var jumpSound;
var landSound;
var level1 = [[[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [2,3,0,0,0]],
	
	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,2,3,0],
	     [0,0,0,0,0],
	     [0,2,3,0,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,1,0,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [1,0,0,0,0],
	     [7,0,0,1,0],
	     [7,0,2,6,0],
	     [8,4,8,6,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,2,3,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,1,0,0]]];

var level2 = [[[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,1],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0]],
	
	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,2,3],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,1]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [1,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,1,0],
	     [0,0,0,7,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [2,3,0,0,0]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,1],
	     [0,0,0,2,6],
	     [0,0,0,5,6],
	     [0,0,0,5,6]],

	    [[0,0,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0],
	     [2,3,0,0,0],
	     [0,0,0,0,0],
	     [0,0,0,0,0]]];
var tiles = [];
var background;

function startGame() { // the html document index.html calls startGame()
    myGameArea.start();
    background = new bg();
    mText = new textBox("14px", "Helvetica", 100,120);
    bgMusic = new sound("main.mp3");
    bgMusic.loop = true;
    bgMusic.play();
    jumpSound = new sound("jump_start.mp3");
    landSound = new sound("jump_land.mp3");
    platforms.push(new platform(260, 290));
    tiles.push(new tile(level1[0],270,160,2));    // the first tile must start in the middle, big
    background.slots[1].acceptTile(tiles[0].platforms);
    var x = 20;
    for (var i = 1; i<level1.length; i++){
	tiles.push(new tile(level1[i],x,20,1));
	x += 120;    
    }

    player1 = new player(30, 50, "rr_stand.png", 290, myGameArea.canvas.height-200);
}

var myGameArea = {
    canvas : document.getElementById("gameArea"), // "gameArea" is what the canvas is called in the html document index.html
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.frameNumber = 0;
	this.keys = new Set();
        this.interval = setInterval(updateGameArea, 20); //update every 20ms
	//listen for when the user pushes key
	window.addEventListener('mousedown', function(e) {myGameArea.mousedown = true; myGameArea.mouseX = e.clientX; myGameArea.mouseY = e.clientY;})
	window.addEventListener('mouseup', function(e) {myGameArea.mousedown = false; myGameArea.mouseX = false; myGameArea.mouseY = false;})
	window.addEventListener('mousemove', function(e) {myGameArea.mouseX = e.clientX; myGameArea.mouseY = e.clientY;})
        window.addEventListener('keydown', function (e) {myGameArea.keys.add(e.keyCode);})
        window.addEventListener('keyup', function (e) {myGameArea.keys.delete(e.keyCode);})}, 
    clear : function(){
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
    
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
	this.sound.play();
    }
    this.stop = function(){
	this.sound.pause();
    }
}

function textBox(size, font, x, y) { // text like the score
    this.size = size;
    this.font = font;
    this.x = x;
    this.y = y;
    this.update = function(){
	ctx = myGameArea.context; //draw text on the screen
	ctx.font = this.size + " " + this.font;
	ctx.filStyle = "black";
	ctx.fillText(this.text, this.x, this.y);
    }
}

function bg(){
    this.x = 50;
    this.y = 160;
    this.width = 200;
    this.height = 160;
    this.gap = 20;
    this.slots = [];
    for (var i=0; i<3; i++){
	this.slots.push(new slot(this.x, this.y, this.width, this.height));
	    ctx = myGameArea.context;
	    ctx.lineWidth = 0.5;
	    ctx.strokeRect(this.x, this.y, this.width, this.height);
	    this.x+=this.width+this.gap;
    }    
    this.update = function(){
	/*this.x = 50;
	for (var i=0; i<3; i++){
	    this.slots.push(new slot(this.x, this.y, this.width, this.height));
	    ctx = myGameArea.context;
	    ctx.lineWidth = 0.5;
	    ctx.strokeRect(this.x, this.y, this.width, this.height);
	    this.x+=this.width+this.gap;
	    }*/    
	for (var j=0; j<this.slots.length; j++){
	    this.slots[j].update();
	    }
    }
}

function slot(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.occupied = 0;
    this.player = 0;
    this.cBoxes = [];
    
    this.acceptTile = function(pArray){
	this.occupied = 1;
	for(var i=0; i<pArray.length; i++){
	    this.cBoxes.push([this.x+(pArray[i].x*42), 
			      this.y+((pArray[i].y)*27), 42, 27, pArray[i].type
			      ]);

	}
    }
    this.removeTile = function(){
	this.cBoxes = [];
	this.occupied = 0;
    }

    this.update = function(){
	ctx = myGameArea.context;
	ctx.lineWidth = 0.5;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
	ctx.fillStyle = "blue";
	//	for (var i=0; i < this.cBoxes.length; i++){
	//   ctx.fillRect(this.cBoxes[i][0], this.cBoxes[i][1], this.cBoxes[i][2], this.cBoxes[i][3]);
	//}
	this.checkPlayer();
    }
    
    this.checkPlayer = function(){
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

function tile(map, x, y, scale){
    this.map = map;
    this.x = x;
    this.y = y;
    this.zIndex = 1;
    this.width = 25;
    this.height = 17;
    this.platforms = [];
    this.scale = scale;
    this.color = "lightblue";

    this.drawx = this.x;
    this.drawy = this.y;
    this.image = new Image();
    this.Twidth = 100;
    this.Theight = 80;
 
    for (var i = 0; i<map.length; i++){ // populate platform array
	for (var j = map[i].length-1; j >=0; j--){  
	    if (map[i][j] > 0){
		this.platforms.push(new platform(j,i,map[i][j]));
	    }
	}
    }    

    this.update = function(){   

	ctx.fillStyle =  this.color;
	ctx.fillRect(this.x, this.y, this.Twidth*this.scale, this.Theight*this.scale); // tile bg
	this.drawx = this.x;
	this.drawy = this.y;
	for (var i = 0; i < map.length; i++){
	    for (var j = 0; j < map[i].length; j++){
		if (map[i][j]){
		    this.image.src = "Tile" + map[i][j] + ".png";
		    //ctx.globalAlpha = 0.5;
		    ctx.drawImage(this.image, this.drawx, this.drawy, this.width*this.scale, this.height*this.scale);
		}
		this.drawx += this.width*this.scale-4*this.scale;
	    }
	    this.drawx = this.x;
	    this.drawy += this.height*this.scale-4*this.scale;
	}
    }
}

function platform(x, y, type) { // for things to collide with
    this.x = x;
    this.y = y;
    if (type < 5){
	this.type = "top";
    } else {
	this.type = "nottop";
    }
    
    this.update = function() {
    }
}

function player(width, height, image, x, y) { 
    this.image = new Image();
    this.image.src = image;    
    this.zIndex = 1000;
    this.width = width;
    this.height = height;
    this.changeX = 0;
    this.changeY = 0;    
    this.x = x;
    this.y = y;
    this.apples = 0;
    this.state = "idle";
    this.gravity = 0.08;
    this.gravitySpeed = 0;

    this.moveRight = function() {
	if (!this.collidingRight()){
	    this.changeX = 2;
	    this.state = "right";
	}
    }

    this.moveLeft = function() {
	if (!this.collidingLeft()){
	    this.changeX = -2;
	    this.state = "left";
	}
    }

    this.update = function() {
	
	if (this.colliding()){
	    if (this.gravitySpeed > 0){
		landSound.play();
	    }
	    this.gravitySpeed = 0;
	}
	else {
	    this.gravitySpeed += this.gravity;
	    if (this.changeY < 0){
		if (this.changeY + this.gravity > 0){
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
	if (this.state === "left"){
	    ctx.scale(-1,1);
	    ctx.drawImage(this.image, 
			  -this.x - this.width, 
			  this.y,
			  this.width, this.height);	
	} else {
	    ctx.scale(1,1);
	    ctx.drawImage(this.image, 
			  this.x, 
			  this.y,
			  this.width, this.height);
	}
	
	
	ctx.restore();   
	
    }

    this.collidingRight = function(){
	for (let slot of background.slots) {
	    for (let cBox of slot.cBoxes){ //look at every platform
		if (cBox[0] < this.x + this.width &&
		    cBox[0] > this.x &&
		    cBox[1] < this.y + this.height -10){
		    return 1;
		}
	    }
	}
	return 0;
    }

    this.collidingLeft = function(){
	for (let slot of background.slots) {
	    for (let cBox of slot.cBoxes){ //look at every platform
		if (cBox[0] + 45 > this.x &&
		    cBox[0] + 45 < this.x + this.width&&
		    cBox[1] < this.y + this.height -10){
		    return 1;
		}
	    }
	}
	return 0;
    }
    
    this.colliding = function(){
	
	for (let slot of background.slots) {
	    for (let cBox of slot.cBoxes){ //look at every platform
		//console.log(cBox, this.x, this.width);
		if (cBox[4] === "top" &&
		    cBox[1] < this.y + this.height &&
		    cBox[1] > this.y + this.height - 10 &&
		    cBox[0] < this.x + this.width &&
		    cBox[0] + 40 > this.x){ //check if it's touching player1 from below
		    return 1;
		}   
	    }
	}
	return 0; 
    }
}

function collectible(){
    
}

function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNumber += 1;
    background.update();
    //    if (myGameArea.frameNumber % 20 == 0) { // add a new raindrop every 20 frames
	//}
    
    player1.changeX = 0; // player controls
    
    if (myGameArea.keys.has(37)) { // left arrow pushed
	player1.moveLeft();
    }
    if (myGameArea.keys.has(39)) { // right arrow pushed
	player1.moveRight();
    }
    if (myGameArea.keys.has(32)) {// space bar pushed
	if (player1.colliding()){
	    jumpSound.play();
	    player1.changeY = -4;
	}
    }

    for (i = platforms.length-1; i >=0;  i -= 1) { //look at every platform
	platforms[i].update();      
	
    	/*	else if (platforms[i].y == myGameArea.height) { //remove if at bottom of screen
	    platforms.splice(i,1);    
	} else { //remove and add point if touching player1
	    platforms.splice(i,1); 
	    counter += 1;     
	}
	*/
    }
    for (j = 0; j < tiles.length; j++){
	if (myGameArea.mouseX && myGameArea.mouseY && myGameArea.mousedown && (pickup === -1 || pickup === j)){ // touching mouse

	    if (myGameArea.mouseX > tiles[j].x && 
		myGameArea.mouseX < tiles[j].x+120*tiles[j].scale 
		&& myGameArea.mouseY >tiles[j].y 
		&& myGameArea.mouseY < tiles[j].y+100*tiles[j].scale){
		
		
		if (pickup === -1){ // pick up a new tile
		    startTileX = tiles[j].x; // save coordinates for snapping back
		    startTileY = tiles[j].y;
		    startSlotNum = -1;
		    for (var i = 0; i < background.slots.length; i++){
			if (tiles[j].x === background.slots[i].x && tiles[j].y === background.slots[i].y){ // which slot did i pick up from
			    startSlotNum = i;
			}
		    }
		    //	
		    if (startSlotNum === -1 || background.slots[startSlotNum].player === 0){ // pickup ok
			if (startSlotNum != -1){
			    background.slots[startSlotNum].removeTile();
			}
			pickup = j;
			tiles[j].scale = 2; // set scale
			//tiles[j].color = "red";
		    }
			//}
		} 
		if (pickup === j){
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
	    
		if (tiles[j].y > 100){
		    tiles[j].y = 160;
		    tiles[j].scale = 2; //snap to grid


		    for (let slot of background.slots){
			if (tiles[j].x > slot.x - slot.width*0.5 && tiles[j].x < slot.x + slot.width){
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
}

