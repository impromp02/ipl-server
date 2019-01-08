const matchesPlayed = [
  {
    $match: {
      $and: [
        {"Team_Name_Id": { $exists: true, $ne: null }},
        {"Opponent_Team_Id": { $exists: true, $ne: null }},
      ]
    }
  }, {
    $facet: {
      InnOne: [
        {
          $group: {
            _id: "$Team_Name_Id", 
            matches: {
              $sum: 1
            }
          }
        }
      ], 
      InnTwo: [
        {
          $group: {
            _id: "$Opponent_Team_Id", 
            matches: {
              $sum: 1
            }
          }
        }
      ]
    }
  }, {
    $project: {
      allMatches: {
        $concatArrays: [
          "$InnOne", "$InnTwo"
        ]
      }
    }
  }, {
    $unwind: {
      path: "$allMatches"
    }
  }, {
    $group: {
      _id: "$allMatches._id", 
      totalMatches: {
        $sum: "$allMatches.matches"
      }
    }
  },
  {
    $project: {
      _id: {
        $toInt: "$_id"
      },
      value: "$totalMatches"
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
];

const winType = [
  {
    $match: { "Win_Type": {$exists: true, $ne: null}}
  },{
    $group: {
      _id: "$Win_Type", 
      value: {
        $sum: 1
      }
    }
  }
];

const winMargin = [
  {
    $match: {
      $and: [
        {
          Win_Type: "by runs"
        }, {
          Won_By: {
            $exists: 1, 
            $ne: null
          }
        }
      ]
    }
  }, {
    $project: {
      season: {
        $toInt: "$Season_Id"
      }, 
      wonBy: {
        $toInt: "$Won_By"
      }
    }
  }, {
    $group: {
      _id: "$season", 
      avgMargin: {
        $avg: "$wonBy"
      }
    }
  }, {
    $project: {
      _id: 1, 
      value: {
        $floor: "$avgMargin"
      }
    }
  }, {
    $sort: {
      _id: 1
    }
  }
];

const matchesWonByTeams = [
  {
    $match: { "Match_Winner_Id": {$exists: true, $ne: null}}
  },{
    $group: {
      _id: "$Match_Winner_Id", 
      value: {
        $sum: 1
      }
    }
  }, {
    $match: {
      "_id": {$ne: "NULL"} 
    }
  },{
    $match: {
      "_id": {$ne: ""} 
    }
  }
];

module.exports = {
  matchesPlayed,
  winType,
  winMargin,
  matchesWonByTeams
};