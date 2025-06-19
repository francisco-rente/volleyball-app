import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    tournamentSettings: {
      maxTeams: 16,
      minTeams: 4,
      defaultFormat: 'round_robin',
      allowRegistration: true
    },
    gameSettings: {
      setsToWin: 3,
      pointsPerSet: 25,
      tiebreakPoints: 15,
      allowOvertime: true
    },
    userSettings: {
      allowSelfRegistration: true,
      requireEmailVerification: false,
      defaultUserRole: 'user'
    },
    systemSettings: {
      maintenanceMode: false,
      debugMode: false,
      maxFileSize: 5
    }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSuccess('Settings saved successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      fetchSettings();
    }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          System Settings
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Tournament Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tournament Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Teams"
                    type="number"
                    value={settings.tournamentSettings.maxTeams}
                    onChange={(e) => setSettings({
                      ...settings,
                      tournamentSettings: {
                        ...settings.tournamentSettings,
                        maxTeams: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Teams"
                    type="number"
                    value={settings.tournamentSettings.minTeams}
                    onChange={(e) => setSettings({
                      ...settings,
                      tournamentSettings: {
                        ...settings.tournamentSettings,
                        minTeams: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Default Format</InputLabel>
                    <Select
                      value={settings.tournamentSettings.defaultFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        tournamentSettings: {
                          ...settings.tournamentSettings,
                          defaultFormat: e.target.value
                        }
                      })}
                      label="Default Format"
                    >
                      <MenuItem value="round_robin">Round Robin</MenuItem>
                      <MenuItem value="single_elimination">Single Elimination</MenuItem>
                      <MenuItem value="double_elimination">Double Elimination</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.tournamentSettings.allowRegistration}
                        onChange={(e) => setSettings({
                          ...settings,
                          tournamentSettings: {
                            ...settings.tournamentSettings,
                            allowRegistration: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Allow Team Registration"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Game Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Game Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Sets to Win"
                    type="number"
                    value={settings.gameSettings.setsToWin}
                    onChange={(e) => setSettings({
                      ...settings,
                      gameSettings: {
                        ...settings.gameSettings,
                        setsToWin: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Points per Set"
                    type="number"
                    value={settings.gameSettings.pointsPerSet}
                    onChange={(e) => setSettings({
                      ...settings,
                      gameSettings: {
                        ...settings.gameSettings,
                        pointsPerSet: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tiebreak Points"
                    type="number"
                    value={settings.gameSettings.tiebreakPoints}
                    onChange={(e) => setSettings({
                      ...settings,
                      gameSettings: {
                        ...settings.gameSettings,
                        tiebreakPoints: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.gameSettings.allowOvertime}
                        onChange={(e) => setSettings({
                          ...settings,
                          gameSettings: {
                            ...settings.gameSettings,
                            allowOvertime: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Allow Overtime"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* User Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.userSettings.allowSelfRegistration}
                        onChange={(e) => setSettings({
                          ...settings,
                          userSettings: {
                            ...settings.userSettings,
                            allowSelfRegistration: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Allow Self Registration"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.userSettings.requireEmailVerification}
                        onChange={(e) => setSettings({
                          ...settings,
                          userSettings: {
                            ...settings.userSettings,
                            requireEmailVerification: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Require Email Verification"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Default User Role</InputLabel>
                    <Select
                      value={settings.userSettings.defaultUserRole}
                      onChange={(e) => setSettings({
                        ...settings,
                        userSettings: {
                          ...settings.userSettings,
                          defaultUserRole: e.target.value
                        }
                      })}
                      label="Default User Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="referee">Referee</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.systemSettings.maintenanceMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          systemSettings: {
                            ...settings.systemSettings,
                            maintenanceMode: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Maintenance Mode"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.systemSettings.debugMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          systemSettings: {
                            ...settings.systemSettings,
                            debugMode: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Debug Mode"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Max File Size (MB)"
                    type="number"
                    value={settings.systemSettings.maxFileSize}
                    onChange={(e) => setSettings({
                      ...settings,
                      systemSettings: {
                        ...settings.systemSettings,
                        maxFileSize: parseInt(e.target.value)
                      }
                    })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettings; 