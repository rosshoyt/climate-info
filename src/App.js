import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Box, Grid, Container, Paper } from '@material-ui/core';
import TitleAppBar from './Components/TitleAppBar';
import MaxTempVisualization from './Components/MaxTempVisualization';
import GSOMVisualization from './Components/GSOMVisualization';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
import MomentUtils from '@date-io/moment';
import PersistentDrawerLeft from './Components/PersistentDrawerLeft';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
    paper: {
      textAlign: 'left'
    },
  });

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <div className="App">
          <PersistentDrawerLeft title="ClimateInfo.US" />
        </div>

      </Paper>
    </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
