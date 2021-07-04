import React, { useState, useEffect } from 'react';
import './App.css';
import LocationSelect from './Components/LocationSelect';
import { Grid, Button } from '@material-ui/core';
import LineChart from './Components/Charts/LineChart';

function App() {
  const [averageTemp, setAverageTemp] = useState(0);

  useEffect(() => {
    fetch('/api/temperature/average').then(res => res.json()).then(data => {
      setAverageTemp(data.temperature);
    });
  }, []);

  return (
    <div className="App">
      <h1><code>Climate Change Tools</code></h1>
      <h3>The average temperature for Seattle, WA in June 2020 was {averageTemp}°F.</h3>
      <Grid container direction="row" justify="center" alignItems="stretch">
        <LocationSelect />
        <Button variant="contained" color="primary">
          Start
        </Button>
      </Grid>
      <div style={{ height: 500 }}>
        <LineChart/>
      </div>
    </div>
  );
}

export default App;
