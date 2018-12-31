const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * import queries
 */

const { matchesPlayed, winType, winMargin } = require('../queries/season/seasonQuery');

// **** establish DB connection ****
const mongooseOptions = {
  useNewUrlParser: true,
};

mongoose.connect('mongodb://localhost:27017/ipl', mongooseOptions);
mongoose.connection.on('connected', () => console.log('** DB connected ***'))
mongoose.connection.on('error', () => console.log('** DB error **'));
const Match = mongoose.model('Match', new mongoose.Schema({}), 'matches');

// ****** routes ******
router.get('/season', function(req, res) {
  Promise.all([
    Match.aggregate(matchesPlayed),
    Match.aggregate(winType),
    Match.aggregate(winMargin)
  ])
    .then(result => res.json(result))
    .catch(error => res.send(error));
});

router.get('/season/:seasonId', function(req, res) {
  console.log(req.params.seasonId);
  res.send('season Id wala')
});

router.get('/season/:seasonId/match', function(req, res) {
  res.send('season me all match details');
});

router.get('/season/:seasonId/match/:matchId', function(req, res) {
  res.send('season me particular matcah details');
});

module.exports = router;