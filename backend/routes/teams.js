const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// @route   GET api/teams
// @desc    Get all teams
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/teams
// @desc    Create a team
// @access  Private (Admin only)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('coach', 'Coach is required').not().isEmpty(),
    check('players', 'Players are required').isArray({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newTeam = new Team({
      name: req.body.name,
      coach: req.body.coach,
      players: req.body.players
    });

    const team = await newTeam.save();
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/teams/:id
// @desc    Update team
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('coach', 'Coach is required').not().isEmpty(),
    check('players', 'Players are required').isArray({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    team.name = req.body.name;
    team.coach = req.body.coach;
    team.players = req.body.players;

    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/teams/:id
// @desc    Delete team
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    await team.remove();
    res.json({ msg: 'Team removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 