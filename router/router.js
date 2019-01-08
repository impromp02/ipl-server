const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * import queries
 */

const { matchesPlayed, winType, winMargin, matchesWonByTeams } = require('../queries/season/allSeasonQuery');
const {runsScoredEachMatch, tossDecision, resultOverview} = require('../queries/season/seasonQuery');

// **** establish DB connection ****
const mongooseOptions = {
  useNewUrlParser: true,
};

mongoose.connect('mongodb://localhost:27017/ipl', mongooseOptions);
mongoose.connection.on('connected', () => console.log('** DB connected ***'))
mongoose.connection.on('error', () => console.log('** DB error **'));
const Match = mongoose.model('Match', new mongoose.Schema({}), 'matches');

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
    Match.aggregate(runsScoredEachMatch(req.params.seasonId)),
    Match.aggregate(tossDecision(req.params.seasonId)),
    Match.aggregate(resultOverview(req.params.seasonId))
  ])
  .then(result => res.json(result))
  .catch(error => next(error));
});

router.get('/season/:seasonId/match', function(req, res) {
  res.send('Data for a all match');
});

router.get('/season/:seasonId/match/:matchId', function(req, res) {
  res.send('Data for a particular match');
});

router.use(function(error, req, res, next) {
  console.error(error.stack);
  res.status(500).send('Oooops! Something Went Wrong!')
});

module.exports = router;