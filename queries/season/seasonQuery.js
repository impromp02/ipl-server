const runsScoredEachMatch = (seasonId) => {
  return [
    {
      $match: {
        Season_Id: seasonId, 
        Match_Id: {
          $exists: true, 
          $ne: null
        }
      }
    }, {
      $project: {
        Match_Id: 1, 
        Team_Name_Id: 1, 
        Opponent_Team_Id: 1, 
        Season_Id: 1, 
        Toss_Winner_Id: 1, 
        Toss_Decision: 1
      }
    }, {
      $lookup: {
        from: "deliveries", 
        let: {
          game_id: "$Match_Id"
        }, 
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  "$Match_Id", "$$game_id"
                ]
              }
            }
          }, {
            $match: {
              Batsman_Scored: {
                $ne: null
              }
            }
          }, {
            $match: {
              Batsman_Scored: {
                $ne: " "
              }
            }
          }, {
            $match: {
              Batsman_Scored: {
                $ne: "Do_nothing"
              }
            }
          }, {
            $project: {
              Innings_Id: 1, 
              Batsman_Scored: {
                $toInt: "$Batsman_Scored"
              }, 
              Extra_Runs: 1
            }
          }, {
            $group: {
              _id: "$Innings_Id", 
              runs: {
                $sum: "$Batsman_Scored"
              }
            }
          }
        ], 
        as: "score"
      }
    }
  ];
}

const tossDecision = (seasonId) => {
  return [
    {
      $match: {
        Season_Id: seasonId
      }
    }, {
      $group: {
        _id: "$Toss_Decision", 
        count: {
          $sum: 1
        }
      }
    }
  ];
}; 

const resultOverview = (seasonId) => {
  return [
    {
      $match: {
        Season_Id: seasonId
      }
    }, {
      $facet: {
        wintype: [
          {
            $group: {
              _id: "$Win_Type", 
              count: {
                $sum: 1
              }
            }
          }, {
            $match: {
              $or: [{_id: "by runs"}, {_id: "by wickets"}]
            }
          }
        ], 
        dw: [
          {
            $match: {
              Is_DuckWorthLewis: "1"
            }
          }, {
            $group: {
              _id: "dw", 
              count: {
                $sum: 1
              }
            }
          }
        ], 
        superOver: [
          {
            $group: {
              _id: "$IS_Superover", 
              count: {
                $sum: 1
              }
            }
          }, {
            $match: {
              $or: [
                {
                  _id: "field"
                }, {
                  _id: "bat"
                }, {
                  _id: "1"
                }
              ]
            }
          }, {
            $group: {
              _id: "superOver", 
              count: {
                $sum: "$count"
              }
            }
          }
        ]
      }
    }, {
      $project: {
        resultStats: {$concatArrays: ["$wintype", "$dw", "$superOver"]} 
      }
    }, {
      $unwind: {
        path: "$resultStats"
      }
    }, {
      $group: {
        _id: "$resultStats._id",
        count: {$sum: "$resultStats.count"}
      }
    }
  ];
};

module.exports = {
  runsScoredEachMatch,
  tossDecision,
  resultOverview
}