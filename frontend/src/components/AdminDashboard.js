import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  SportsVolleyball as GamesIcon,
  EmojiEvents as TournamentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import UserManagement from './admin/UserManagement';
import GameScheduler from './admin/GameScheduler';
import TournamentManager from './admin/TournamentManager';
import SystemSettings from './admin/SystemSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <UserManagement />;
      case 1:
        return <GameScheduler />;
      case 2:
        return <TournamentManager />;
      case 3:
        return <SystemSettings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<PeopleIcon />}
              label="User Management"
              iconPosition="start"
            />
            <Tab
              icon={<GamesIcon />}
              label="Game Scheduler"
              iconPosition="start"
            />
            <Tab
              icon={<TournamentIcon />}
              label="Tournament Manager"
              iconPosition="start"
            />
            <Tab
              icon={<SettingsIcon />}
              label="System Settings"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default AdminDashboard; 