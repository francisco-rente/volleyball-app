import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  SportsVolleyball as VolleyballIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [userGames, setUserGames] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user's games and teams (this would need backend endpoints)
      // For now, we'll use mock data
      setUserGames([
        {
          id: 1,
          tournament: 'Summer Championship 2024',
          team1: 'Eagles',
          team2: 'Hawks',
          date: '2024-06-01',
          status: 'completed',
          result: 'Won 3-1'
        },
        {
          id: 2,
          tournament: 'Summer Championship 2024',
          team1: 'Eagles',
          team2: 'Falcons',
          date: '2024-06-03',
          status: 'scheduled',
          result: 'Upcoming'
        }
      ]);

      setUserTeams([
        {
          id: 1,
          name: 'Eagles',
          position: 'Player',
          number: 10
        }
      ]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Chip 
                  label={user.role} 
                  color={user.role === 'admin' ? 'error' : 'primary'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<VolleyballIcon />} label="My Games" />
              <Tab icon={<TrophyIcon />} label="My Teams" />
              <Tab icon={<ScheduleIcon />} label="Upcoming" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    My Games
                  </Typography>
                  <List>
                    {userGames.map((game) => (
                      <ListItem key={game.id} divider>
                        <ListItemAvatar>
                          <Avatar>
                            <VolleyballIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${game.team1} vs ${game.team2}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {game.tournament}
                              </Typography>
                              {` — ${game.date} — ${game.result}`}
                            </>
                          }
                        />
                        <Chip
                          label={game.status}
                          color={game.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    My Teams
                  </Typography>
                  <Grid container spacing={2}>
                    {userTeams.map((team) => (
                      <Grid item xs={12} sm={6} key={team.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{team.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Position: {team.position}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Number: {team.number}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Events
                  </Typography>
                  <List>
                    {userGames.filter(game => game.status === 'scheduled').map((game) => (
                      <ListItem key={game.id} divider>
                        <ListItemAvatar>
                          <Avatar>
                            <ScheduleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${game.team1} vs ${game.team2}`}
                          secondary={`${game.tournament} — ${game.date}`}
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          component={Link}
                          to={`/game/${game.id}`}
                        >
                          View Details
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard; 