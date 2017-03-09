function Board() {

	/*

		0 	1	2	3

		4	5	6	7

		8	9	10	11

		12	13	14	15

	*/

	this.start = start;

	var context, 
		cells = [],
		animating = 0,
		BOARD_WIDTH = 850,
		CELL_WIDTH = 200,
		BORDER_WIDTH = 10;

	var colors = {
		TEXT_DARK: '#766D63',
		TEXT_LIGHT: '#FBF5F2',
		BACKGROUND: '#CDC0B4',
		BORDER: '#BBADA0',
		TWO: '#EEE4DA',
		FOUR: '#EDE0C8',
		EIGHT: '#F2B179',
		SIXTEEN: '#F59563',
		THIRTYTWO: '#F67C5F',
		SIXTYFOUR: '#F65E3B',
		ONEHUNDREDTWENTYEIGHT: '#EDCE72',
		TWOHUNDREDFIFTYSIX: '#EDCC62'
	};

	// Swipe detection
	var xDown = null,                                                       
		yDown = null;                                                        


	var scoreBoard = document.getElementById('score-board');
	var scores = new Scores();
	var score, highscore;

	var newGameButton = document.getElementsByTagName('button')[0];
	var winningMessage = document.getElementById('win-message');

	var LEFT_BORDER_INDEXES = [0, 4, 8, 12];
	var RIGHT_BORDER_INDEXES = [3, 7, 11, 15];
	var BOTTOM_BORDER_INDEXES = [12, 13, 14, 15];
	var TOP_BORDER_INDEXES = [0, 1, 2, 3];

	var TOP_ORDER = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	var BOTTOM_ORDER = [8, 9, 10, 11, 4, 5, 6, 7, 0, 1, 2, 3];
	var RIGHT_ORDER = [2, 6, 10, 14, 1, 5, 9, 13, 0, 4, 8, 12];
	var LEFT_ORDER = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
	
	var	directions = {
		UP: 1, 
		DOWN: 2, 
		LEFT: 3,
		RIGHT: 4
	};

	function start() {

		var canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = BOARD_WIDTH; 
		canvas.height = BOARD_WIDTH; 
		context = canvas.getContext('2d');
		
		retrieveState();

		drawBorders();

		updateScore();
		updateHighscore();
		
		window.onbeforeunload = function() {
			saveState();
		}

		newGameButton.onclick = newGame;

		winningMessage.onclick = hideWinningMessage;

		document.onkeydown = function(event) {
			if (event.key === 'ArrowUp') {
				if (animating === 0) moveInDirection(directions.UP);
			} else if (event.key === 'ArrowDown') {
				if (animating === 0) moveInDirection(directions.DOWN);
			} else if (event.key === 'ArrowLeft') {
				if (animating === 0) moveInDirection(directions.LEFT);
			} else if (event.key === 'ArrowRight') {
				if (animating === 0) moveInDirection(directions.RIGHT);
			}
		}

		window.addEventListener('touchstart', handleTouchStart, false);        
		window.addEventListener('touchmove', handleTouchMove, false);

		// mobile browsers set scores + new game off
		if (typeof window.orientation !== 'undefined') { 
			scoreBoard.className += ' hide';
			newGameButton.className += ' hide';			
		}

	}

	function setColor(color) {
		for (availableColor in colors) {
			if (colors[availableColor] === color) {
				context.fillStyle = colors[availableColor];
			}			
		}
	}

	function newGame() {
		for (var counter = 0; counter < cells.length; counter++) {
			cells[counter] = 0;
			emptyCell(counter);
		}
		generateRandomCell();
		score = 0;
		updateScore();
		saveState();
	}

	function generateRandomCell() {
		var random = Math.floor(Math.random() * 10) + 1;
		var twoOrFour = 2;
		if (random === 4) {
			twoOrFour = 4;
		}
		var emptyIndex = getRandomEmptyCellIndex();
		cells[emptyIndex] = twoOrFour;
		fillCell(twoOrFour, emptyIndex);
	}

	function getRandomEmptyCellIndex() {
		var emptyCellIndexes = [];
		for (var counter = 0; counter < cells.length; counter++) {
			if (cells[counter] === 0) {
				emptyCellIndexes.push(counter);
			}
		}
		return emptyCellIndexes[Math.floor(Math.random() * (emptyCellIndexes.length))];  
	}

	function drawBorders() {
		setColor(colors.BORDER);
		for (var counter = 0; counter < 5; counter++) {
			context.fillRect(BORDER_WIDTH * counter + CELL_WIDTH * counter, 0, 10, 850);
			context.fillRect(0, BORDER_WIDTH * counter + CELL_WIDTH * counter, 850, 10);
		}
	}

	// callback happens when animation ended
	function slideCell(startIndex, endIndex, callback) {
		animating++;
		var direction = getSlideDirection(startIndex, endIndex);
		var slideX, slideY;
		var pixelCounter = 0; 
		var limit = CELL_WIDTH + BORDER_WIDTH;
		slide();
		function slide() {
			setTimeout(function() {
				emptyCell(startIndex);
				var x, y;
				var coordinates = getCellCoordinates(startIndex);
				if (direction === directions.LEFT) {
					x = coordinates.x - pixelCounter;
					y = coordinates.y;
				} else if (direction === directions.RIGHT) {
					x = coordinates.x + pixelCounter;
					y = coordinates.y;
				} else if (direction === directions.DOWN) {
					y = coordinates.y + pixelCounter;
					x = coordinates.x;
				} else {
					y = coordinates.y - pixelCounter;
					x = coordinates.x;
				}
				drawBorders();
				drawCell(x, y, getColorMatchingNumber(cells[startIndex]), cells[startIndex]);
				pixelCounter += 14;	
				if (pixelCounter <= limit) {
					slide();
				} else {
					drawBorders();
					animating--;
					if (callback) callback();
				}
			}, 1);
		}
	}	

	function emptyCell(index) {
		var coordinates = getCellCoordinates(index);
		setColor(colors.BACKGROUND);
		context.fillRect(coordinates.x, coordinates.y, CELL_WIDTH, CELL_WIDTH);
	}

	function drawCell(x, y, color, number) {
		setColor(color);
		context.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
		if (number < 8) {
			setColor(colors.TEXT_DARK);
		} else {
			setColor(colors.TEXT_LIGHT);
		}
		var fontX = 57;
		if (number <= 8) {
			fontX = 80;
		} else if ((number + '').length === 3) {
			fontX = 30;
		} else if ((number + '').length === 4) {
			fontX = 10;
		} 		
		context.font = '80px Helvetica';
		context.fillText(number, x + fontX, y + 125);
	}

	function fillCell(number, index) {
		var coordinates = getCellCoordinates(index);
		drawCell(coordinates.x, coordinates.y, getColorMatchingNumber(number), number);
	}

	function getCellCoordinates(index) {
		var x, y;
		if (index === 0 || index % 4 === 0) {
			x = 1 * BORDER_WIDTH + 0 * CELL_WIDTH;
		} else if (index === 1 || index % 4 === 1) {
			x = 2 * BORDER_WIDTH + 1 * CELL_WIDTH;
		} else if (index === 2 || index % 4 === 2) {
			x = 3 * BORDER_WIDTH + 2 * CELL_WIDTH;
		} else {
			x = 4 * BORDER_WIDTH + 3 * CELL_WIDTH;
		}
		if (index <= 3) {
			y = 1 * BORDER_WIDTH + 0 * CELL_WIDTH;
		} else if (index <= 7) {
			y = 2 * BORDER_WIDTH + 1 * CELL_WIDTH;
		} else if (index <= 11) {
			y = 3 * BORDER_WIDTH + 2 * CELL_WIDTH;
		} else if (index <= 15) {
			y = 4 * BORDER_WIDTH + 3 * CELL_WIDTH;
		}
		return { x: x, y: y };
	}

	function getSlideDirection(startIndex, endIndex) {
		if (startIndex + 1 === endIndex) {
			return directions.RIGHT;
		} else if (startIndex - 1 === endIndex) {
			return directions.LEFT;
		} else if (endIndex - 4 === startIndex) {
			return directions.DOWN;
		} else {
			return directions.UP;
		}
	}

	function getColorMatchingNumber(number) {
		var color;
		switch(number) {
		    case 2:
		    	color = colors.TWO;
		        break;
		    case 4:
		        color = colors.FOUR;
		        break;
	        case 8:
		    	color = colors.EIGHT;
		        break;
		    case 16:
		        color = colors.SIXTEEN;
		        break;
		    case 32:
		    	color = colors.THIRTYTWO;
		        break;
		    case 64:
		        color = colors.SIXTYFOUR;
		        break;
	        case 128:
		    	color = colors.ONEHUNDREDTWENTYEIGHT;
		        break;
		    case 256:
		        color = colors.TWOHUNDREDFIFTYSIX;
		        break;
		    default:
		        color = colors.TWOHUNDREDFIFTYSIX;
		}
		return color;
	}

	function showWinningMessage() {
		winningMessage.className = winningMessage.className.replace('hide', '').trim();
	}

	function hideWinningMessage() {
		alert(winningMessage.className);
		if (winningMessage.className.indexOf('hide') === -1) {
			alert('1');
			winningMessage.className += ' hide';
		}
	}

	function updateScore() {
		scoreBoard.children[1].children[0].innerHTML = score;
	}

	function updateHighscore() {
		scoreBoard.children[0].children[0].innerHTML = highscore;	
	}

	function saveState() {
		if (scores.supported()) {
			if (score > highscore) {
				highscore = score;
			}
			var saveObject = { cells: cells, score: score, highscore: highscore };
			scores.store('2048-bertcarsouw', JSON.stringify(saveObject));
		}
	}

	function retrieveState() {
		if (scores.supported()) {
			var data = scores.retrieve('2048-bertcarsouw');
			if (data === null) {
				score = 0;
				for (var cellCounter = 0; cellCounter < 16; cellCounter++) {
					cells.push(0);
					emptyCell(cellCounter);
				}
				highscore = 0;
				generateRandomCell();
			} else {
				data = JSON.parse(data);
				score = data.score;
				if (!data.score) {
					score = 0;
				}
				highscore = data.highscore;
				if (!data.highscore) {
					highscore = 0;
				}
				if (data.cells) {
					cells = data.cells;
					var cellSet = false;
					for (var counter = 0; counter < cells.length; counter++) {
						if (cells[counter] > 0) {
							cellSet = true;
							fillCell(cells[counter], counter);
						} else {
							emptyCell(counter);
						}
					}
					if (!cellSet) {
						generateRandomCell();
					}
				}
			}
		} else {
			for (var cellCounter = 0; cellCounter < 16; cellCounter++) {
				cells.push(0);
				emptyCell(cellCounter);
			}
			generateRandomCell();
			score = 0;
			highscore = 0;
		}
	}

	function moveInDirection(direction) {
		var borderIndexes;
		var secondIndex;
		var order;
		if (direction === directions.UP) {
			borderIndexes = TOP_BORDER_INDEXES;
			secondIndex = -4;
			order = TOP_ORDER;
		} else if (direction === directions.DOWN) {
			borderIndexes = BOTTOM_BORDER_INDEXES;
			secondIndex = 4;
			order = BOTTOM_ORDER;
		} else if (direction === directions.LEFT) {
			borderIndexes = LEFT_BORDER_INDEXES;
			secondIndex = -1;
			order = LEFT_ORDER;
		} else {
			borderIndexes = RIGHT_BORDER_INDEXES;
			secondIndex = 1;
			order = RIGHT_ORDER;
		}
		var boardChecked = 0;
		var index = 0;
		var cellCounter = order[index];
		var moved = false;
		var theMeltedOnes = [];
		move();
		function move() {
			if (cells[cellCounter] > 0 && borderIndexes.indexOf(cellCounter) === -1) {
				if (cells[cellCounter + secondIndex] === 0) {
					// move block to empty cell
					moved = true;
					slideCell(cellCounter, cellCounter + secondIndex, function() {
						if (cellCounter < 16) {
							cells[cellCounter + secondIndex] = cells[cellCounter];
							cells[cellCounter] = 0;
							index++;
							cellCounter = order[index];
							move();
						}
					});
				} else if (cells[cellCounter + secondIndex] === cells[cellCounter] && theMeltedOnes.indexOf(cellCounter) === -1) {
					// melt those bitches
					moved = true;
					slideCell(cellCounter, cellCounter + secondIndex, function() {
						if (cellCounter < 16) {
							cells[cellCounter + secondIndex] = cells[cellCounter] * 2;
							score += cells[cellCounter + secondIndex];
							updateScore();
							if (cells[cellCounter + secondIndex] === 2048) {
								// winningspree game over
								showWinningMessage();
							}
							if (score > highscore) {
								highscore = score;
								updateHighscore();								
							}
							theMeltedOnes.push(cellCounter + secondIndex);
							cells[cellCounter] = 0;
							fillCell(cells[cellCounter + secondIndex], cellCounter + secondIndex)
							index++;
							cellCounter = order[index];
							move();
						}
					});
				} else {
					index++;
					cellCounter = order[index];
					move();
				}
			} else if (cellCounter < 15) {
				// not done moving all cells
				index++;
				cellCounter = order[index];
				move();
			} else {
				if (boardChecked === 0 && !moved) {
					// nothing is possible
				} else if (boardChecked === 3) {
					// done
					generateRandomCell();
				} else {
					boardChecked++;
					index = 0; 
					cellCounter = order[index];
					move();
				}
			}
 		}
	}

	function handleTouchStart(event) {                                         
	    xDown = event.touches[0].clientX;                                      
	    yDown = event.touches[0].clientY;                                      
	};                                                

	function handleTouchMove(event) {
	    if (!xDown || !yDown) {
	        return;
	    }
	    var xUp = event.touches[0].clientX;                                    
	    var yUp = event.touches[0].clientY;
	    var xDiff = xDown - xUp;
	    var yDiff = yDown - yUp;
	    if (Math.abs(xDiff) > Math.abs(yDiff)) {
	        if (xDiff > 0) {
	        	if (animating === 0) moveInDirection(directions.LEFT);
	        } else {
	        	if (animating === 0) moveInDirection(directions.RIGHT);
	        }                       
	    } else {
	        if (yDiff > 0) {
	        	if (animating === 0) moveInDirection(directions.UP);
	        } else {
	        	if (animating === 0) moveInDirection(directions.DOWN);
	        }                                                                 
	    }
	    xDown = null;
	    yDown = null;                                             
	};

}