/*
  this.getWorldCoordinates = function(h, v) {
	
  	var x = this.hexagon_narrow_width * h;
  	var y = this.hexagon_height * (h*0.5 + v);

  	return new worldCoordinates(x,y);
	};
*/

/*
	this.getHexagonalCoordinates = function(x, y) {

	  var h = x / this.hexagon_narrow_width;
	  var v = y / this.hexagon_height - h * 0.5;

	  return new hexCoordinates(h, v);
	}
*/

/* 
// center of vertical axis = left most column
function drawHexGrid(ctx, numColumns) { // drawing a hexagone board

	ctx.beginPath();

	for (var i = 0; i < (numColumns - 1)/2 + 1; i++) {
		if (i < (numColumns - 1)/2) { // draw columns except a center column
			for (var j = 0; j < 5 + i; j++) { // the number of tiles in edges of a board: 5
				drawHex(ctx, new hexCoordinates(i, j));
				drawHex(ctx, new hexCoordinates((numColumns-1)-i,j));
			}
		} else { // draw the center column
			for (var j = 0; j < 5 + i; j++) {
				drawHex(ctx, new hexCoordinates(i, j)); 
			}			
		}
	}
	
	ctx.stroke();
}
*/


 
// center of vertical axis = left most column
/*
function drawHexGrid(ctx, numColumns, numTilesInBorder) { // drawing a hexagone board

	ctx.beginPath();

	for (var i = 0; i < Math.ceil(numColumns / 2); i++) {
		if (i < Math.floor(numColumns / 2)) { // draw columns except a center column
			for (var j = 0; j < numTilesInBorder + i; j++) { 
				drawHex(ctx, new hexCoordinates(i, j));
				drawHex(ctx, new hexCoordinates((numColumns-1)-i,j));
			}
		} else { // draw the center column
			for (var j = 0; j < numTilesInBorder + i; j++) {
				drawHex(ctx, new hexCoordinates(i, j)); 
			}			
		}
	}
	
	ctx.stroke();
}
*/


// store information of hexagon tiles
// left most column is the vertical axis of grid Coordinates
/*
var hexInfo = function(edgeLength, numColumns) { 
  this.l = edgeLength;
  this.horizontal = edgeLength * Math.sin(Math.PI/6);
  this.r = edgeLength * Math.cos(Math.PI/6);
  this.height = 2 * this.r;
  this.width = 2 * edgeLength;
  this.narrowWidth  = this.l + this.horizontal;

  this.getXYCoordinates = function(horizontal, vertical) {
  	if (horizontal >= Math.floor(numColumns / 2)) {	
  		return new xyCoordinates(this.narrowWidth * horizontal, 
																	this.height * (horizontal / 2 + vertical));
		} else {
  		return new xyCoordinates(this.narrowWidth * horizontal, 
															 this.height * (horizontal / 2 + vertical 
															 + Math.abs(horizontal - Math.floor(numColumns/2))));
		}
	};
}
*/


/*
// drawing a hexagon board, 
// center of vertical axis is a center column
var drawHexGrid = function(ctx, numColumns) { 
	ctx.beginPath();

	for (var i = -Math.floor(numColumns / 2); i <= 0; i++) {
		if (i != 0) { // draw columns except a center column
			for (var j = 0; j < numColumns + i; j++) { 
														// the number of tiles in the center column = the number of columns
				drawHex(ctx, new hexCoordinates(i, j));
				drawHex(ctx, new hexCoordinates(-i,j));
			}
		} else { // draw the center column
			for (var j = 0; j < numColumns + i; j++) { 
														// the number of tiles in the center column = the number of columns
				drawHex(ctx, new hexCoordinates(i, j)); 
			}			
		}
	}
	
	ctx.stroke();
}
*/

/*	
  this.getXYCoordinates = function(horizontal, vertical) {
  	if (horizontal >= 0) {	
  		return new xyCoordinates(this.narrowWidth * horizontal, 
																	this.height * (horizontal / 2 + vertical));
		} else {
  		return new xyCoordinates(this.narrowWidth * horizontal, 
															 this.height * (horizontal / 2 + vertical 
															 + Math.abs(horizontal)));
		}
	};
*/

/*
// drawing a hexagone board
// center of vertical axis = left most column
function drawHexGrid(ctx, numColumns) { 

	ctx.beginPath();

	for (var i = 0; i < Math.ceil(numColumns / 2); i++) {
		if (i < Math.floor(numColumns / 2)) { // draw columns except a center column
			for (var j = 0; j < Math.ceil(numColumns / 2) + i; j++) { 
													// Math.ceil(numColumns / 2) = the number of tiles in border lines
				drawHex(ctx, new hexCoordinates(i, j));
				drawHex(ctx, new hexCoordinates((numColumns-1)-i,j));
			}
		} else { // draw the center column
			for (var j = 0; j < Math.ceil(numColumns / 2) + i; j++) {
				drawHex(ctx, new hexCoordinates(i, j)); 
			}			
		}
	}
	
	ctx.stroke();
}
*/

/*
var rAF = window.webkitRequestAnimationFrame;
var cAF = window.webkitCancelRequestAnimatinoFrame;
var fps = 60;
var interval = 1000 / fps;
var xSpeed;
var ySpeed;
var aniTime;
var from;
var to;
var lastTime;
var timeLimit;
var path; // set up path in searchPath() before calling drawPath();
var orbColor; // set up in searchPath() before calling drawPath();
var startTime;  // set up start time in searchPath() before calling drawPath()!
var dt = 0;

var drawOrb = function(center) {
  ctx.beginPath();
	ctx.arc(center.x, center.y, HexConstant.ORB_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = orbColor;
	ctx.fill();
	ctx.stroke();
}

function drawPath(now) {

	if (from !== undefined) { // initialize condition everytime
		xSpeed = Grid.COL_WIDTH * (path.length - 1) / interval;
		ySpeed = Grid.ROW_HEIGHT * (path.length - 1) / interval;
		timeLimit = 500 * (path.length - 1);
		lastTime = null;
		from = path.pop();
		to = path.pop();		
	}

	if (from.x === to.x && from.y === to.y) {
		if (path.length > 0) {
			from = to;
			to = path.pop();
		} else if (path.length === 0) {
			cAF(rAF); // stop this loop
		}
		
	}

	switch (from.isAdjacent()) {
		case "top":
			if (from.y > to.y) {
				from.y -= ySpeed * dt;
			}	
			break;
		case "rightTop":
			if (from.x < to.x && from.y > to.y) {
				from.x += xSpeed * dt;
				from.y -= ySpeed * dt;
			}
			break;
		case "rightBottom":
			if (from.x < to.x && from.y < to.y) {
				from.x += xSpeed * dt;
				from.y += ySpeed * dt;	
			}
			break;
		case "bottom":
			if (from.y < to.y) {
				from.y += ySpeed * dt;
			}
			break;
		case "leftBottom":
			if (from.x > to.col && from.y < to.y) {
				from.x -= xSpeed * dt;
				from.y += ySpeed * dt;
			}
			break;
		case "leftTop":
			if (from.x > to.x && from.y > to.y) {
				from.x -= xSpeed * dt;
				from.y -= ySpeed * dt;
			} 
			break;		
		default:
	}
	drawOrb(from);

  aniTime += dt;  
  if (aniTime < timeLimit) {
    requestAnimationFrame(drawPath);
		dt = new Date().getTime() - lastTime;
		lastTime = now();
  } else {
		from = undefined;
		cAF(raF);
	}
}
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var rAF = window.webkitRequestAnimationFrame;
var cAF = window.webkitCancelRequestAnimatinoFrame;
var interval = 1000 / 60; // sec / fps
var xSpeed; 
var ySpeed;
var aniTime; 
var from; // pixel coordinate of previous orb's position 
var current; // pixel coordinate of current orb's position
var to; // pixel coordinate of next orb's position
var lastTime; 
var timeLimit; // time limit for path displaying 
var route; // set up path in searchPath() before calling drawPath();
var orbColor; // set up in searchPath() before calling drawPath();
var dt = 0;

getGridPos = function(pixel) {
  return new GridCoordinate(Math.floor((pixel.x - Grid.X_OFFSET) / 
														Grid.COL_WIDTH) - Math.floor(Grid.NUM_COLUMNS/2), 
														Math.floor(pixel.y / Grid.ROW_HEIGHT - 
														(game.board.boardSize * 2 - 2)));
}

var update = function () {  
//	console.log(lastTime);
  if (aniTime < timeLimit) {
		now = new Date().getTime(); 
//		console.log("now: " + now);
//		console.log("before dt: " + dt);
		if (lastTime === null) {
			dt = now - now;
		} else {
			dt = now - lastTime;
		}
//		console.log("after dt: " + dt);
//		console.log("lastTime: " + lastTime);
		lastTime = now;
//		console.log("after lastTime: " + lastTime);
  	aniTime += dt;
  } else {
		from = undefined;
		//cAF(rAF);
	}
}

var findNextFramePos = function () {
	
	console.log("current: ");
	console.log(getGridPos(current));
/*	console.log("to: "); 
	console.log(to.gridCoordinate);
	console.log("dt: ");
	console.log(dt);
	console.log(ySpeed);
	console.log(Grid.ROW_HEIGHT);
  console.log(Grid.COL_WIDTH);
	*/
	if (from === undefined) {
		return;
	}
/*
	console.log("from: ");
	console.log(from);
	console.log("to: ");
	console.log(to);
*/
	switch (from.isAdjacent(to)) { 
		case "top":
			if (current.y > to.center.y) {
				//console.log("I'm in top");
				current.y -= ySpeed * dt;
			}	
			break;
		case "rightTop":
			if (current.x < to.center.x && current.y > to.center.y) {
				current.x += xSpeed * dt;
				current.y -= ySpeed * dt;
			}
			break;
		case "rightBottom":
			if (current.x < to.center.x && current.y < to.center.y) {
				current.x += xSpeed * dt;
				current.y += ySpeed * dt;	
			}
			break;
		case "bottom":
			if (current.y < to.center.y) {
				console.log("I'm in bottom ", ySpeed * dt);
				current.y += ySpeed * dt;
			}
			break;
		case "leftBottom":
			if (current.x > to.center.col && current.y < to.center.y) {
				current.x -= xSpeed * dt;
				current.y += ySpeed * dt;
			}
			break;
		case "leftTop":
			if (current.x > to.center.x && current.y > to.center.y) {
				current.x -= xSpeed * dt;
				current.y -= ySpeed * dt;
			} 
			break;		
		default:
	}
	
	console.log("updated current: ");
	console.log(getGridPos(current));
	
}

var drawOrb = function(center) {
	if (from === undefined) {
		return;
	}
  ctx.beginPath();
	ctx.arc(center.x, center.y, HexConstant.ORB_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = orbColor;
	ctx.fill();
	ctx.stroke();
}

function drawPath(now) {

	if (route.length > 0) {
		rAF(drawPath);
	}

	if (from === undefined) { // initialize condition everytime
		xSpeed = Grid.COL_WIDTH * (route.length - 1) / interval;
		ySpeed = 2 * Grid.ROW_HEIGHT * (route.length - 1) / interval;
		timeLimit = 500 * (route.length);
		lastTime = null;
		aniTime = 0;
		from = route.pop(); // start position
		current= new Pixel(from.center.x, from.center.y);
		console.log(getGridPos(current));
		orbColor = from.orb;
		to = route.pop();	
	}
	var i = 0;
//	console.log(to);
	if (current.x === to.center.x && current.y === to.center.y) { // error --> to : undefined  why? 
		console.log(i);											// ??? possible error: what happens if from pass over to
		if (route.length > 0) {
			from = to;
			to = route.pop();
			console.log("from");
			console.log(from);
			console.log("to");
			console.log(to);
		} 
	}

	update();
	findNextFramePos();
	drawOrb(from);  
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////20130117
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var rAF = window.webkitRequestAnimationFrame;
var cAF = window.webkitCancelRequestAnimatinoFrame;
var interval; 
var xSpeed; 
var ySpeed;
var aniTime; 
var from; // pixel coordinate of previous orb's position 
var current; // pixel coordinate of current orb's position
var to; // pixel coordinate of next orb's position
var lastTime; 
var timeLimit; // time limit for path displaying 
var route; // set up path in searchPath() before calling drawPath();
var routeDistance;
var orbColor; // set up in searchPath() before calling drawPath();
var dt;

// temporary function for testing
getGridPos = function(pixel) {
  return new GridCoordinate((pixel.x - Grid.X_OFFSET) / 
														Grid.COL_WIDTH - Grid.NUM_COLUMNS/2, 
														pixel.y / Grid.ROW_HEIGHT - 
														(game.board.boardSize * 2 - 2));
}

var drawGame = function() {
  game.board.draw(); 
  drawNewOrbs();
	game.score.displayScore();
}

var findNextFramePos = function () {
	if (from === undefined) {
		return;
	}
	switch (from.isAdjacent(to)) { 
		case "top":
			if (current.y > to.center.y) {
				current.y -= ySpeed * dt;
			} 
			if (current.y <= to.center.y) {
				current = from.center;
			}	
			break;
		case "rightTop":
			if (current.x < to.center.x && current.y > to.center.y) {
				current.x += xSpeed * dt;
				current.y -= ySpeed * dt;
			} 
			if (current.x >= to.center.x) {
				current.x = from.center.x;
			}
			if (current.y <= to.center.y) {
				current.y = from.center.y;
			}
			break;
		case "rightBottom":
			if (current.x < to.center.x && current.y < to.center.y) {
				current.x += xSpeed * dt;
				current.y += ySpeed * dt;	
			} 
			if (current.x >= to.center.x) {
				current.x = from.center.x;
			}
			if (current.y >= to.center.y) {
				current.y = from.center.y;
			}
			break;
		case "bottom":
			if (current.y < to.center.y) {
				current.y += ySpeed * dt;
			} 
			if (current.y >= to.center.y) {
				current = from.center;
			}
			break;
		case "leftBottom":
			if (current.x > to.center.col && current.y < to.center.y) {
				current.x -= xSpeed * dt;
				current.y += ySpeed * dt;
			} 
			if (current.x <= to.center.x) {
				current.x = from.center.x;
			}
			if (current.y >= to.center.y) {
				current.y = from.center.y;
			}
			break;
		case "leftTop":
			if (current.x > to.center.x && current.y > to.center.y) {
				current.x -= xSpeed * dt;
				current.y -= ySpeed * dt;
			} 
			if (current.x <= to.center.x) {
				current.x = from.center.x;
			} 
			if (current.y <= to.center.y) {
				current.y = from.center.y;
			}
			break;		
		default:
	}
}


var update = function () {  
  if (aniTime < timeLimit) {
		now = new Date().getTime(); 
		if (lastTime === null) {
			dt = now - now;
		} else {
			dt = now - lastTime;
		}
		lastTime = now;
  	aniTime += dt;
  } else {
		from = undefined;
	}
}


var drawOrb = function(center) {

  ctx.beginPath();
	ctx.arc(center.x, center.y, HexConstant.ORB_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = orbColor;
	ctx.fill();
	ctx.stroke();

}

function drawPath(now) {
 	ctx.save();
	if (route.length > 0) {
		rAF(drawPath);
	}

	if (from === undefined) { // initialize condition everytime
		console.log("I'm not intended to occur more than once!");
		routeDistance = route.length;
		timeLimit = 1000; // 1 seconds
		lastTime = null;
		aniTime = 0;
		from = route.pop(); // start position
		current= new Pixel(from.center.x, from.center.y);
		orbColor = from.orb;
		to = route.pop();
		xSpeed = Math.abs(to.center.x - from.center.x) / (timeLimit / routeDistance);
		ySpeed = Math.abs(to.center.y - from.center.y) / (timeLimit / routeDistance);
		console.log(routeDistance);
		animating = true;
	}

	if (to !== undefined) {
		if (current.x === to.center.x && current.y === to.center.y) { // error --> to : undefined  why?
			if (route.length > 0) {
				from = to;
				to = route.pop();
				animating = true;
			} 
		} 
	} else {
		animating = false;
	}
	
		update();
		findNextFramePos();
		//drawGame();
		drawOrb(current);  
	 if (animating === false) {
		ctx.restore();
console.log("am I working?");
		rAF(drawGame);
	}
}

rAF(drawGame);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////20130118


var animating = false;
var current;
var from = null;
var to;
var aniTime;
var timeLimit = 1000;
var orbColor;
var route = [];
var dist;
// temporary function for testing
getGridPos = function(pixel) {
  return new GridCoordinate((pixel.x - Grid.X_OFFSET) / 
														Grid.COL_WIDTH - Grid.NUM_COLUMNS/2, 
														pixel.y / Grid.ROW_HEIGHT - 
														(game.board.boardSize * 2 - 2));
}

var animate = function () {
	window.webkitRequestAnimationFrame(animate);
update(dt)
	draw();
}

var draw = function () {
	if (animating === false) {
		game.board.draw();
		drawNewOrbs();
		game.score.displayScore();
		console.log("regular drawing");	
	}	else {
		console.log("path drawing");
		update();
		drawOrb(current);
	}
}

var update = function () {  
  if (aniTime < timeLimit) {
		var now = new Date().getTime(); 
		if (lastTime === null) {
			dt = 0;
		} else {
			dt = now - lastTime;
		}
		lastTime = now;
  	aniTime += dt;
  } else {
		from = null;
		animating = false;
	}
	console.log("dt: ", dt);
}

var drawOrb = function(center) {
	move();
  ctx.beginPath();
	ctx.arc(center.x, center.y, HexConstant.ORB_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = '#FFFFFF';
	ctx.fill();
	ctx.stroke();

}

var move = function () {
	current = new Pixel (route[0].center.x, route[0].center.y);
	dist = (aniTime / timeLimit) * (route.length - 1);
	from = Math.floor(dist);
	to = from + 1;
	if (to < route.length) {
		findNextFramePos();
	} else {
		animating = false;
		lastTime = null;
	}
}

var findNextFramePos = function () {
	var rate = dist - from;
	if (from > 0) {
		current.x = route[from].center.x * (rate) + route[to].center.x * (1 - rate);
		current.y = route[from].center.y * (rate) + route[to].center.y * (1 - rate);
	}
}

animate();
/*
		if (current === to.center) {
			if (route.length > 0) {
				from = to;
				to = route.pop();
			} 	
			update();
			findNextFramePos();
			drawOrb(current);
		}
		if (route.length === 0 && current === to.center) {
			animating = false;
			from = null;
		}
*/


/*
		if (route.length > 0) {
			if (from === null) {
console.log("start path");
				lastTime = null;
				aniTime = 0;
				from = route.pop();
				current = new Pixel (from.center.x, from.center.y);	
				to = route.pop();
				xSpeed = Math.abs(to.center.x - from.center.x) / 60;
				ySpeed = Math.abs(to.center.y - from.center.y) / 60;	
			}	else {
console.log("next tile!");
				if (current.x === to.center.x && current.y === to.center.y) {
console.log("pop!");
					from = to;
					to = route.pop();
				}
				update();
				findNextFramePos();
				drawOrb(current);
			}	
		} else { 
console.log("alomost finish!");
			if (current !== to.center) {
			//if (current.x === to.center.x && current.y === to.center.y) {
				animating = false;
				from = null;		
			} else {
				update();
				findNextFramePos();
				drawOrb(current);
			}
		}
	}
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////20130113
