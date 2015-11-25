/*global $, console, alert, prompt, document, window*/
'use strict';
/*
Game
	level
	board
	hit pieces
	timer/counter => time left/number of hit pieces left
	scoreboard
	whose turn
	
	
Player
	name
	hit()
	score
	accuracy rate
	completion rate
*/






var score = 0; //PLACEHOLDER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//game constructor function
var Game = function () {
	this.$scoreboard = $('<section id="score">');
	this.$map = $('<section id="map">');
	this.$board = $('<section>').append(this.$scoreboard).append(this.$map); //board is made up of scoreboard and map sections
	this.playerList = []; //Player list.  Linked to each player's object
	this.currentPlayer = 0; //Holds the index for playerList for the player who's currently playing. Initialized for first player
	this.currentLevel = 0; //Holds the index of levelData for the current level being played.  Initialized for first level
};

Game.prototype = {
	//-------------NOTE: Player creation Game.prototype.getPlayers() below the Player construtor function
	//Data for how many pieces go on each level and how they should be styled.
	levelData: [
		{pieces: 6, grid: '3x2', speedFactor: 1, maxHitPieces: 5, pointValue: 1}, //Level 1 [0]
		{pieces: 9, grid: '3x3', speedFactor: 3, maxHitPieces: 10, pointValue: 5}, //Level 2 [1]
		{pieces: 12, grid: '4x3', speedFactor: 4, maxHitPieces: 15, pointValue: 10} //Level 3 [2]
	],
	
	//Changes the player at the beginning of end of each start of the level
	changePlayer: function () {
		//Tricky way to iterate through the players but only as high as the number of players there are.
		this.currentPlayer = (this.currentPlayer + 1) % this.playerList.length;
		if (this.currentPlayer === 0) { //When we're back to the top of the player list...
			return this.changeLevel(); // ...change the level and don't finish up this function and don't finish up the function.
		}
		console.log("Now playing..." + this.playerList[this.currentPlayer].name);
		this.start(); //Otherwise, start up the game for the new player.
	},
	
	//Changes the level after each player has played it
	changeLevel: function () {
		
		//Tricky way to iterate through the players but only as high as the number of players there are.
		this.currentLevel = (this.currentLevel + 1) % this.levelData.length;
		if (this.currentLevel === 0) { //When we've gone through all the levels...
			var changeToActThree;// ...move on to Act III.    //Placeholder!!!!!!!!!!!!!!!!!!
			return console.log("Game done.");
		}
		console.log("Now for level " + this.currentLevel);
		console.log("Now playing..." + this.playerList[this.currentPlayer].name); //Necessary for the first player of the round.
		this.setBoard(); //Otherwise, swap out the grid for the new level.
		this.start(); //Start up the next round.
	},
	
	//Sets up the board for the beginning of a round
	setBoard: function () {
		this.$map.empty(); //Removes last board if still there. (it leaves the scoreboard standing)
		var scope = this,
			level = this.currentLevel, //get the current level
			grid = $('<div>').attr('id', 'grid-' + this.levelData[level].grid), //make the grid div with size setting in ID
			piece,
			i;
		
		for (i = 0; i < this.levelData[level].pieces; i++) { //Loops for the number of pieces for the level
			piece = $('<div>').attr('class', 'passive cell-' + this.levelData[level].grid); //sets pieces' class
			grid.append(piece); //Adds one new piece to the grid
		}
		
		grid.on('click', '.active', function (e) { //When an active cell is clicked
			//Call the Player's hit function sending the hit target as an argument
			scope.playerList[scope.currentPlayer].hit(e.target);
		});
		this.$map.append(grid);
		$('#game').append(this.$map); //gets grid into the game
		console.log("Gameboard loaded.");
	},
	
	
	setScoreboard: function () {
		var level = this.currentLevel, //get the current level
			scoreboard = $('<div>').attr('id', 'scoreboard');
		var text = "<h2>Welcome to Level " + (level + 1) + "</h2>";
		scoreboard.html(text);
		
		$('#game').append(scoreboard);
		console.log("Scoreboard loaded.");
	},
	
	
	//Sets a cell to be active to hit for limited time
	showHitPiece: function () {
		var scope = this;
		var $passiveCells = $('.passive');
		var randCell = parseInt(Math.random() * $passiveCells.length, 10);//select random number possible for available passive divs
		randCell = $passiveCells.eq(randCell); //Use that random number to select the corresponding random cell.
		randCell.removeClass('passive').addClass('active red-bg'); //Change state of cell to active for hit.
		
		setTimeout(function () {  //length of time cell is active before it becomes passive again
			randCell.removeClass('active red-bg').addClass('passive');
		}, 2000 / this.levelData[this.currentLevel].speedFactor); //the time is different for each level
	},
	
	
	//Starts the round
	start: function (player) {
		console.log("Start of round.");
		var scope = this,
			hitPiecesRemaining = scope.levelData[scope.currentLevel].maxHitPieces;
		
		//Add pre game count down etc...???????????????????????????
		//Starts game action
		var interval = setInterval(function () { //Like a for loop
			if (hitPiecesRemaining === 0) {
				clearInterval(interval);//Stop loop
				console.log("End of round.");
				//create a button or timed flow with a button at the end to start next player.
				return setTimeout(function () {
					scope.changePlayer();
					
				}, 5000);//placeholder to change player after 5 seconds!!!!!!!!!!!!!!!!!!
				
			}
			
			scope.showHitPiece(); //Each interval makes another hit piece
			hitPiecesRemaining--;
		}, 1000);
		
	},

	runGame: function () {//The flow for a game.  Called once per game.
//		var level, playerCounter;
		//initialize game
		//[set boilerplate for game]!!!!!!!!!!!!!!!
		
		this.getPlayers(); //get the players for this game.
		//set Scoreboard
		this.setScoreboard();
		//set board
		this.setBoard();
		//for loop?????????????????????
		this.start();

	}
};




//Player constructor function
//constructor is called by the game and takes an argument of the game to link them up
var Player = function (game, name) {//game is scope of the currently played game.
	this.game = game; //sets game argument as variable to use in prototype
	this.name = name;
	this.score = 0;
	this.accuracy = 0;
	this.completion = 0;
};

Player.prototype = {
	
	//was originally on the Game.prototype
	hit: function (target) {
		var game = this.game;
		target = $(target);
			
		this.score = this.score + game.levelData[game.currentLevel].pointValue; //Add to the score depend on level's point value.
		console.log(this.score);
			//Make inactive for multiple hits, and allow hit styling
		target.removeClass('red-bg active').addClass('green-bg hit');
			//after a half second reset defaults
		setTimeout(function () {
			target.removeClass('green-bg hit').addClass('passive');//change color for a moment, and then make cell passive again
		}, 500);
		
	}
};

//create players
Game.prototype.getPlayers = function () {
	var name = prompt("What is player 1's name?");
	var player = new Player(this, name);
	this.playerList.push(player);
};



var game = new Game();
