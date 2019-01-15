const runsPerOver = (matchId) => [
  {
    '$match': {
      'Match_Id': matchId
    }
  }, {
    '$project': {
      '_id': 0, 
      'Match_Id': 1, 
      'Innings_Id': 1, 
      'Over_Id': 1, 
      'Team_Batting_Id': 1, 
      'Batsman_Scored': 1, 
      'Extra_Runs': {
        '$cond': {
          'if': {
            '$ne': [
              '$Extra_Runs', ''
            ]
          }, 
          'then': '$Extra_Runs', 
          'else': 0
        }
      }
    }
  }, {
    '$project': {
      'Match_Id': 1, 
      'Innings_Id': 1, 
      'Over_Id': 1, 
      'Team_Batting_Id': 1, 
      'runs': {
        '$add': [
          '$Batsman_Scored', '$Extra_Runs'
        ]
      }
    }
  }, {
    '$group': {
      '_id': {
        'teamId': '$Team_Batting_Id', 
        'over': '$Over_Id'
      }, 
      'runs': {
        '$sum': '$runs'
      }, 
      'InnId': {
        '$first': '$Innings_Id'
      }
    }
  }, {
    '$sort': {
      'InnId': 1, 
      '_id.over': 1
    }
  }
];

const fallOfWickets = (matchId) => [
  {
    '$match': {
      'Match_Id': matchId,
      'Player_dissimal_Id': {
        '$ne': ''
      }
    }
  }, {
    '$project': {
      '_id': 0, 
      'Match_Id': 1, 
      'Player_dissimal_Id': 1, 
      'Over_Id': 1, 
      'Dissimal_Type': 1, 
      'Team_Batting_Id': 1
    }
  }
];

module.exports = {
  runsPerOver,
  fallOfWickets
}