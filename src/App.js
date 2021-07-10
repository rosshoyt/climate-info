import React, { useState, useEffect } from 'react';
import './App.css';
import MaxTempVisualization from './Components/MaxTempVisualization';

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
      <MaxTempVisualization/ >
    </div>
  );
}

export default App;
