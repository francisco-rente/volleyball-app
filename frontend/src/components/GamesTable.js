import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
  Box,
  CircularProgress,
  Chip,
  Collapse,
  useTheme,
  useMediaQuery,
  Grid,
  Divider,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { format } from 'date-fns';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SportsVolleyball as VolleyballIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

const GamesTable = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGame, setExpandedGame] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/games', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

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

  const handleExpandClick = (gameId) => {
    setExpandedGame(expandedGame === gameId ? null : gameId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredGames = games.filter(game => {
    const searchLower = searchTerm.toLowerCase();
    return (
      game.team1?.name.toLowerCase().includes(searchLower) ||
      game.team2?.name.toLowerCase().includes(searchLower) ||
      game.tournament?.name.toLowerCase().includes(searchLower) ||
      game.field?.name.toLowerCase().includes(searchLower)
    );
  });

  const paginatedGames = filteredGames.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const renderMobileView = () => (
    <Grid container spacing={2}>
      {filteredGames.map((game) => (
        <Grid item xs={12} key={game._id}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {game.team1?.name} vs {game.team2?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(game.scheduledTime), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Field: {game.field?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tournament: {game.tournament?.name}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Chip
                    label={game.status}
                    color={getStatusColor(game.status)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Referee: {game.referee?.username}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center" my={2}>
                <Typography variant="h5" component="div">
                  {game.scores ? (
                    `${game.scores.team1.total} - ${game.scores.team2.total}`
                  ) : (
                    'Not played'
                  )}
                </Typography>
              </Box>

              <Collapse in={expandedGame === game._id} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Set Scores
                </Typography>
                <Grid container spacing={1}>
                  {game.scores?.sets?.map((set, index) => (
                    <Grid item xs={12} key={index}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Set {index + 1}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">{set.team1}</Typography>
                          <VolleyballIcon fontSize="small" color="action" />
                          <Typography variant="body2">{set.team2}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )) || (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        No set scores available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Collapse>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                onClick={() => handleExpandClick(game._id)}
                aria-expanded={expandedGame === game._id}
                aria-label="show more"
              >
                {expandedGame === game._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTabletView = () => (
    <Box>
      {paginatedGames.map((game) => (
        <Accordion
          key={game._id}
          expanded={expandedGame === game._id}
          onChange={() => handleExpandClick(game._id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" component="div">
                  {game.team1?.name} vs {game.team2?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(game.scheduledTime), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={game.status}
                  color={getStatusColor(game.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {game.scores ? (
                    `${game.scores.team1.total} - ${game.scores.team2.total}`
                  ) : (
                    'Not played'
                  )}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Tournament</TableCell>
                    <TableCell>Referee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{game.field?.name}</TableCell>
                    <TableCell>{game.tournament?.name}</TableCell>
                    <TableCell>{game.referee?.username}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Set Scores
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Set</TableCell>
                      <TableCell align="right">{game.team1?.name}</TableCell>
                      <TableCell align="right">{game.team2?.name}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {game.scores?.sets?.map((set, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          Set {index + 1}
                        </TableCell>
                        <TableCell align="right">{set.team1}</TableCell>
                        <TableCell align="right">{set.team2}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No set scores available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredGames.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );

  const renderDesktopView = () => (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="games table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Date & Time</TableCell>
              <TableCell>Tournament</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Team 1</TableCell>
              <TableCell>Team 2</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Referee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGames.map((game) => (
              <React.Fragment key={game._id}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <IconButton
                      size="small"
                      onClick={() => handleExpandClick(game._id)}
                    >
                      {expandedGame === game._id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {format(new Date(game.scheduledTime), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{game.tournament?.name}</TableCell>
                  <TableCell>{game.field?.name}</TableCell>
                  <TableCell>{game.team1?.name}</TableCell>
                  <TableCell>{game.team2?.name}</TableCell>
                  <TableCell>
                    {game.scores ? (
                      `${game.scores.team1.total} - ${game.scores.team2.total}`
                    ) : (
                      'Not played'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={game.status}
                      color={getStatusColor(game.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{game.referee?.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={expandedGame === game._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Set Scores
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Set</TableCell>
                              <TableCell align="right">{game.team1?.name}</TableCell>
                              <TableCell align="right">{game.team2?.name}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {game.scores?.sets?.map((set, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  Set {index + 1}
                                </TableCell>
                                <TableCell align="right">{set.team1}</TableCell>
                                <TableCell align="right">{set.team2}</TableCell>
                              </TableRow>
                            )) || (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  No set scores available
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredGames.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search games"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: isMobile ? '100%' : 300 }}
        />
        <IconButton onClick={fetchGames} color="primary" sx={{ ml: isMobile ? 1 : 0 }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {isMobile ? renderMobileView() : isTablet ? renderTabletView() : renderDesktopView()}
    </Box>
  );
};

export default GamesTable; 