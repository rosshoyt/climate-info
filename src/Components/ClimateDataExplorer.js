import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography, CircularProgress } from '@material-ui/core';
import DatePicker from './DatePicker'
import YearPicker from './YearPicker';
import moment from 'moment';
import ScatterPlotChart from './Charts/ScatterPlotChart';
import NOAAQuery from '../api/noaa/NOAAQuery'
import YearList from './YearList';
import TimeRangeSelector from './TimeRangeSelector'
import useStore from '../store';

const ClimateDataExplorer = () => {
  const [refreshChartData, setRefreshChartData] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const [location, setLocation] = useState('CITY:US530018');
  const [startDate, setStartDate] = useState('2021-06-01')
  const [endDate, setEndDate] = useState('2021-06-30')

  const [dayRange, setDayRange] = useState(['06-01', '06-30']);

  // the other year to compare the time series with. TODO add ability to choose more than 1 year to compare with
  const [otherYear, setOtherYear] = useState('1980');

  const [chartData, setChartData] = useState([]);
  // const setTimeseriesData = useStore(state => state.setTimeseriesData);

  const years = useStore(state => state.years);

  function getAPIQueries(){
    const queryList = [];
    years.forEach(year => {
      queryList.push(new NOAAQuery(location, year.year + '-' + dayRange[0], year.year + '-' + dayRange[1], year.year));
    });
    return queryList;
  }

  // Fetches data for the chart
  // TODO optimize so only fetches data on first mount, and when user changes parameters
  useEffect(() => {
    setIsLoading(true);
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
                    id: query.name,
                    color: "hsl(175, 70%, 50%)",
                    data: processTimeSeriesDataScatterPlot(data)
                });  
              }
              
          });
      };
      console.log(apiResultList);
      setChartData(apiResultList);
      setIsLoading(false);
    }
   
    fetchTimeseriesData(getAPIQueries());
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
      </Grid>
        <div style={{ height: 225 }}>
          <TimeRangeSelector setDayRange={setDayRange}/>
        </div>
      <Grid container direction="column" justifyContent="space-between" alignItems="center">
        <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        <Typography noWrap variant="h5">Compare to year:</Typography>
        <YearPicker handleDateChange={setOtherYear} initialYear={otherYear} />
        <YearList />
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => setRefreshChartData(!refreshChartData)}
        >
          Update Chart
        </Button>
        <Typography noWrap variant='h5' align='left' fontWeight="fontWeightBold">
          Max Daily Temperatures in {location}:
        </Typography>
      </Grid>
     
      <div style={{ height: 700 }}>
        { isLoading ? (
          // TODO center progress spinner vertically
          // TODO update on each API call return; or, overlay spinner on graph while it has partial results
          <CircularProgress />
        ) : (
          <ScatterPlotChart data={chartData} />
        )}
       
      </div>
      <Typography paragraph>
        TODO: describe the graph here
      </Typography>
    </>
  );
}

export default ClimateDataExplorer;