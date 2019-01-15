function matchMap(seasonId, matchId) {
  //console.log(seasonId, matchId);
  switch(+seasonId) {
    case 1: return 335986 + (+matchId);
    case 2: return 392185	+ (+matchId);
    case 3: return 419110 + (+matchId);
    case 4: return 501202 + (+matchId);
    case 5: return 548310 + (+matchId);
    case 6: return 598002 + (+matchId);
    case 7: return 729283 + (+matchId);
    case 8: return 829709 + (+matchId);
    case 9: return 980905 + (+matchId);
    default: return "Do noting";
  }
}

module.exports = matchMap;
