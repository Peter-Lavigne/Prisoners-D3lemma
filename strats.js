//default strategies

//always shares
function Good(h){
  this.title = "Good";
  this.description = "Always shares";
  this.color = "deepskyblue";
	return "share";
}

//always steals
function Evil(h){
  this.title = "Evil";
  this.description = "Always steals";
  this.color = "tomato";
	return "steal";
}

//chooses randomly
function Random(h){
  this.title = "Random";
  this.description = "Coinflip";
  this.color = "blueviolet";
	if (Math.random() < 0.5) return "share";
	return "steal";
}

//repeats opponent's last move
function Repeat(h){
  this.title = "Repeat";
  this.description =
      "Repeats the opponent's last move";
  this.color = "royalblue";
  if (!h.length) return "share";
  return h[h.length - 1];
}

//finds and helps other ants
function Ants(h){
  this.title = "Ants";
  this.description =
      "Finds and helps other ants";
  this.color = "springgreen";
  if (h.length < 2) return "steal";
  if (h.length == 2) return "share";
  if (h[0] == "steal" &&
      h[1] == "steal" &&
      h[2] == "share"){
    return "share";
  }
  return "steal";
}

//rewards sharers and punishes stealers
function Sheriff(h){
  this.title = "Sheriff";
  this.description =
      "Rewards sharers and punishes stealers";
  this.color = "yellow";
  if (!h.length) return "share";
  var shares = 0;
  for (var i = 0; i < h.length; i++){
    shares += h[i] == "share";
  }
  return shares >= h.length / 2 ? "share" : "steal";
}
