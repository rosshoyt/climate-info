import React, { useState, useEffect } from 'react';
import './App.css';
import MaxTempVisualization from './Components/MaxTempVisualization';
import GSOMVisualization from './Components/GSOMVisualization';

function App() {

  return (
    <div className="App">
      <h1><code>Climate Change Tools</code></h1>
      <MaxTempVisualization/>
      <GSOMVisualization/>
    </div>
  );
}

export default App;
