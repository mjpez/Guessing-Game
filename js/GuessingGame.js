function generateWinningNumber() {
	return Math.floor(Math.random()*100)+1;
}

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
	if(this.playersGuess < this.winningNumber) {
		return true;
	} else {
		return false;
	}
}

Game.prototype.playersGuessSubmission = function(guess) {
	if(guess < 1 || guess > 100 || typeof guess !== "number") {
		throw "That is an invalid guess.";
	} else {
		this.playersGuess = guess;
		return this.checkGuess();
	}
}

Game.prototype.checkGuess = function() {
	if(this.playersGuess === this.winningNumber) {
		$('#hint, #submit').prop("disabled",true);
    $('#subtitle').text("Type 'R' or Press the Reset button to play again!");
		return "You Win!";
	} else {
		if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
			return "You have already guessed that number.";
		} else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
			if(this.pastGuesses.length > 4) {
				$('#hint, #submit').prop("disabled",true);
      	$('#subtitle').text("Type 'R' or Press the Reset button to play again!");
				return "You Lose.";
			} else {
        if(this.isLower()) {
          $('#subtitle').text("Guess Higher!")
        } else {
          $('#subtitle').text("Guess Lower!")
        }
				if(this.difference() < 10) {
					return "You're burning up!";
				} else if(this.difference() < 25) {
					return "You're lukewarm.";
				} else if(this.difference() < 50) {
					return "You're a bit chilly.";
				} else {
					return "You're ice cold!";
				}
			}
		}
	}
}

function newGame() {
	return new Game();
}

Game.prototype.provideHint = function() {
	return shuffle([generateWinningNumber(), this.winningNumber, generateWinningNumber()]);
}

function makeAGuess(game) {
  var guess = $('#player-input').val();
  $('#player-input').val("");
  var output = game.playersGuessSubmission(parseInt(guess,10));
  $('#title').text(output);
}

$(document).ready(function() {
	console.log('ready to go');
  var game = new Game();

  $('#submit').click(function() {
     makeAGuess(game);
  })

  $('#player-input').keypress(function(event) {
    if (event.which == 13 ) {
       makeAGuess(game);
    }
  })

  $('#player-input').keyup(function(event) {
    if (event.which == 82 ) {
	    game = newGame();
		  $('#title').text('Play the Guessing Game!');
		  $('#subtitle').text('Guess a number between 1-100!');
		  $('.guess').text('-');
		  $('#hint, #submit').prop("disabled", false);
    }
  })

	$('#reset').click(function(game) {
		game = newGame();		
	  $('#title').text('Play the Guessing Game!');
	  $('#subtitle').text('Guess a number between 1-100!');
	  $('.guess').text('-');
	  $('#hint, #submit').prop("disabled", false);
	})

  $('#hint').click(function() {
    var hints = game.provideHint();
    $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
	})

})