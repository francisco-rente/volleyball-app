import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  SportsVolleyball as VolleyballIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const GameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }

      const gameData = await response.json();
      setGame(gameData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatScore = (scores) => {
    if (!scores || !scores.team1 || !scores.team2) {
      return 'No scores available';
    }
    
    const team1Sets = scores.team1.sets.join('-');
    const team2Sets = scores.team2.sets.join('-');
    return `${team1Sets} | ${team2Sets}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Game not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Game Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Game Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                {game.team1?.name} vs {game.team2?.name}
              </Typography>
              <Chip
                label={game.status}
                color={getStatusColor(game.status)}
                size="large"
              />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {game.tournament?.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {new Date(game.scheduledTime).toLocaleString()}
                  </Typography>
                </Box>
                {game.location && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {game.location}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Referee: {game.referee?.username || 'TBD'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Teams and Scores */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {game.team1?.name}
              </Typography>
              <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                <VolleyballIcon />
              </Avatar>
              {game.scores?.team1 && (
                <Box>
                  <Typography variant="h4" color="primary">
                    {game.scores.team1.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Points
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Sets: {game.scores.team1.sets.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {game.team2?.name}
              </Typography>
              <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                <VolleyballIcon />
              </Avatar>
              {game.scores?.team2 && (
                <Box>
                  <Typography variant="h4" color="primary">
                    {game.scores.team2.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Points
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Sets: {game.scores.team2.sets.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Game Statistics */}
        {game.scores && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Game Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Final Score
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatScore(game.scores)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Winner
                  </Typography>
                  <Typography variant="h6">
                    {game.winner ? 
                      (game.winner === game.team1?._id ? game.team1.name : game.team2.name) :
                      'TBD'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Score Verified
                  </Typography>
                  <Chip
                    label={game.scoreVerified ? 'Yes' : 'No'}
                    color={game.scoreVerified ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Team Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {game.team1?.name} - Players
            </Typography>
            <List>
              {game.team1?.players?.map((player, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={player.name}
                    secondary={`#${player.number} - ${player.position}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {game.team2?.name} - Players
            </Typography>
            <List>
              {game.team2?.players?.map((player, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={player.name}
                    secondary={`#${player.number} - ${player.position}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameDetails; 