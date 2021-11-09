import React, { useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

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
      <div className="App">
        <PersistentDrawerLeft title="ClimateInfo.US" />
      </div>
    </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
