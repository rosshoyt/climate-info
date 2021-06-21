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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>
        <p>The average temperature for Seattle, WA in June 2020 was {averageTemp}°F.</p>
      </header>
    </div>
  );
}

export default App;
