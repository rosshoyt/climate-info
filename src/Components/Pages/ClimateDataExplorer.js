import React, { useEffect, useState } from 'react';
import LocationSelect from '../LocationSelect';
import { Grid, Button, Typography, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import ScatterPlotChart from '../Charts/ScatterPlotChart';
import YearList from '../YearList';
import NOAAQuery from '../../api/noaa/NOAAQuery'
import useStore from '../../store';
import DataTable from '../DataTable';
import DataTypeSelector from '../DataTypeSelector';
import ResponsiveListContainer from '../ResponsiveListContainer';
import DateRangeSlider from '../sliders/DateRangeSlider';
import DataTypes from '../../api/noaa/DataTypes';

const ClimateDataExplorer = () => {
  
  const [location, setLocation] = useState({
    "datacoverage": 1,
    "id": "CITY:US530018",
    "maxdate": "2021-07-02",
    "mindate": "1891-01-01",
    "name": "Seattle, WA US"
  });

  const [dayRange, setDayRange] = useState(['06-01', '06-30']);
  const [chartData, setChartData] = useState([]);
  const [refreshChartData, setRefreshChartData] = useState(false);
  //const [isLoading, setIsLoading] = useState(false); // could move into chart component
  const [dataType, setDataType] = useState("TMAX");

  const years = useStore(state => state.years);
  const setAPIResults = useStore(state => state.setAPIResults);

  function getAPIQueries(){
    const queryList = [];
    years.forEach(year => {
      queryList.push(new NOAAQuery(dataType, location.id, year.year + '-' + dayRange[0], year.year + '-' + dayRange[1], year.year));
    });
    return queryList;
  }

  // Fetches data for the chart
  // TODO optimize
  useEffect(() => {
    // setIsLoading(true);
    // TODO could move functionality to store
    async function fetchTimeseriesData(queryList) {
      setChartData([])
      setAPIResults([])
      const apiResultList = [];
      const rawData = []; // hold unprocessed query results (for adding to table)
      for(const query of queryList) {
          const url = query.getURL();
          console.log('Fetching url', url, 'from api');
          const response = await fetch(url); 
          await response.json().then(recData => {
              const data = recData['results'];
              rawData.push(data);
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
      setAPIResults(rawData);
      //setIsLoading(false);
    }
    
    fetchTimeseriesData(getAPIQueries());
  }, [refreshChartData, years]);

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
      <Grid container direction="row" justify="center">
        <Grid container direction="column" xs={12} lg={3}>
          <Grid item justify="center" >
            <ResponsiveListContainer>
              <LocationSelect title='Location' currentValueText={location.name} setLocation={setLocation} />
              <DataTypeSelector title='Data Type' currentValueText={dataType + ' (' + DataTypes[dataType] + ')'} dataType={dataType} setDataType={setDataType}/>
              <DateRangeSlider title='Day Range' currentValueText={dayRange.join(' to ')} dayRange={dayRange} setDayRange={setDayRange} />
              <YearList title='Years' currentValueText={years.map(yearEntry => {return yearEntry.year }).join(', ')}/>
            </ResponsiveListContainer>
          </Grid>
          <Grid item align="left">
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => setRefreshChartData(!refreshChartData)}
            >
              Update Chart
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="column" sm={12} lg={9}>
          <Grid item >
            <Typography variant='h4' align='center' fontWeight="fontWeightBold">
              {DataTypes[dataType]} from {dayRange.join(' to ')} in&nbsp;{location.name} in &nbsp;
              {years.map(yearEntry => { return yearEntry.year }).join(', ')}
            </Typography>
          </Grid>
          <Grid item >
              <ScatterPlotChart data={chartData} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h4' align="center">
            Raw Weather Data:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DataTable />
        </Grid>
      </Grid>
    </>
  );
}

export default ClimateDataExplorer;