const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Tournament = require('../models/Tournament');
const auth = require('../middleware/auth');

// @route   GET api/tournaments
// @desc    Get all tournaments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('teams', 'name')
      .sort({ startDate: -1 });
    res.json(tournaments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tournaments
// @desc    Create a tournament
// @access  Private (Admin only)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty(),
    check('format', 'Format is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newTournament = new Tournament({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      format: req.body.format,
      location: req.body.location,
      createdBy: req.user.id
    });

    const tournament = await newTournament.save();
    res.json(tournament);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tournaments/:id/teams
// @desc    Add teams to tournament
// @access  Private (Admin only)
router.put('/:id/teams', [
  auth,
  [
    check('teams', 'Teams are required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ msg: 'Tournament not found' });
    }

    tournament.teams = req.body.teams;
    await tournament.save();
    res.json(tournament);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tournaments/:id/status
// @desc    Update tournament status
// @access  Private (Admin only)
router.put('/:id/status', [
  auth,
  [
    check('status', 'Status is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ msg: 'Tournament not found' });
    }

    tournament.status = req.body.status;
    await tournament.save();
    res.json(tournament);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 