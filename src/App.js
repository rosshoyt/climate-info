import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
import MomentUtils from '@date-io/moment';
import ClimateDataExplorer from './Components/ClimateDataExplorer';
import TitleAppBar from './Components/TitleAppBar';

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
      
      <div className="App">
        <CssBaseline />
        <TitleAppBar title="ClimateInfo.US" darkMode={darkMode} setDarkMode={setDarkMode}/>
        <ClimateDataExplorer />
      </div>
    </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
