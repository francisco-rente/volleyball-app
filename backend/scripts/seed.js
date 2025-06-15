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

    // Create users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    const refereeUser = await User.create({
      username: 'referee',
      email: 'referee@example.com',
      password: await bcrypt.hash('referee123', 10),
      role: 'referee'
    });

    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    });

    console.log('Created users');

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
      }
    ]);

    console.log('Created teams');

    // Create tournament
    const tournament = await Tournament.create({
      name: 'Summer Championship 2024',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-15'),
      status: 'upcoming',
      format: 'round_robin',
      location: 'City Sports Center',
      teams: teams.map(team => team._id),
      createdBy: adminUser._id
    });

    console.log('Created tournament');

    // Create games
    const games = await Game.create([
      {
        tournament: tournament._id,
        team1: teams[0]._id,
        team2: teams[1]._id,
        scheduledTime: new Date('2024-06-01T10:00:00'),
        status: 'scheduled',
        referee: refereeUser._id
      },
      {
        tournament: tournament._id,
        team1: teams[1]._id,
        team2: teams[2]._id,
        scheduledTime: new Date('2024-06-02T14:00:00'),
        status: 'scheduled',
        referee: refereeUser._id
      },
      {
        tournament: tournament._id,
        team1: teams[0]._id,
        team2: teams[2]._id,
        scheduledTime: new Date('2024-06-03T16:00:00'),
        status: 'scheduled',
        referee: refereeUser._id
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