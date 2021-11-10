import React, { useEffect, useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button, Typography, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import ScatterPlotChart from './Charts/ScatterPlotChart';
import YearList from './YearList';
import TimeRangeSelector from './TimeRangeSelector'
import NOAAQuery from '../api/noaa/NOAAQuery'

import useStore from '../store';

const ClimateDataExplorer = () => {
  
  const [location, setLocation] = useState('CITY:US530018');
  const [dayRange, setDayRange] = useState(['06-01', '06-30']);
  const [chartData, setChartData] = useState([]);
  const [refreshChartData, setRefreshChartData] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // could move into chart component

  const years = useStore(state => state.years);

  function getAPIQueries(){
    const queryList = [];
    years.forEach(year => {
      queryList.push(new NOAAQuery(location, year.year + '-' + dayRange[0], year.year + '-' + dayRange[1], year.year));
    });
    return queryList;
  }

  // Fetches data for the chart
  // TODO optimize
  useEffect(() => {
    setIsLoading(true);
    // TODO could move functionality to store
    async function fetchTimeseriesData(queryList) {
      const apiResultList = [];
     
      for(const query of queryList) {
          const url = query.getURL();
          console.log('Fetching url', url, 'from api');
          const response = await fetch(url); 
          await response.json().then(recData => {
              const data = recData['results'];
              // TODO display errors in UI. Data may not be available based on time selection, etc
              if(data !== undefined) {
                apiResultList.push({
                    id: query.name,
                    color: "hsl(175, 70%, 50%)", // TODO needed?
                    data: processTimeSeriesDataScatterPlot(data)
                });  
              }
          });
      };

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
        <Typography noWrap variant="h5">Compare to years:</Typography>
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
        Data via @NOAA Climate Data Online API. TODO describe graph based on selected params.
      </Typography>
    </>
  );
}

export default ClimateDataExplorer;