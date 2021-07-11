import React, { useState, useEffect } from 'react';
import './App.css';
import MaxTempVisualization from './Components/MaxTempVisualization';
import GSOMVisualization from './Components/GSOMVisualization';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Switch, Typography, Paper } from '@material-ui/core';
import TitleAppBar from './Components/TitleAppBar';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <div className="App">
          <TitleAppBar title="ClimateInfo.us"/>
          <MaxTempVisualization />
          <GSOMVisualization />
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
