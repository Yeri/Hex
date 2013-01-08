//var hex;
var xOffset = 275;
var yOffset = -75;

var xyCoordinates = function(x, y) {

  this.x = x;
  this.y = y;

}

// can be combined with xyCoordinates
// combine then distinguish points with local variable names 
var hexCoordinates = function(horizontal, vertical, numColumns) { 

  this.horizontal = 3 * horizontal;
  this.vertical;
	if (horizontal < Math.ceil(numColumns / 2)) {
		this.vertical = -horizontal + 2 * vertical;
	} else {
		this.vertical = horizontal - numColumns + 1 + 2 * vertical;
	}  
}

// store constant values for hexagon tiles
var HexCommonInfo = {

	initialize: function (edgeLength) {
		this.l = edgeLength,
		this.horizontal = edgeLength * Math.sin(Math.PI/6),
		this.r = edgeLength * Math.cos(Math.PI/6),
		this.height = 2 * this.r,
		this.width = 2 * edgeLength,
		this.narrowWidth = this.l + this.horizontal
	}

}

// store information of hexagon tiles
// left most column is the vertical axis of hexCoordinates
var Hex = function(numColumns, hexCol, hexRow) { 

	this.hexCoor = new hexCoordinates(hexCol, hexRow, numColumns);
	this.xyCoor; 
	this.orb = "empty";
	if (hexCol >= Math.floor(numColumns / 2)) {	
		this.xyCoor = new xyCoordinates(HexCommonInfo.narrowWidth * hexCol, 
								HexCommonInfo.height * (hexCol / 2 + hexRow));
	} else {
		this.xyCoor = new xyCoordinates(HexCommonInfo.narrowWidth * hexCol, 
				 					HexCommonInfo.height * (hexCol / 2 + hexRow 
									+ Math.abs(hexCol - Math.floor(numColumns / 2))));
	}
}

//update tile's status (empty or not, if not what color of orb)
//need to decide where to check precondition of updating orb 
//precondtion: if already existing orb, updateOrb can't be allowed.
Hex.prototype.updateOrb = function (status) {
	this.orb = status;
}

// drawing hexagon tiles in clockwise and its content
var drawHex = function(ctx, hex) { 

	var center = hex.xyCoor;
	
	// drawing a hexagon
	ctx.moveTo((center.x - HexCommonInfo.width / 2) + xOffset, center.y + yOffset );
	ctx.lineTo((center.x - HexCommonInfo.l / 2) + xOffset, 
							(center.y - HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.l / 2) + xOffset, 
							(center.y - HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.width / 2) + xOffset, center.y + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.l / 2) + xOffset, 
							(center.y + HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x - HexCommonInfo.l / 2) + xOffset, 
							(center.y + HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x - HexCommonInfo.width / 2) + xOffset, center.y + yOffset);
/*
//testing code to draw circle in tiles
	if (hex.hexCoor.horizontal === 3) {
		ctx.moveTo(center.x + 20 + xOffset, center.y + yOffset);
		ctx.arc(center.x + xOffset, center.y + yOffset, 20, 0, 2 * Math.PI);
	}

*/
	// drawing an orb ===> need detail implementation(orb type) later 
	if (hex.orb != "empty") {
		ctx.moveTo(center.x + 20 + xOffset, center.y + yOffset); // 20 comes from a radius of orb
		ctx.arc(center.x +xOffset, center.y + yOffset, 20, 0, 2 * Math.PI);
	}
	ctx.lineWidth = 2;
	ctx.textAlign = "center";
  ctx.textBaseline = "middle";
	ctx.fillText("(" + hex.hexCoor.horizontal + "," + hex.hexCoor.vertical + ")", 
								center.x + xOffset, center.y + yOffset );
}

/* not working why??
// drawing a orb in a hexagon tile
var drawOrb = function(ctx, hex) {

	ctx.moveTo(hex.xyCoor.x + 20 + xOffset, hex.xyCoor.y + yOffset);
	ctx.arc(hex.xyCoor.x + xOffset, center.y + yOffset, 20, 0, 2 * Math.PI);

}
*/

///////////////////////////////////////////////////////////////////////////////
//// below codes are related with content of each hexagon tiles on a board ////
///////////////////////////////////////////////////////////////////////////////

var Board = {};

Board.initialize = function (edgeLength, numColumns) {
	
	this.numColumns = numColumns;
	var numTilesInBorder = Math.ceil(numColumns / 2);
 
	for (var i = 0; i < numTilesInBorder; i++) {
		if (i < Math.floor(numColumns / 2)) { // initialize columns except a center column
			for (var j = 0; j < numTilesInBorder + i; j++) { 
				this[[i,j]] = new Hex(numColumns, i, j);
				this[[numColumns - 1 - i, j]] = new Hex(numColumns, numColumns - 1 - i, j);
			}
		} else { // initialize the center column
			for (var j = 0; j < numTilesInBorder + i; j++) {
				this[[i, j]] = new Hex(numColumns, i, j); 
			}			
		}
	}

}

Board.drawBoard = function (ctx) {

	var numTilesInBorder = Math.ceil(this.numColumns / 2);
							// Math.ceil(numColumns / 2) = the number of tiles in border lines
	ctx.beginPath();
/*//drawing x,y axis for printing 
	var hex = new xyCoordinates (0, 0);
	ctx.moveTo(xOffset, 50);
	ctx.lineTo(xOffset, 650);
	ctx.moveTo(100, HexCommonInfo.height * (Math.abs(Math.floor(9 / 2))) + yOffset);
	ctx.lineTo(900, HexCommonInfo.height * (Math.abs(-Math.floor(9 / 2))) + yOffset);
*/
	for (var i = 0; i < numTilesInBorder; i++) {
		if (i < Math.floor(this.numColumns / 2)) { // draw columns except a center column
			for (var j = 0; j < numTilesInBorder + i; j++) {						
				drawHex(ctx, this[[i,j]]);
				drawHex(ctx, this[[this.numColumns - 1 - i, j]]);
			}
		} else { // draw the center column
			for (var j = 0; j < numTilesInBorder + i; j++) {
				drawHex(ctx, this[[i,j]]);
			}			
		}
	}
	
	ctx.stroke();

}

// execute the JavaScript
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

HexCommonInfo.initialize(40);
Board.initialize(40, 9);
ctx.clearRect(0, 0, 1000, 700);
Board.drawBoard(ctx);
