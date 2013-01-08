var hex;
var xOffset = 300;
var yOffset = 0;

var xyCoordinates = function(x, y) {
  this.x = x;
  this.y = y;
}

var hexCoordinates = function(horizontal, vertical) {
  this.horizontal = horizontal;
  this.vertical = vertical;
}

var HexCommonInfo  = function (edgeLength) {
  this.l = edgeLength;
  this.horizontal = edgeLength * Math.sin(Math.PI/6);
  this.r = edgeLength * Math.cos(Math.PI/6);
  this.height = 2 * this.r;
  this.width = 2 * edgeLength;
  this.narrowWidth  = this.l + this.horizontal;
}

// store information of hexagon tiles
// left most column is the vertical axis of hexCoordinates
var Hex = function(edgeLength, numColumns) { 
/*
  this.l = edgeLength;
  this.horizontal = edgeLength * Math.sin(Math.PI/6);
  this.r = edgeLength * Math.cos(Math.PI/6);
  this.height = 2 * this.r;
  this.width = 2 * edgeLength;
  this.narrowWidth  = this.l + this.horizontal;
*/
  this.getXYCoordinates = function(horizontal, vertical) { 
  	if (horizontal >= Math.floor(numColumns / 2)) {	
  		return new xyCoordinates(HexCommonInfo.narrowWidth * horizontal, 
																	HexCommonInfo.height * (horizontal / 2 + vertical));
		} else {
  		return new xyCoordinates(HexCommonInfo.narrowWidth * horizontal, 
															 HexCommonInfo.height * (horizontal / 2 + vertical 
															 + Math.abs(horizontal - Math.floor(numColumns / 2))));
		}
	};	
}

// drawing a hexagon tile in clockwise
var drawHex = function(ctx, hexCoordinates) { 
	var center = hex.getXYCoordinates(hexCoordinates.horizontal, hexCoordinates.vertical);
	
	ctx.moveTo((center.x - HexCommonInfo.width / 2) + xOffset, center.y + yOffset );
	ctx.lineTo((center.x - HexCommonInfo.l / 2) + xOffset, (center.y - HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.l / 2) + xOffset, (center.y - HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.width / 2) + xOffset, center.y + yOffset);
	ctx.lineTo((center.x + HexCommonInfo.l / 2) + xOffset, (center.y + HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x - HexCommonInfo.l / 2) + xOffset, (center.y + HexCommonInfo.height / 2) + yOffset);
	ctx.lineTo((center.x - HexCommonInfo.width / 2) + xOffset, center.y + yOffset);
	ctx.lineWidth = 2;
	ctx.textAlign = "center";
  ctx.textBaseline = "middle";
	ctx.fillText("(" + hexCoordinates.horizontal + "," + hexCoordinates.vertical + ")", 
								center.x + xOffset, center.y + yOffset );
}

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

// call the JavaScript
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

HexCommonInfo (35);
hex = new Hex(35, 9);
ctx.clearRect(0, 0, 800, 600);
drawHexGrid(ctx, 9);

///////////////////////////////////////////////////////////////////////////////////////////////////
// below codes are related with content of each hexagon tiles on a board
///////////////////////////////////////////////////////////////////////////////////////////////////
var Board = {};

Board.prototype.initializeBoard = function (edgeLength, numColumns) {
	
	var numTilesInBorder = Math.ceil(numColumns / 2);
 
	for (var i = 0; i < numTilesInBorder; i++) {
		if (i < Math.floor(numColumns / 2)) { // initialize columns except a center column
			for (var j = 0; j < numTilesInBorder + i; j++) { 
				this[[i,j]] = new Hex(edgeLength, numColumns);
				this[[numcolumns - 1 - i, j]] = new Hex();
			}
		} else { // initialize the center column
			for (var j = 0; j < numTilesInBorder + i; j++) {
				this[[i, j]] = new Hex(edgeLength, numColumns); 
			}			
		}
	}
}

Board.prototpye.drawBoard = function (ctx) {

	ctx.beginPath();
	
	for (var i = 0; i < Math.ceil(numColumns / 2); i++) {
		if (i < Math.floor(numColumns / 2)) { // draw columns except a center column
			for (var j = 0; j < Math.ceil(numColumns / 2) + i; j++) { 
													// Math.ceil(numColumns / 2) = the number of tiles in border lines
//				drawHex(ctx, new hexCoordinates(i, j));
//				drawHex(ctx, new hexCoordinates((numColumns-1)-i,j));
				drawHex(ctx, this[[i,j]]);
				drawHex(ctx, this[[numColumns - 1 - i, j]]);
			}
		} else { // draw the center column
			for (var j = 0; j < Math.ceil(numColumns / 2) + i; j++) {
//				drawHex(ctx, new hexCoordinates(i, j)); 
				drawHex(ctx, this[[i,j]]);
			}			
		}
	}
	
	ctx.stroke();
}

