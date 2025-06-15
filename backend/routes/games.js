const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Game = require('../models/Game');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/auth');

// @route   GET api/games
// @desc    Get all games
// @access  Public
router.get('/', async (req, res) => {
  try {
    const games = await Game.find()
      .populate('team1', 'name')
      .populate('team2', 'name')
      .populate('referee', 'username')
      .sort({ scheduledTime: 1 });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/games
// @desc    Create a game
// @access  Private (Admin only)
router.post('/', [
  auth,
  [
    check('tournament', 'Tournament is required').not().isEmpty(),
    check('team1', 'Team 1 is required').not().isEmpty(),
    check('team2', 'Team 2 is required').not().isEmpty(),
    check('scheduledTime', 'Scheduled time is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newGame = new Game({
      tournament: req.body.tournament,
      team1: req.body.team1,
      team2: req.body.team2,
      scheduledTime: req.body.scheduledTime,
      referee: req.body.referee
    });

    const game = await newGame.save();
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/games/:id/score
// @desc    Update game score
// @access  Private
router.put('/:id/score', [
  auth,
  [
    check('scores', 'Scores are required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    game.scores = req.body.scores;
    game.scoreSubmittedBy = req.user.id;
    game.scoreVerified = false;

    await game.save();
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/games/:id/verify
// @desc    Verify game score
// @access  Private (Referee only)
router.put('/:id/verify', [auth, 
  checkRole(['referee', 'admin']),  // Only referees and admins can verify scores
  async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    if (game.referee.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only the assigned referee can verify this game' });
    }

    game.scoreVerified = true;
    game.scoreVerifiedBy = req.user.id;
    game.status = 'completed';

    // Determine winner
    if (game.scores.team1.total > game.scores.team2.total) {
      game.winner = game.team1;
    } else if (game.scores.team2.total > game.scores.team1.total) {
      game.winner = game.team2;
    }

    await game.save();
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
]);

module.exports = router; 