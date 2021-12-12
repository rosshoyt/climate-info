import React, { useEffect, useState } from 'react';
import LocationSelect from '../LocationSelect';
import { Grid, Button, Typography, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import ScatterPlotChart from '../Charts/ScatterPlotChart';
import TimeseriesList from '../TimeseriesList';
import NOAAQuery from '../../api/noaa/NOAAQuery'
import useStore from '../../store';
import DataTable from '../DataTable';
import DataTypeSelector from '../DataTypeSelector';
import TabbedContainer from '../Tabs/TabbedContainer'
import ResponsiveListContainer from '../ResponsiveListContainer';
import DateRangeSlider from '../sliders/DateRangeSlider';
import DataTypes from '../../api/noaa/DataTypes';
import axios from 'axios';
import { useQueries } from 'react-query';

const ClimateDataExplorer = () => {
  
  const [location, setLocation] = useState({
    "datacoverage": 1,
    "id": "CITY:US530018",
    "maxdate": "2021-07-02",
    "mindate": "1891-01-01",
    "name": "Seattle, WA US"
  });

  const [dayRange, setDayRange] = useState(['06-01', '06-30']);
  //const [chartData, setChartData] = useState([]);
  const [refreshChartData, setRefreshChartData] = useState(false);
  //const [isLoading, setIsLoading] = useState(false); // could move into chart component
  const [dataType, setDataType] = useState("TMAX");

  const timeseriesList = useStore(state => state.timeseriesList);
  const setAPIResults = useStore(state => state.setAPIResults);
  
  const createUpdateChartDataTimeseries = useStore(state => state.createUpdateChartDataTimeseries);
  const chartData = useStore(state => state.chartData)

  function getAPIQueries(){
    const queryList = [];
    timeseriesList.forEach(year => {
      queryList.push(new NOAAQuery(dataType, location.id, year.year + '-' + dayRange[0], year.year + '-' + dayRange[1], year.year));

    });
    return queryList;
  }

  const fetchNOAAQuery = (noaaQueryString) => axios.get(noaaQueryString).then((res) => res.data);

  useQueries(
    timeseriesList.map(timeseries => {
      return {
        queryKey: [dataType, location.id, timeseries.year, dayRange],
        refetchOnWindowFocus: false,
        queryFn: () => fetchNOAAQuery(
          '/api/noaa/data/daily/'
          + dataType + '/' 
          + location.id + '/' 
          + timeseries.year + '-' + dayRange[0] + '/' 
          + timeseries.year + '-' + dayRange[1]
        ),
        onSettled: (data, error, variables, context) => {
          if(data !== null) {
            
            // TODO move data processing to store
            timeseries.data = {
              id: timeseries.id, 
              color: "hsl(175, 70%, 50%)", // TODO needed?
              data: processTimeSeriesDataScatterPlot  (data['results'])
            };            
            createUpdateChartDataTimeseries(timeseries);

          }
         
        }
      }
    })
  )

  useEffect(() => {    
  }, [timeseriesList]);

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
        <Grid container direction="column" sm={12} lg={9}>
          <Grid item >
              <Typography variant='h4' align='center' fontWeight="fontWeightBold">
               {location.name}: {DataTypes[dataType]} from {dayRange.join(' to ')} in&nbsp;
                Years: {timeseriesList.map(yearEntry => { return yearEntry.year }).join(', ')}
              </Typography>
            <TabbedContainer>
              <div tabName="Graph">
                <Grid item xs={12}>
                  <ScatterPlotChart data={chartData} />
                </Grid>
              </div>
              <div tabName="Table">
                <Grid item xs={12}>
                  <DataTable />
                </Grid>
              </div>
            </TabbedContainer>
            
          </Grid>
          
        </Grid>
        <Grid container direction="column" sm={12} lg={3}>
          <Grid item justify="center" >
            <ResponsiveListContainer>
              <LocationSelect title='Location' currentValueText={location.name} setLocation={setLocation} />
              <DataTypeSelector title='Data Type' currentValueText={dataType + ' (' + DataTypes[dataType] + ')'} dataType={dataType} setDataType={setDataType}/>
              <DateRangeSlider title='Day Range' currentValueText={dayRange.join(' to ')} dayRange={dayRange} setDayRange={setDayRange} />
              <TimeseriesList title='Years' currentValueText={timeseriesList.map(yearEntry => {return yearEntry.year }).join(', ')}/>
            </ResponsiveListContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ClimateDataExplorer;