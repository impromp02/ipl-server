const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const matchMap = require('../helper/matchMap');
/**
 * import queries
 */

const { matchesPlayed, winType, winMargin, matchesWonByTeams } = require('../queries/season/allSeasonQuery');
const {runsScoredEachMatch, tossDecision, resultOverview} = require('../queries/season/seasonQuery');
const {runsPerOver, fallOfWickets} = require('../queries/match/matchQuery');

// **** establish DB connection ****
const mongooseOptions = {
  useNewUrlParser: true,
  poolSize: 10,
  socketTimeoutMS: 30000 * 2
};

mongoose.connect('mongodb+srv://admin:a12345678@ipl-dash-cjgek.mongodb.net/ipl-dash?retryWrites=true', mongooseOptions);
mongoose.connection.on('connected', () => console.log('** DB connected ***'))
mongoose.connection.on('error', () => console.log('** DB error **'));
const Match = mongoose.model('Match', new mongoose.Schema({}), 'matches');
const Delivery = mongoose.model('Delivery', new mongoose.Schema({}), 'deliveries');

// Route configuration
router.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*'
  });
  next();
});

// ****** routes ******
router.get('/season', function(req, res, next) {
  Promise.all([
    Match.aggregate(matchesPlayed),
    Match.aggregate(winType),
    Match.aggregate(winMargin),
    Match.aggregate(matchesWonByTeams)
  ])
    .then(result => res.json(result))
    .catch(error => next(error));
});

router.get('/season/:seasonId', function(req, res, next) {
  if(isNaN(req.params.seasonId)) {
    throw new Error('This season is not available.')
  }
  
  Promise.all([
    Match.aggregate(runsScoredEachMatch(req.params.seasonId)).option({maxTimeMS: 30000 * 2}).exec(),
    Match.aggregate(tossDecision(req.params.seasonId)).option({maxTimeMS: 30000 * 2}).exec(),
    Match.aggregate(resultOverview(req.params.seasonId)).option({maxTimeMS: 30000 * 2}).exec()
  ])
  .then(result => res.json(result))
  .catch(error => next(error));
});

router.get('/season/:seasonId/match/:matchId', function(req, res) {
  if(isNaN(req.params.matchId || req.params.seasonId)) {
    throw new Error('The match you\'re looking for is not available!');
  }
  const matchId = matchMap(req.params.seasonId, req.params.matchId);
  
  Promise.all([
    Delivery.aggregate(runsPerOver(matchId)),
    Delivery.aggregate(fallOfWickets(matchId))
  ])
  .then(result => res.json(result))
  .catch(error => next(error));
});

router.use(function(error, req, res, next) {
  console.error(error.stack);
  res.status(500).send('Oooops! Something Went Wrong!')
});

module.exports = router;