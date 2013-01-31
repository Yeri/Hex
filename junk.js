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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////// Setup the main game loop ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var animating = "regular";
var from = null;
var to;
var aniTime;
var timeLimit;
var pathAnimOrb;
var lastTime = null;
var dt;

var runAnim = function() {
  window.webkitRequestAnimationFrame(runAnim);
  update();
	draw();
}

var draw = function() {
  game.board.draw();
  drawNewOrbs();
	game.score.displayScore();
}

var update = function() {	

	if (lastTime === null) {  //first time update is called
		dt = 0;
	} else {
	  var now = new Date().getTime(); 
		dt = now - lastTime;
	}
	lastTime = now;
	aniTime += dt;

	switch (animating) {
		case "path":  
		  if(aniTime <= timeLimit) {  //check if you are still displaying path
		  	pathAnimOrb.setCenter(getPosForNextFrame(aniTime));
		  } else {
		    endPathAnim();
			}
			break;
		case "remove":
			if(aniTime <= timeLimit) { //check if you are still displaying removing orbs
			  //call the function that shrinks the orbs
			} else {
			  endRemoveAnim(); 
			}
			break;
		case "newOrb": 
			// all the function to give effect when place new orbs on the board
			break;
		default:
	}
}

var startPathAnim = function(orb, route) {
	animating = "path";
	aniTime = 0;
	timeLimit = (route.length - 1) * 300;
	pathAnimOrb = orb;
}

var endPathAnim = function() {
  from = null;
  game.destinationHex.orb.center = game.destinationHex.center;
  pathAnimOrb = null;
  var toBeRemoved = removeOrbs(game.destinationHex);
  if(toBeRemoved.length > 0) {
		animating = "remove";
    startRemoveAnim(toBeRemoved, scoreToAdd);
  } else {
		animating = "newOrb";
    newOrbs();
  }
}

var getPosForNextFrame = function(aniTime) {
	var curr = new Pixel(null, null);
	var dist = (aniTime / timeLimit) * (route.length - 1);

	from = Math.floor(dist);  //hex index for current starting position
	to = from + 1;
	if (to < route.length) {
		var rate = dist - from;
	  if (from >= 0) {
		  curr.x = route[from].center.x * (1 - rate) + route[to].center.x * rate;
		  curr.y = route[from].center.y * (1 - rate) + route[to].center.y * rate;
	  }
	}
	return curr;
}

var startRemoveAnim = function(orbs, score) {
  animating = "remove";
	aniTime = 0;
	timeLimit = 1000;
  removeAnimOrbs = orbs;
  removeScore = score
}

var endRemoveAnim = function() {
  animating = "regular";
  deleteRemovedOrbs(removeAnimOrbs);  
}

runAnim();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////20130131
#slider {
	text-align: center;
	position: relative;
	left: ;
	bottom: 100%;
}

label, a {
	color: teal;
	cursor: pointer;
	text-decoration: none;
}

label:hover, a:hover {
	color: #000 !important;
}

/** { -webkit-box-sizing: border-box;}*/

label, #active, img { -webkit-user-select:none; }
.catch { display: block; height: 0; overflow: hidden; }

#slider {
	margin: 0 auto;
}

/* NEW EXPERIMENT */
/* Slider Setup */

input {
	display: none;
}

#localRanking:checked ~ #slides .inner { margin-left:0; }
#globalRanking:checked ~ #slides .inner { margin-left:-100%; }
#instruction:checked ~ #slides .inner { margin-left:200%; }
#setting:checked ~ #slides .inner { margin-left:-300%; }

#overflow {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

article img {
	width: 100%;
}

#slides .inner {
	width: 100%;
	height: 100%;
	line-height: 0;
}

#slides article {
	width: 20%;
	float: left;
}

/* Slider Styling */

/* Control Setup */

#controls {
	margin: -25% 0 0 0;
	width: 100%;
	height: 50px;
	position: relative;
	top: -600px;
}

#controls label { 
	display: none;
	width: 50px;
	height: 50px;
	opacity: 0.3;
}

#active {
	margin: 23% 0 0;
	text-align: center;
	position: relative;
	top: -700px;
	left: 33.25%;
}

#active label {
	-webkit-border-radius: 5px;
	display: inline-block;
	width: 10px;
	height: 10px;
	background: #bbb;
}

#active label:hover {
	background: #ccc;
	border-color: #777 !important;
}

#controls label:hover {
	opacity: 0.8;
}

#localRanking:checked ~ #controls label:nth-child(2), 
#globalRanking:checked ~ #controls label:nth-child(3), 
#instruction:checked ~ #controls label:nth-child(4), 
#setting:checked ~ #controls label:nth-child(1) {
	background: url('next.png') no-repeat;
	float: right;
	margin: 0 -70px 0 0;
	display: block;
}


#localRanking:checked ~ #controls label:nth-child(4),
#globalRanking:checked ~ #controls label:nth-child(1),
#instruction:checked ~ #controls label:nth-child(2),
#setting:checked ~ #controls label:nth-child(3) {
	background: url('prev.png') no-repeat;
	float: left;
	margin: 0 0 0 -70px;
	display: block;
}

#localRanking:checked ~ #active label:nth-child(1),
#globalRanking:checked ~ #active label:nth-child(2),
#instruction:checked ~ #active label:nth-child(3),
#setting:checked ~ #active label:nth-child(4) {
	background: #333;
	border-color: #333 !important;
}

/* Info Box */

.info {
	line-height: 20px;
	margin: 0 0 -150%;
	position: absolute;
	font-style: italic;
	padding: 30px 30px;
	opacity: 0;
	color: #000;
	text-align: left;
}

.info h3 {
	color: #333;
	margin: 0 0 5px;
	font-weight: normal;
	font-size: 22px;
	font-style: normal;
}

/* Slider Styling */

#slides {
	margin: 45px 0 0;
	-webkit-border-radius: 5px;
	box-shadow: 1px 1px 4px #666;
	position: relative;
	top: -700px;
	left: 67.5%/*700px*/;
	padding: 1%;
	width: 30%;
	height: 50%; /* why % doesn't work??*/
	background: -webkit-linear-gradient(top,  rgba(252,255,244,1) 0%,rgba(219,218,201,1) 100%);
}


/* Animation */

#slides .inner {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 800ms cubic-bezier(0.770, 0.000, 0.175, 1.000); 
	-webkit-transition-timing-function: cubic-bezier(0.770, 0.000, 0.175, 1.000); 
}

#slider {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 0.5s ease-out;
}

#controls label{
	-webkit-transform: translateZ(0);
	-webkit-transition: opacity 0.2s ease-out;
}

#localRanking:checked ~ #slides article:nth-child(1) .info,
#globalRanking:checked ~ #slides article:nth-child(2) .info,
#instruction:checked ~ #slides article:nth-child(3) .info,
#setting:checked ~ #slides article:nth-child(4) .info {
	opacity: 1;
	-webkit-transition: all 1s ease-out 0.6s;
}

.info, #controls, #slides, #active, #active label, .info h3 {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 0.5s ease-out;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	<article id = slider>
		<!-- slider setup -->
		<input checked type = radio name = slider id = localRanking selected = "false"/>
		<input type = radio name = slider id = globalRanking selected = "false"/>
		<input type = radio name = slider id = instruction selected = "false"/>
		<input type = radio name = slider id = setting selected = "false"/>

		<!-- the slider -->
		<div id = slides>
			<div id = overflow>
				<div class = inner>
					<article>
						<div class = info>
							<h3>Local High Score</h3>
							<img src = "help.png" /> 					
						</div>
					</article>
					<article>
						<div class = info>
							<h3>Global High Score</h3>
							<img src = "restart.png" />
						</div>
					</article>
					<article>
						<div id = info>
							<h3>Instruction</h3>
							<img src = "instruction.png" />
						</div>
					</article>
					<article>
						<div class = info>
							<h3>Setting</h3>
							<img src = "setting.png" />
						</div>
					</article>
				</div> <!-- inner -->
			</div> <!-- overflow -->
		</div> <!-- slides -->
	
		<!-- controls and active slide display -->
		<div id = controls>
			<label for = localRanking></label>
			<label for = globalRanking></label>
			<label for = instruction></label>
			<label for = setting></label>	
		</div>
	
		<div id = active>
			<label for = localRanking></label>
			<label for = globalRanking></label>
			<label for = instruction></label>
			<label for = setting></label>
		</div>

	</article>
