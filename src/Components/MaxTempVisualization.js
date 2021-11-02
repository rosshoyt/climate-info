import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography } from '@material-ui/core';
import LineChart from './Charts/LineChart';
import DatePicker from './DatePicker'
import YearPicker from './YearPicker';
import moment from 'moment';
import InfoTooltip from './InfoTooltip'
import useStore from '../store'

const MaxTempVisualization = () => {
  const [refreshChartData, setRefreshChartData] = useState(false);

  const [location, setLocation] = useState('CITY:US530018');
  const [startDate, setStartDate] = useState('2021-06-01')
  const [endDate, setEndDate] = useState('2021-06-30')

  // the other year to compare the time series with. TODO add ability to choose more than 1 year to compare with
  const [otherYear, setOtherYear] = useState('1980');

  const setTimeseriesData = useStore(state => state.setTimeseriesData);

  function getRequestURLs(){
      // prepare the urls TODO allow user to choose more time series 
      let url1 = '/api/temperature/max/' + location + '/' + startDate + '/' + endDate;
      // format the other dates using url1
      let newStartDate = moment(startDate).set('year', otherYear);
      let newEndDate = moment(endDate).set('year', otherYear);
      let url2 = '/api/temperature/max/' + location + '/' + newStartDate.format("YYYY-MM-DD") + '/' + newEndDate.format("YYYY-MM-DD");

      return [url1, url2]
  }

  // Fetches data for the chart
  // TODO optimize so only fetches data on first mount, and when user changes parameters
  useEffect(() => {
    // TODO could move functionality to store
    async function fetchTimeseriesData(urlList) {
      const apiResultList = [];
      for(const url of urlList) {
          const response = await fetch(url); 
          await response.json().then(recData => {
              let formattedDataList = [];
              for (const [key, value] of Object.entries(recData)) {
                  formattedDataList.push({ x: moment(key).format('M-D'), y: value });
              }
              apiResultList.push({
                  id: recData['timeRange'],
                  color: "hsl(175, 70%, 50%)",
                  data: processData(recData['data'])
              });  
          });
      };

      setTimeseriesData(apiResultList);
    }

    fetchTimeseriesData(getRequestURLs());
  }, []);

  // formats a request's data for Nivo line chart
  function processData(data) {
    let list = [];
    for (const [key, value] of Object.entries(data)) {
      // x value is assumed to be a timestamp
      let entry = { x: moment(key).format('M-D'), y: value };
      list.push(entry);
    }
    return list;
  }

  return (
    <>
     <Grid container direction="row" justifyContent="space-between" alignItems="left">
        <Grid item xs={10}>
          <Typography noWrap variant='h4' align='left' fontWeight="fontWeightBold">
            Peak Daily Temperature in {location} from {startDate} to {endDate}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" size="large" onClick={() => setRefreshChartData(!refreshChartData)}>
            Update Chart
          </Button>
        </Grid>

        <Grid item xs={12} align="left">
          <LocationSelect setLocation={setLocation} />
        </Grid>
        
        <Grid item xs={2}>
          <Typography variant="h5">Main Time Period:</Typography>
        </Grid>
        <Grid item xs={2}>
          <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        </Grid>
        <Grid item xs={2}>
          <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        </Grid>

        <Grid item xs={2}>
          <Typography noWrap variant="h5">Compare to year:</Typography>
        </Grid>
        <Grid item xs={2}>
          <YearPicker handleDateChange={setOtherYear} />
        </Grid>
      </Grid>


      <Grid container direction="row" justify="left" alignItems="stretch">
      </Grid>

      <div style={{ height: 500 }}>
        <LineChart />
      </div>
      <Typography paragraph>
        Each day, the maximum temperature is taken from each weather station in the selected location. These maximum temperatures are averaged together, leaving the average maximum temperature for the selected location.
      </Typography>
    </>
  );
}

export default MaxTempVisualization;