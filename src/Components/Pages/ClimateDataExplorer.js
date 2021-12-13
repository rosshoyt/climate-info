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
import useWindowDimensions from '../../Utils/WindowUtils';
import CDEGraphSettingsPanel from '../CDEGraphSettingsPanel';

const ClimateDataExplorer = () => {
  const { height, width } = useWindowDimensions();
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
        staleTime: Number.MAX_SAFE_INTEGER,
        refetchOnWindowFocus: false,
        queryFn: () => fetchNOAAQuery(
          '/api/noaa/data/daily/'
          + dataType + '/' 
          + location.id + '/' 
          + timeseries.year + '-' + dayRange[0] + '/' 
          + timeseries.year + '-' + dayRange[1]
        ),
        onSettled: (data, error, variables, context) => {
          if(error !== null){
            if(Object.keys(data).includes('message')){      
              timeseries.errorMessage = 'error - ' + data['message'];
            }
          }
          else if(data !== null) {
            // TODO improve results processing. Sometimes may not get past Object.keys check
            if(Object.keys(data).includes('results')){      
              createUpdateChartDataTimeseries(timeseries, data['results']);
              timeseries.errorMessage = undefined; // reset error message
            } else{
              console.log('no results on request for timeseires', timeseries);
              if(Object.keys(data).includes('message')){      
                timeseries.errorMessage = 'error - ' + data['message'];
              }
            }
          }
        }
      }
    })
  )

  useEffect(() => {    
  }, [timeseriesList]);

  return (
    <>
      <Grid container direction="row" justifyContent="center">
        <Grid item>
          <Typography variant='h4' align='left' fontWeight="fontWeightBold">
            {location.name}: {DataTypes[dataType]} from {dayRange.join(' to ')} in&nbsp;
              Years: {timeseriesList.map(yearEntry => { return yearEntry.year }).join(', ')}
          </Typography>
        </Grid>
        <Grid item container direction="column" sm={12} lg={9}>
          <Grid item >
              <div>
                <TabbedContainer>
                  <div tabName="Graph">
                    <Grid item>
                      <div style={{ height: height < 1080 ? 550 : 700 }}>
                        <ScatterPlotChart data={chartData} />
                      </div>
                    </Grid>
                  </div>
                  <div tabName="Table">
                    <Grid item>
                      <div style={{ height: height < 1080 ? 550 : 700 }}>
                        <DataTable />
                      </ div>
                    </Grid>
                  </div>
                </TabbedContainer>
            </div>
          </Grid>
          
        </Grid>
        <Grid item container direction="column" sm={12} lg={3}>
          
          <TabbedContainer>
            <div tabName="Climate Data Settings">
              <Grid item justify="center" style={{ height: height < 1080 ? 550 : 700 }} >
                <ResponsiveListContainer>
                  <LocationSelect title='Location' currentValueText={location.name} setLocation={setLocation} />
                  <DataTypeSelector title='Data Type' currentValueText={dataType + ' (' + DataTypes[dataType] + ')'} dataType={dataType} setDataType={setDataType}/>
                  <DateRangeSlider title='Day Range' currentValueText={dayRange.join(' to ')} dayRange={dayRange} setDayRange={setDayRange} />
                  <TimeseriesList title='Years' currentValueText={timeseriesList.map(yearEntry => {return yearEntry.year }).join(', ')}/>
                </ResponsiveListContainer>
              </Grid>
            </div>
            <div tabName="Graph Settings">
              <Grid item justify="center" style={{ height: height < 1080 ? 550 : 700 }} >
                <CDEGraphSettingsPanel/>
              </Grid>
            </div>
          </TabbedContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default ClimateDataExplorer;