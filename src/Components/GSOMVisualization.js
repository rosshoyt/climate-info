import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import LocationSelect from './LocationSelect';
import VisualizationTitle from './VisualizationTitle';
import YearPicker from './YearPicker';
import ScatterPlotChart from './Charts/ScatterPlotChart';

const GSOMVisualization = () => {
  const [dataType, setDataType] = useState('TAVG');

  const [location, setLocation] = useState('CITY:US530018');

  const [chartData, setChartData] = useState()

  // TODO create year/date selector component
  const [year1, setYear1] = useState(2021);
  const [year2, setYear2] = useState(1991);
  
  const[refreshChartData, setRefreshChartData] = useState(false);

  function updateData() {
    // Clear chart data
    setChartData({})
    // TODO show loading icon
    
    // Fetch Data TODO fetch for each selected year in UI, and each month of each year instead of just January
    console.log('GSOM Visualization fetching data... year1/2 = ', year1, year2);
    const url = '/api/gsom/' + dataType + '/' + location + '/' + year1 +'-01-01/' + year1 + '-12-31';
    console.log('Updating data, fetching ' + url);
     
    fetch(url).then(res => res.json()).then(recData => {
      // TODO if more queries added, maybe only do once all additional data is collected
      // Or, could add data to chart as it comes in
      processData(recData); 
    });
  }

  function processData(data) {
    const results = data['results'];

    results.forEach(r => {
      console.log(r);
    });

    // expected format:
    // {
    //   "id": "group A",
    //   "data": [
    //     {
    //       "x": 15,
    //       "y": 81
    //     },
  }

  useEffect(() => {
    updateData();
  }, [refreshChartData]);


  
  return (
    <>
      <Grid container direction="column" justifyContent="space-between" alignItems="center">
        <VisualizationTitle title="Global Summary of the Month API"/>
        <LocationSelect setLocation={setLocation} />
        <YearPicker label="Year 1" initialYear={year1} handleDateChange={setYear1} />
        <YearPicker label="Year 2" initialYear={year2} handleDateChange={setYear2} />
        <Button variant="contained" color="primary" size="large" onClick={() => setRefreshChartData(!refreshChartData)}>
            Update Chart
        </Button>
        <div style={{ height: 500, width: 700 }}>
          <ScatterPlotChart />
        </div>
      </Grid>
    </>
  );
}

export default GSOMVisualization; 