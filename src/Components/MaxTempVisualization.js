import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography } from '@material-ui/core';
import DatePicker from './DatePicker'
import YearPicker from './YearPicker';
import moment from 'moment';
import ScatterPlotChart from './Charts/ScatterPlotChart';
import NOAAQuery from '../api/noaa/NOAAQuery'

const MaxTempVisualization = () => {
  const [refreshChartData, setRefreshChartData] = useState(false);

  const [location, setLocation] = useState('CITY:US530018');
  const [startDate, setStartDate] = useState('2021-06-01')
  const [endDate, setEndDate] = useState('2021-06-30')

  // the other year to compare the time series with. TODO add ability to choose more than 1 year to compare with
  const [otherYear, setOtherYear] = useState('1980');

  const [chartData, setChartData] = useState([]);
  // const setTimeseriesData = useStore(state => state.setTimeseriesData);

  function getRequestURLs(){
    let query1 = new NOAAQuery(location, startDate, endDate);
    console.log(query1)
    // format the other dates
    let newStartDate = moment(startDate).set('year', otherYear);
    let newEndDate = moment(endDate).set('year', otherYear);
    
    let query2 = new NOAAQuery(location, newStartDate.format("YYYY-MM-DD"), newEndDate.format("YYYY-MM-DD"));    
    return [ query1, query2 ];
  }

  // Fetches data for the chart
  // TODO optimize so only fetches data on first mount, and when user changes parameters
  useEffect(() => {
    // TODO could move functionality to store
    async function fetchTimeseriesData(queryList) {
      console.log(queryList)
      const apiResultList = [];
     
      for(const query of queryList) {
          const url = query.getURL();
          console.log('Fetching url', url)
          const response = await fetch(url); 
          await response.json().then(recData => {
              const data = recData['results'];
              console.log(data);
              
              // TODO display errors. Data may not be available based on time selection, etc
              if(data !== undefined) {
                apiResultList.push({
                    id: query.startDate + ' to ' + query.endDate,
                    color: "hsl(175, 70%, 50%)",
                    data: processTimeSeriesDataScatterPlot(data)
                });  
              }
              
          });
      };
      console.log(apiResultList);
      setChartData(apiResultList);
    }
   
    fetchTimeseriesData(getRequestURLs());
  }, [refreshChartData]);

  function processTimeSeriesDataScatterPlot(data){
    
    return data.reduce((formattedDataList, datum) => {
      const date = datum['date'];
      const value = datum['value'];
      const entry = { x: moment(date).format('M-D'), y: value };
      //console.log(entry);
      formattedDataList.push(entry);
      return formattedDataList;
    }, []);
  }

  return (
    <>
      <Grid container direction="column" justifyContent="space-between" alignItems="center">
        <Typography noWrap variant='h4' align='left' fontWeight="fontWeightBold">
          Climate Data Explorer
        </Typography>
        <LocationSelect setLocation={setLocation} />
        <Typography variant="h5">Main Time Period:</Typography>
        <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        <Typography noWrap variant="h5">Compare to year:</Typography>
        <YearPicker handleDateChange={setOtherYear} />
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => setRefreshChartData(!refreshChartData)}
        >
          Update Chart
        </Button>
        <Typography noWrap variant='h5' align='left' fontWeight="fontWeightBold">
          Peak Daily Temperature in {location} from {startDate} to {endDate}:
        </Typography>
      </Grid>
      <div style={{ height: 500 }}>
        <ScatterPlotChart data={chartData} />
      </div>
      <Typography paragraph>
        TODO: describe the graph here
      </Typography>
    </>
  );
}

export default MaxTempVisualization;