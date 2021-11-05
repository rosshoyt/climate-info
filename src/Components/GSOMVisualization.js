import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import LocationSelect from './LocationSelect';
import VisualizationTitle from './VisualizationTitle';
import YearPicker from './YearPicker';

const GSOMVisualization = () => {
  const [dataType, setDataType] = useState('TAVG');

  const [location, setLocation] = useState('CITY:US530018');

  // const [startDate, setStartDate] = useState('2021-06-01');

  // const [endDate, setEndDate] = useState('2021-06-02');

  // TODO create year/date selector component
  const [year1, setYear1] = useState(2021);
  const [year2, setYear2] = useState(1991);
  
  const[refreshChartData, setRefreshChartData] = useState(false);

  // An example statistic from the GSOM api
  const [averageTemp, setAverageTemp] = useState(0);

  function updateData() {
    console.log('GSOM Visualization fetching data... year1/2 = ', year1, year2)
    const url = '/api/gsom/' + dataType + '/' + location + '/' + year1 +'-01-01/' + year1 + '-12-31';
    console.log('Updating data, fetching ' + url);
    fetch(url).then(res => res.json()).then(recData => {
      console.log(recData);
    });
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
      </Grid>


      {/*<h3>[Placeholder API usage]:The average temperature for Seattle, WA in June 2021 was {averageTemp}°F.</h3>
       <Grid container direction="row" justify="center" alignItems="stretch">
        <LocationSelect setLocation={setLocation} />
        <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        <Button onClick={updateChart} variant="contained" color="primary">
          Start
        </Button>
      </Grid> 
      <div style={{ height: 500 }}>
        <LineChart data={chartData} />
      </div>*/}
    </>
  );
}

export default GSOMVisualization;