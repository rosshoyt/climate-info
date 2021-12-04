import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
// pick a date util library
import MomentUtils from '@date-io/moment';
import ClimateDataExplorer from './Components/Pages/ClimateDataExplorer';
import FoodFootprintExplorer from './Components/Pages/FoodFootprintExplorer'
import { blueGrey, orange } from '@material-ui/core/colors';
import ResponsiveMiniDrawer from './Components/Drawers/ResponsiveMiniDrawer'

 // React Query client
 const queryClient = new QueryClient()

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: blueGrey,
      secondary: orange
    },
    paper: {
      textAlign: 'left'
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <CssBaseline />
            <ResponsiveMiniDrawer darkMode={darkMode} setDarkMode={setDarkMode}>
              <ClimateDataExplorer path="/" name="Climate Data"/>
              <FoodFootprintExplorer path="/food-footprint" name="Food Footprints"/>
            </ResponsiveMiniDrawer>
          </div>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
