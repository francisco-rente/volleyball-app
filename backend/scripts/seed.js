const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Game = require('../models/Game');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volleyball-tournament');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});
    await Game.deleteMany({});
    console.log('Cleared existing data');

    // Create users with more referees
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create super user for testing
    const superUser = await User.create({
      username: 'root',
      email: 'root@example.com',
      password: 'root',
      role: 'admin'
    });

    const referees = await User.create([
      {
        username: 'mike_johnson',
        email: 'mike.johnson@example.com',
        password: 'referee123',
        role: 'referee'
      },
      {
        username: 'sarah_wilson',
        email: 'sarah.wilson@example.com',
        password: 'referee123',
        role: 'referee'
      },
      {
        username: 'david_chen',
        email: 'david.chen@example.com',
        password: 'referee123',
        role: 'referee'
      },
      {
        username: 'lisa_rodriguez',
        email: 'lisa.rodriguez@example.com',
        password: 'referee123',
        role: 'referee'
      }
    ]);

    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Created users and referees');

    // Create teams
    const teams = await Team.create([
      {
        name: 'Eagles',
        coach: 'John Smith',
        players: [
          { name: 'Mike Johnson', number: 1, position: 'setter' },
          { name: 'Tom Wilson', number: 2, position: 'outside_hitter' },
          { name: 'Chris Brown', number: 3, position: 'middle_blocker' },
          { name: 'David Lee', number: 4, position: 'opposite' },
          { name: 'James White', number: 5, position: 'libero' }
        ]
      },
      {
        name: 'Hawks',
        coach: 'Sarah Davis',
        players: [
          { name: 'Alex Turner', number: 1, position: 'setter' },
          { name: 'Ryan Miller', number: 2, position: 'outside_hitter' },
          { name: 'Kevin Park', number: 3, position: 'middle_blocker' },
          { name: 'Daniel Kim', number: 4, position: 'opposite' },
          { name: 'Jason Chen', number: 5, position: 'libero' }
        ]
      },
      {
        name: 'Falcons',
        coach: 'Michael Brown',
        players: [
          { name: 'Eric Martinez', number: 1, position: 'setter' },
          { name: 'Carlos Rodriguez', number: 2, position: 'outside_hitter' },
          { name: 'Juan Garcia', number: 3, position: 'middle_blocker' },
          { name: 'Miguel Lopez', number: 4, position: 'opposite' },
          { name: 'Luis Hernandez', number: 5, position: 'libero' }
        ]
      },
      {
        name: 'Lions',
        coach: 'Emily Johnson',
        players: [
          { name: 'Robert Taylor', number: 1, position: 'setter' },
          { name: 'William Anderson', number: 2, position: 'outside_hitter' },
          { name: 'Thomas Jackson', number: 3, position: 'middle_blocker' },
          { name: 'Christopher White', number: 4, position: 'opposite' },
          { name: 'Daniel Harris', number: 5, position: 'libero' }
        ]
      },
      {
        name: 'Tigers',
        coach: 'Jessica Lee',
        players: [
          { name: 'Matthew Clark', number: 1, position: 'setter' },
          { name: 'Anthony Lewis', number: 2, position: 'outside_hitter' },
          { name: 'Mark Robinson', number: 3, position: 'middle_blocker' },
          { name: 'Donald Walker', number: 4, position: 'opposite' },
          { name: 'Steven Hall', number: 5, position: 'libero' }
        ]
      },
      {
        name: 'Bears',
        coach: 'Amanda Garcia',
        players: [
          { name: 'Paul Allen', number: 1, position: 'setter' },
          { name: 'Mark Young', number: 2, position: 'outside_hitter' },
          { name: 'James King', number: 3, position: 'middle_blocker' },
          { name: 'Robert Wright', number: 4, position: 'opposite' },
          { name: 'John Scott', number: 5, position: 'libero' }
        ]
      }
    ]);

    console.log('Created teams');

    // Create tournament
    const tournament = await Tournament.create({
      name: 'Summer Championship 2024',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-15'),
      status: 'ongoing',
      format: 'round_robin',
      location: 'City Sports Center',
      teams: teams.map(team => team._id),
      createdBy: adminUser._id
    });

    console.log('Created tournament');

    // Create games with various statuses and scores
    const games = await Game.create([
      // Completed games
      {
        tournament: tournament._id,
        team1: teams[0]._id,
        team2: teams[1]._id,
        scheduledTime: new Date('2024-06-01T10:00:00'),
        status: 'completed',
        referee: referees[0]._id,
        scores: {
          team1: {
            sets: [25, 23, 25, 25],
            total: 98
          },
          team2: {
            sets: [23, 25, 20, 23],
            total: 91
          }
        },
        scoreVerified: true,
        scoreVerifiedBy: referees[0]._id,
        winner: teams[0]._id
      },
      {
        tournament: tournament._id,
        team1: teams[2]._id,
        team2: teams[3]._id,
        scheduledTime: new Date('2024-06-01T14:00:00'),
        status: 'completed',
        referee: referees[1]._id,
        scores: {
          team1: {
            sets: [25, 25, 23, 25],
            total: 98
          },
          team2: {
            sets: [20, 23, 25, 23],
            total: 91
          }
        },
        scoreVerified: true,
        scoreVerifiedBy: referees[1]._id,
        winner: teams[2]._id
      },
      // Ongoing games
      {
        tournament: tournament._id,
        team1: teams[4]._id,
        team2: teams[5]._id,
        scheduledTime: new Date('2024-06-02T10:00:00'),
        status: 'in_progress',
        referee: referees[2]._id,
        scores: {
          team1: {
            sets: [25, 23, 25],
            total: 73
          },
          team2: {
            sets: [23, 25, 20],
            total: 68
          }
        },
        scoreVerified: false
      },
      {
        tournament: tournament._id,
        team1: teams[0]._id,
        team2: teams[2]._id,
        scheduledTime: new Date('2024-06-02T14:00:00'),
        status: 'in_progress',
        referee: referees[3]._id,
        scores: {
          team1: {
            sets: [25, 25],
            total: 50
          },
          team2: {
            sets: [23, 20],
            total: 43
          }
        },
        scoreVerified: false
      },
      // Scheduled games
      {
        tournament: tournament._id,
        team1: teams[1]._id,
        team2: teams[3]._id,
        scheduledTime: new Date('2024-06-03T10:00:00'),
        status: 'scheduled',
        referee: referees[0]._id
      },
      {
        tournament: tournament._id,
        team1: teams[4]._id,
        team2: teams[0]._id,
        scheduledTime: new Date('2024-06-03T14:00:00'),
        status: 'scheduled',
        referee: referees[1]._id
      },
      {
        tournament: tournament._id,
        team1: teams[5]._id,
        team2: teams[2]._id,
        scheduledTime: new Date('2024-06-04T10:00:00'),
        status: 'scheduled',
        referee: referees[2]._id
      },
      {
        tournament: tournament._id,
        team1: teams[3]._id,
        team2: teams[4]._id,
        scheduledTime: new Date('2024-06-04T14:00:00'),
        status: 'scheduled',
        referee: referees[3]._id
      },
      // More completed games with different scores
      {
        tournament: tournament._id,
        team1: teams[1]._id,
        team2: teams[5]._id,
        scheduledTime: new Date('2024-06-05T10:00:00'),
        status: 'completed',
        referee: referees[0]._id,
        scores: {
          team1: {
            sets: [25, 25, 25],
            total: 75
          },
          team2: {
            sets: [20, 22, 23],
            total: 65
          }
        },
        scoreVerified: true,
        scoreVerifiedBy: referees[0]._id,
        winner: teams[1]._id
      },
      {
        tournament: tournament._id,
        team1: teams[3]._id,
        team2: teams[0]._id,
        scheduledTime: new Date('2024-06-05T14:00:00'),
        status: 'completed',
        referee: referees[1]._id,
        scores: {
          team1: {
            sets: [25, 23, 25, 23, 15],
            total: 111
          },
          team2: {
            sets: [23, 25, 23, 25, 13],
            total: 109
          }
        },
        scoreVerified: true,
        scoreVerifiedBy: referees[1]._id,
        winner: teams[3]._id
      }
    ]);

    console.log('Created games');

    // Update tournament with games
    tournament.games = games.map(game => game._id);
    await tournament.save();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();