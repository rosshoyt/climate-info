import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Box, Grid, Container, Paper } from '@material-ui/core';
import TitleAppBar from './Components/TitleAppBar';
import MaxTempVisualization from './Components/MaxTempVisualization';
import GSOMVisualization from './Components/GSOMVisualization';

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
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <div className="App">
          <TitleAppBar title="ClimateInfo.US" darkMode={darkMode} setDarkMode={setDarkMode} />
          <Container maxWidth="xl">
            <Grid container direction="column">
              <Box m={5} >
                <MaxTempVisualization />
              </Box>
              <Box m={5} >
                <GSOMVisualization />
              </Box>
            </Grid>
          </Container>
        </div>

      </Paper>
    </ThemeProvider>
  );
}

export default App;
