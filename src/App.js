import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [averageTemp, setAverageTemp] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  },[]);
  
  useEffect(() => {
    fetch('/api/temperature').then(res => res.json()).then(data => {
      setAverageTemp(data.temperature);
    });
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        <p><code>Climate Change Tools</code></p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>The current time is {currentTime}.</p>
        <p>The average temperature for Seattle, WA in June 2020 was {averageTemp}°F.</p>
      </header>
    </div>
  );
}

export default App;
