import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography } from '@material-ui/core';
import LineChart from './Charts/LineChart';
import DatePicker from './DatePicker'
import VisualizationTitle from './VisualizationTitle'
import YearPicker from '../YearPicker';
import moment from 'moment';

const MaxTempVisualization = () => {
  const [refreshChartData, setRefreshChartData] = useState(false);

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

  // the other year to compare the time series with. TODO add ability to choose more than 1 year to compare with
  const [otherYear, setOtherYear] = useState('1980');

  // Refresh the chart when component first mounts
  useEffect(() => {
    setRefreshChartData(!refreshChartData);
  }, []);

  // Hook to fetch data from the API 
  useEffect(() => {
    async function fetchData() {
      // prepare the urls
      let url1 = '/api/temperature/max/' + location + '/' + startDate + '/' + endDate;
      // assume formate of date
      let newStartDate = moment(startDate).set('year', otherYear);
      let newEndDate = moment(endDate).set('year', otherYear);
      let url2 = '/api/temperature/max/' + location + '/' + newStartDate.format("YYYY-MM-DD") + '/' + newEndDate.format("YYYY-MM-DD");

      await Promise.all([
        fetch(url1),
        fetch(url2)
      ]).then(function (responses) {
        // Get a JSON object from each of the responses
        console.log('Hello');
        return Promise.all(responses.map(function (response) {
          return response.json();
        }));
      }).then(function (data) {
        console.log(data);    
        // local list to store formatted chart data
        let cleanedData = [];
        
        data.forEach((element) => {
          cleanedData.push({
            id: element['timeRange'],
            data: processData(element['data'])
          });
        });
        setChartData(cleanedData); 
      }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
      }); 
    }

    console.log('Updating chart from useEffect!');
    fetchData();

  }, [refreshChartData]);

  // formats the data for Nivo line chart
  function processData(data) {
    let list = [];
    for (const [key, value] of Object.entries(data)) {
      let entry = { x: key, y: value };
      list.push(entry);
      //console.log(entry);
    }
    return list;
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
          <Button onClick={() => setRefreshChartData(!refreshChartData)} variant="contained" color="primary" size="large">Start</Button>
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