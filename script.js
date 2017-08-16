//simulation code

var players,
    numPlayers,
    numMatches,
    numRounds,
    numElims,
    strategies;

var strategyList = [Sheriff, Ants, Repeat, Random, Evil, Good];
var $ = function(id) {return document.getElementById( id );};
var data;

//player object
function Player(strategy){
	this.strategy = strategy;
  //sets title, description, and color
  this.strategy([]);
	this.points = 0;
	this.histories = [];
	for (var i = 0; i < numPlayers; i++){
		this.histories.push([]);
	}
}

//runs the game
function run(){
	start();
  var r = 0;
	while (!gameOver() && r++ < numRounds){
		for (var i = 0; i < numMatches; i++){
			match();
		}
    var sorted = sortedPlayers();
    data.push(sorted);
		elimatePlayers(sorted);
    for (i = 0; i < numPlayers; i++){
      players[i].points = 0;
    }
	}
  if (gameOver()){
    data.push(sortedPlayers());
  }
  chart();
}

//gets variables from document
//initializes players
function start(){
  d3.selectAll("svg > *").remove();
  data = [];
	players = [];
  strategies = [];
	numPlayers = $("numPlayers").value;
	numMatches = $("numMatches").value;
	numRounds = $("numRounds").value;
  numElims = $("numElims").value;
  var checkboxes = document.getElementsByClassName("strategyCheckbox");
  var titles = document.getElementsByClassName("strategyTitle");
  for (var i = 0; i < checkboxes.length; i++){
    if (checkboxes[i].checked){
      for (var j = 0; j < strategyList.length; j++){
        var p = new Player(strategyList[j]);
        if (p.title == titles[i].textContent){
          strategies.push(strategyList[j]);
        }
      }
    }
  }
	for (i = 0; i < numPlayers; i++){
		players.push(new Player(strategies[i % strategies.length]));
	}
}

//everyone plays against everyone else
function match(){
	for (var i = 0; i < numPlayers; i++){
		for (var j = i + 1; j < numPlayers; j++){
			var p1 = players[i], p2 = players[j];
			var b1 = outcome(p1,p2), b2 = outcome(p2,p1);
			updatePlayer(p1, p2, b1, b2);
			updatePlayer(p2, p1, b2, b1);
		}
	}
}

//true if the outcome is "share"
function outcome(p1, p2){
	return p1.strategy(p1.histories[players.indexOf(p2)]) == "share";
}

//updates the player's points and history
function updatePlayer(p1, p2, b1, b2){
	p1.histories[players.indexOf(p2)].push(b2 ? "share" : "steal");
	p1.points += b1 ? (b2 ? 1 : -3) : (b2 ? 3 : -1);
}

//are all the players the same strategy?
function gameOver(){
	var ps = players[0].title;
	for (var i = 1; i < numPlayers; i++){
		if (players[i].title != ps) return false;
	}
	return true;
}

//removes the worst players
//replaces them with the best players
function elimatePlayers(sorted){
	for (var i = 0; i < numElims; i++){
		var worst = sorted[i].original;
    var index = players.indexOf(worst);
		for (var j = 0; j < numPlayers; j++){
			players[j].histories[index] = [];
		}
		var best = sorted[numPlayers - 1 - i].original;
		players[index] = new Player(best.strategy);
	}
}

//a sorted copy of players
function sortedPlayers(){
  var sorted = [];
  for (var i = 0; i < numPlayers; i++){
      sorted.push(playerCopy(players[i]));
  }
  sorted.sort(function(a,b){
    if (a.points == b.points){
      return Math.random() - 0.5;
    }
		return a.points - b.points;
	});
  return sorted;
}

//copies a player
function playerCopy(orig){
  var p = new Player(orig.strategy);
  p.points = orig.points;
  p.original = orig;
  return p;
}
