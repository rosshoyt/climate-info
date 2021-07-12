import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import TitleAppBar from './Components/TitleAppBar';
import MaxTempVisualization from './Components/MaxTempVisualization';
import GSOMVisualization from './Components/GSOMVisualization';

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
          <TitleAppBar title="ClimateInfo.us" darkMode={darkMode} setDarkMode={setDarkMode}/>
          <MaxTempVisualization/>
          <GSOMVisualization/>   
        </div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
