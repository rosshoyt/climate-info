import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography } from '@material-ui/core';
import LineChart from './Charts/LineChart';
import DatePicker from './DatePicker'
import VisualizationTitle from './VisualizationTitle'
import YearPicker from '../YearPicker';

const MaxTempVisualization = () => {
  const [chartData, setChartData] = useState([
    {
      id: "First",
      color: "hsl(221, 70%, 50%)",
      data: [
        {
          x: 0,
          y: 0
        },
        {
          x: 1,
          y: 0
        }
      ]
    }
  ]);

  const [location, setLocation] = useState('CITY:US530018');
  const [startDate, setStartDate] = useState('2021-06-01')
  const [endDate, setEndDate] = useState('2021-06-30')

  const [otherYear, setOtherYear] = useState('1980');

  // Fill the graph when component mounts, using the default query values
  useEffect(() => {
    updateChart();
  }, []);

  function updateChart() {
    console.log('Updating chart!');
    let url = '/api/temperature/max/' + location + '/' + startDate + '/' + endDate;
    fetch(url).then(res => res.json()).then(recData => {
      let formattedList = [];
      for (const [key, value] of Object.entries(recData)) {
        formattedList.push({ x: key, y: value });
      }
      setChartData([{
        id: startDate + " - " + endDate,
        color: "hsl(175, 70%, 50%)",
        data: formattedList
      }]);

    });
  }



  return (
    <>

      <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <VisualizationTitle title="Average Max Temperature" />
        </Grid>
        <Grid item xs={5}>
          <LocationSelect setLocation={setLocation} />
        </Grid>
        <Grid item xs={1}>
          <Button onClick={updateChart} variant="contained" color="primary" size="large">Start</Button>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="h5">Time Series</Typography>
        </Grid>
        <Grid item xs={3}>
          <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        </Grid>
        <Grid item xs={3}>
          <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        </Grid>
        <Grid item xs={4}>

        </Grid>

        <Grid item xs={2}>
          <Typography noWrap variant="h5">Compare to</Typography>
        </Grid>
        <Grid item xs={3}>
          <YearPicker handleDateChange={setOtherYear} />
        </Grid>
        <Grid item xs={7}>

        </Grid>

      </Grid>
      <Grid container direction="row" justify="left" alignItems="stretch">




      </Grid>


      <div style={{ height: 500 }}>
        <LineChart data={chartData} />
      </div>
    </>
  );
}

export default MaxTempVisualization;