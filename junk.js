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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	<article id = slider>
		<!-- menu setup -->
		<input checked type = radio name = slider id = localRanking />
		<input type = radio name = slider id = globalRanking />
		<input type = radio name = slider id = instruction />
		<input type = radio name = slider id = setting />

		<!-- the slider -->
		<div id = slides>
			<div id = overflow>
				<div class = inner>
					<article>
						<div class = info>
							<h3>Local High Score</h3>
							<p> A: 1234 </p>
							<p> A: 1234 </p>
							<p> A: 1234 </p>
						</div>	
					</article>
					<article>
						<div class = info>
							<h3>Global High Score</h3>
							<p> B: 12345 </p>
							<p> B: 12345 </p>
							<p> B: 12345 </p>
						</div>												
					</article>
					<article>
						<div class = info>
							<h3>How to play</h3>
							<p>
							To move orb, click the orb first, then click the destination hexagon 
							which has a path from the selected orb. After each turn you take, 
							if you didn't match a line of orbs this turn, 3 new orbs that are 
							showing in the top left hand corner will be randomly placed around the board.
							<br><br>
							Your goal is to create lines of minimum 5 orbs of the same colour, 
							which will make those orbs disappear, thus clearing space on the board. 
							You score points for each line of orbs you match, and bonus points
						 	are awarded for making lines longer than 5, or matching more than one line at once.
							<br>
							<h4>Speacial Orbs</h4>
							<ul>
								<li>Wilds (White orbs with a 'W') <br> 
								These can match with any colour of orb.<br>
								</li>								
								<li>Exploders (Orbs with an 'E') <br> 
								These orbs are activated by using them in a line of matching coloured orbs. 
								When the line is matched, all the orbs neighboring the Exploder 
								will disappear.<br>
								</li>								
								<li>Destroyers (Orbs with a 'D') <br> 
								These orbs are activated by using them in a line of matching coloured orbs. 
								When the line is matched, all other orbs on the board that are 
								the same colour as the Destroyer will disappear.
								</li>
							</ul>
							</p>
						</div>						
					</article>
					<article>
						<div class = info>
							<h3>Setting</h3>
							<br>
								<p>Difficulty:</p> 
								<p>Easy <input type="Range" min="0" max="2" id="difficulty"/>  Hard</p>
								<p>Board Size: <input type="number" min="5" max="9" step="2" value="5" id="size"></p> 
								<p>Minimum Number of Orbs to Remove:</p>
								<p><input type="number" name="minOrbsToRemove" min="3" value="5" id="minRemove"/> </p>
								<!-- set max = board size in js-->							
								<p>Number of Orb's Color:</p> 
								<p><input type="number" name="NumColors" min="5" max="10" value="5" id="numColor"/></p>
								<p>Display Next Orbs: </p>
								<p>On <input type="Range" min ="0" max ="1" value ="0" id ="nextOrb"/> Off </p>
								<p>Animation:</p>
								<p>On <input type="Range" min="0" max="1" value="0" id="aniEffect" /> On </p>
								<br><br>
							<input type="button" value="New Game" id="restart" />
						</div>											
					</article>
				</div> <!-- inner -->
			</div> <!-- overflow -->
		</div> <!-- slides -->
	
		<!-- active slide display -->
		<div id = active>
			<label for = localRanking><img src = "ranking.png"></label>
			<label for = globalRanking><img src = "worldRanking.png"></label>
			<label for = instruction><img src = "instruction.png"></label>
			<label for = setting><img src = "setting.png"></label>
			<!--<label for = restart><img src = "restart.png"></label>-->
		</div>
	</article>
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#slider {
	text-align: center;
	position: relative;
	top: -700px;
	margin: 0 auto;
	width: 300px;
	height: 700px;
	left: 650px;
}

#slides {
	position: relative;
	top: 5%;
	left: -330px;
	margin: 45px 0 0;
	padding: 1%;
	width: 100%;
	height: 80%; 
	background: -webkit-linear-gradient(top,  rgba(252,255,244,1) 0%,rgba(219,218,201,1) 100%);
	-webkit-border-radius: 5px;
	-webkit-box-shadow: 1px 1px 4px #666;
}

#slides .inner {
	width: 100%;
	height: 100%;
	line-height: 0;
}

#slides article {
	width: 100%;
	height: 100%;
	position: absolute;
	float: left;
}

#overflow {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.info {
	line-height: 20px;
	margin: 0 0 -150%;
	position: absolute;
	padding: 30px 30px;
	opacity: 0;
	color: #000;
	text-align: left;
	overflow: auto;
}

div {
	overflow: auto;
}
 
.info h3 {
	color: #333;
	margin: 0 0 5px;
	font-size: 22px;
	font-style: normal;
}

.info p {
	color: #333;
	margin: 0 0 5px 5px;
	font-weight: normal;
	font-size: 16px;
	font-style: normal;
}


#active {
	position: relative;
	top: 0%;
	left: -110%;
	margin: 23% 0 0;
	width: 100%;
	height: 10%;
	text-align: center;
}

#active label {
	width: 50px;
	height: 50px;
	display: inline-block;
	background: #bbb;
	-webkit-border-radius: 5px;
}

#active label:hover {
	background: #ccc;
	border-color: #777;
}

label, a {
	color: teal;
	cursor: pointer;
	text-decoration: none;
}

label:hover, a:hover {
	color: #000;
}

label, #active, img { -webkit-user-select:none; }
.catch { display: block; height: 0; overflow: hidden; }

#localRanking, #globalRanking, #instruction, #setting {
	display: none;
}

article img {
	width: 100%;
}

input[type="range"] {
    -webkit-appearance: none;
    background-color: black;
    height: 2px;
}
 
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    position: relative;
    top: -1px;
    z-index: 1;
    width: 11px;
    height: 11px;
 
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    border-radius: 40px;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ebf1f6), color-stop(50%,#abd3ee), color-stop(51%,#89c3eb), color-stop(100%,#d5ebfb));
}

#localRanking:checked ~ #active label:nth-child(1),
#globalRanking:checked ~ #active label:nth-child(2),
#instruction:checked ~ #active label:nth-child(3),
#setting:checked ~ #active label:nth-child(4) {
	background: #333;
	border-color: #333;
}


/* Animation */

#slider {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 0.5s ease-out;
}

#slides .inner {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 800ms cubic-bezier(0.770, 0.000, 0.175, 1.000); 
	-webkit-transition-timing-function: cubic-bezier(0.770, 0.000, 0.175, 1.000); 
}

#localRanking:checked ~ #slides article:nth-child(1) .info,
#globalRanking:checked ~ #slides article:nth-child(2) .info,
#instruction:checked ~ #slides article:nth-child(3) .info,
#setting:checked ~ #slides article:nth-child(4) .info {
	opacity: 1;
	-webkit-transition: all 1s ease-out 0.6s;
}

.info, #slides, #active, #active label, .info h3 {
	-webkit-transform: translateZ(0);
	-webkit-transition: all 0.5s ease-out;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* document.body.addEventListener = function ("contextmenu", function() {return false;}); */ 
document.getElementById("difficulty").addEventListener('click', newGame, false); 
document.getElementById("size").addEventListener('click', newGame, false);
document.getElementById("minRemove").addEventListener('click', newGame, false);
document.getElementById("numColor").addEventListener('click', newGame, false);
document.getElementById("nextOrb").addEventListener('click', newGame, false);
document.getElementById("aniEffect").addEventListener('click', newGame, false);
document.getElementById("restart").addEventListener('click', newGame, false);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var removeByDestroyer = [];
var removeByExploder = [];

var checkOnLine = function (toBeRemove, hex) {
	for (var i in toBeRemove) {
		if (toBeRemove[i].center.x === hex.center.x && toBeRemove[i].center.y === hex.center.y) {
			return true;
		}
	}
	return false;	
}

var handleWild = function(originalHex) {
  var nextHex, current, totalLineLength, curr;
	var directionNames = ['up',
	                      'down',
	                      'leftUp',
	                      'rightDown',
	                      'leftDown',
	                      'rightUp'
	                     ];
	var directions = [[], [], [], [], [], []];
	var colourToMatch = [];
	var toBeRemoved = [];
	var adjacents = null;
	scoreToAdd = [];
	
	for(var i = 0; i < 6; i++) { //for each direction
	  //get the nextHex - returns false if you run off the board
	  nextHex = getNext(directionNames[i], originalHex);
	  while(nextHex) { //check if you ran off the board, or if there was no orb
	    //if the next hex is wild, just push it and continue looking for a coloured hex
      if(nextHex.orb.type === 'Wild') {
        directions[i].push(nextHex);
        //returns false if you run off the board & if the next square doesn't have an orb
        nextHex = getNext(directionNames[i], nextHex);
      } else {
        break;
      }
    }
	  //if you found a hex that wasn't wild, set the colour to match 
	  //for this direction to be the colour of that orb
	  if(nextHex) {
	    colourToMatch[i] = nextHex.orb.colour;
	    directions[i].push(nextHex); //push it onto the chain aswell
	    nextHex = getNext(directionNames[i], nextHex); //get the next hex
	    while(nextHex && checkColourMatch(colourToMatch[i], nextHex.orb.colour)) {
	    //continue checking orbs in this direction until you run off the board,
	    //you run into an empty hex, or the next orb doesn't match.
	      directions[i].push(nextHex);  //push each matching orb
	      nextHex = getNext(directionNames[i], nextHex); //get the next hex
	    }
	  } else { 
	    if (directions[i].length > 0) {
	       //if they were all wild and you ran off the board or came to an empty
	       //spot you have a whole chain of wilds
	      colourToMatch[i] = 'Wild';
	    } else {
	      //if you didn't find any hexes, there is no colour to match
	      colourToMatch[i] = null;
	    }
	  }
	}
	
/*At this point you have a stack of matching orbs for each direction, 
  not including the original hex. The stacks can include wilds, as wilds match.
  A stack may be all wilds. Each stack also has a variable set to the colour of
  the stack - a stack of entirely wilds will be set to 'wild'.
  If there were no hexes in any direction,
  the colour to match for that direciton will be set to null */
	
  for(var i = 0; i < 6; i += 2) {
	  if(checkColourMatch(colourToMatch[i], colourToMatch[i + 1])) {
	    totalLineLength = directions[i].length + directions[i + 1].length + 1;
	    if(totalLineLength >= game.minRemoveOrb) {
	      scoreToAdd.push(totalLineLength);//score based on totalLineLength
	      for(var j in directions[i]) {
	        toBeRemoved.push(directions[i][j]);
	      }
	      for(var j in directions[i + 1]) {
	        toBeRemoved.push(directions[i + 1][j]);
	      }
	    }	  
	  } else {
	    for(var j = i; j < i + 2; j++) {
	      totalLineLength = directions[j].length + 1;
        if(totalLineLength >= game.minRemoveOrb) {
          scoreToAdd.push(totalLineLength);
          for(var k in directions[j]) {
            toBeRemoved.push(directions[j][k]);
          }
        }
	    }
	  } 
	}
	
  for(var i in toBeRemoved) {
    if(toBeRemoved[i].orb.type === 'Destroyer') {
      for(var j in game.board.hexes) {
        if(game.board.hexes[j].orb !== null) {
          if(game.board.hexes[j].orb.colour === toBeRemoved[i].orb.colour && 
!checkOnLine(toBeRemoved, game.board.hexes[j])) {
            //toBeRemoved.push(game.board.hexes[j]);
						removeByDestroyer.push(game.board.hexes[j]);						
						game.board.hexes[j].orb.removeBy = 'Destroyer';
          }
        }
      }
    } else if(toBeRemoved[i].orb.type === 'Exploder') {
      adjacents = toBeRemoved[i].getAdjacentHexes();
      for(var j in adjacents) {
        if(adjacents[j].orb !== null && !checkOnLine(toBeRemoved, adjacents[j])) {
          //toBeRemoved.push(adjacents[j]);
						removeByExploder.push(adjacents[j]);
						adjacents[j].orb.removeBy = 'Exploder';
        }
      }
    }	
  }
  
  if(toBeRemoved.length > 0) {
    toBeRemoved.push(originalHex);
  }
  return toBeRemoved;
}


var handleColoured = function(originalHex) {
  var nextHex, current, totalLineLength, curr, isRemoved = false;
	var directionNames = ['up',
	                      'down',
	                      'leftUp',
	                      'rightDown',
	                      'leftDown',
	                      'rightUp'
	                     ];
	var directions = [[], [], [], [], [], []];
	var toBeRemoved = [];
	var adjacents = null;
	scoreToAdd = [];
	
	for(var i = 0; i < 6; i++) { //for each direction
	  //get the nextHex - returns false if you run off the board
	  nextHex = getNext(directionNames[i], originalHex);
    while(nextHex && checkOrbMatch(nextHex, originalHex)) {
      //continue checking orbs in this direction until you run off the board,
      //you run into an empty hex, or the next orb doesn't match.
      directions[i].push(nextHex);  //push each matching orb
      nextHex = getNext(directionNames[i], nextHex); //get the next hex
	  }
	}
	
/*At this point you have a stack of matching orbs for each direction, 
  not including the original hex. The stacks can include wilds, as wilds match.
  A stack may be all wilds.*/
	
  for(var i = 0; i < 6; i += 2) {
    totalLineLength = directions[i].length + directions[i + 1].length + 1;
    if(totalLineLength >= game.minRemoveOrb) {
      scoreToAdd.push(totalLineLength);//score based on totalLineLength
      for(var j in directions[i]) {
        toBeRemoved.push(directions[i][j]);
      }
      for(var j in directions[i + 1]) {
        toBeRemoved.push(directions[i + 1][j]);
      }
    }
  } 
	
	if(toBeRemoved.length > 0) {
	  toBeRemoved.push(originalHex);
    for(var i in toBeRemoved) {
      if(toBeRemoved[i].orb.type === 'Destroyer') {
        for(var j in game.board.hexes) {
          if(game.board.hexes[j].orb !== null) {
            if(game.board.hexes[j].orb.colour === toBeRemoved[i].orb.colour && !checkOnLine(toBeRemoved, game.board.hexes[j])) {
              //toBeRemoved.push(game.board.hexes[j]);
							removeByDestroyer.push(game.board.hexes[j]);
							game.board.hexes[j].orb.removeBy = 'Destroyer';
            }
          }
        }
      } else if(toBeRemoved[i].orb.type === 'Exploder') {
        adjacents = toBeRemoved[i].getAdjacentHexes();
        for(var j in adjacents) {
          if(adjacents[j].orb !== null && !checkOnLine(toBeRemoved, adjacents[j])) {
            //toBeRemoved.push(adjacents[j]);
						removeByExploder.push(adjacents[j]);
						adjacents[j].removeBy = 'Exploder';
          }
        }
      }	
    }
  }
  return toBeRemoved;
}

var checkMatch = function(current) {
  var toBeRemoved;
  if(current.orb.type === 'Wild') {
    toBeRemoved = handleWild(current);
  } else {
    toBeRemoved = handleColoured(current);
  }
  return toBeRemoved;
}

var removeOrbs = function(toBeRemoved, score) {
  var isRemoved = false; 
  if(toBeRemoved.length > 0) {
    isRemoved = true;
  }
  
  for(var i = 0; i < toBeRemoved.length; i++) {
	  toBeRemoved[i].orb = null;
	}
	
	for (var i = removeByDestroyer.length - 1; i >= 0 ; i--) {
		removeByDestroyer[i].orb = null;
		removeByDestroyer.pop();
	}

	for (var i = removeByExploder.length - 1; i >= 0; i--) {
		removeByExploder[i].orb = null;
		removeByExploder.pop();
	}
	if(isRemoved) {
	  game.score.updateScore(score);
	}
	
	if(game.board.hasNoOrbs()) {//generate new orbs if the gameboard is empty
	  placeOrbs(game.newOrbs);
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var removeAni = function() {
	for (var i in removeAnimHexes) {
		removeAnimHexes[i].orb.radius = HexConstant.ORB_RADIUS * (1 - (aniTime / timeLimit));
	}
	for (var i in removeByDestroyer) {
		removeByDestroyer[i].orb.radius = HexConstant.ORB_RADIUS * (1 - (aniTime / timeLimit));
	}
	for (var i in removeByExploder) {
		removeByExploder[i].orb.radius = HexConstant.ORB_RADIUS * (aniTime / timeLimit);
	}
}
////////////////////////var Orb = function(colour, type) {
  this.colour = colour;
  this.type = type;
  this.center = null;
  this.radius = HexConstant.ORB_RADIUS;
  this.img = new Image();
  this.img.src = '' + this.colour + 'Logo_WhiteCenter.png';
	this.removeBy = null;
}

Orb.prototype.draw = function(center, clicked, mouseOver) {

  var fontSize = 36;

	if (this.removeBy === 'Destroyer') {
		ctx.beginPath();
		ctx.arc(center.x, center.y, HexConstant.ORB_RADIUS, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.closePath();
	}

	if (this.removeBy === 'Exploder') {
console.log("are you working?");
  	ctx.drawImage(this.img, center.x - HexConstant.ORB_RADIUS, center.y - HexConstant.ORB_RADIUS,
    	             HexConstant.ORB_RADIUS * 2, HexConstant.ORB_RADIUS * 2);
  }

	if (this.removeBy !== 'Exploder') {
		console.log("not exploder");
  	ctx.drawImage(this.img, center.x - this.radius, center.y - this.radius,
    	             this.radius * 2, this.radius * 2);
	} else {
console.log("exploder");
		ctx.beginPath();
		ctx.arc(center.x, center.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = 'Red';
		ctx.fill();
		ctx.closePath();
	}
  ctx.beginPath();
  ctx.arc(center.x, center.y, this.radius, 0, 2 * Math.PI);
  if(clicked || mouseOver) {
    ctx.lineWidth = 5;
  } else {
    ctx.lineWidth = 2;
  }
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'Black';
  //if this orb is shrinking, shrink it's text also
  if (this.radius !== HexConstant.ORB_RADIUS) {
    fontSize = fontSize * (1 - aniTime / timeLimit);
  }
  ctx.font = 'normal ' + fontSize + 'px Verdana';
  if(this.type === 'Exploder') {
    ctx.fillText('E', center.x, center.y);
  } else if (this.type === 'Destroyer') {
    ctx.fillText('D', center.x, center.y);
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////


