import React, { useEffect } from 'react';
import LocationSelect from '../LocationSelect';
import { Grid, Typography, } from '@material-ui/core';
import TimeseriesList from '../TimeseriesList';
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
import CDEDownloaderPanel from '../CDEDownloaderPanel';
import CDESourcesPanel from '../CDESourcesPanel';
import ScatterChartExample from '../timeseries-charts/ScatterChart';

const ClimateDataExplorer = () => {
  const { height } = useWindowDimensions();

  const dayRange = useStore(state => state.dayRange);
  const setDayRange = useStore(state => state.setDayRange)
  const dataType = useStore(state => state.dataType)
  const setDataType = useStore(state => state.setDataType)
  const timeseriesList = useStore(state => state.timeseriesList);
  const location = useStore(state => state.location);
  const setLocation = useStore(state => state.setLocation);
  const locationsList = useStore(state => state.locationsList);
  const setLocationsList = useStore(state => state.setLocationsList);
  const createUpdateTimeseriesRawData = useStore(state => state.createUpdateTimeseriesRawData);

  
  const fetchNOAAQuery = (noaaQueryString) => axios.get(noaaQueryString).then((res) => res.data);

  useQueries(
    timeseriesList.map(timeseriesInfo => {
      
      // set the query string based on the current settings
      
      timeseriesInfo.queryString = 
        '/api/noaa/data/daily/'
        + dataType + '/' 
        + location.id + '/' // TODO NULL CHECK - can't be null (location selector can breakl)
        + timeseriesInfo.year + '-' + dayRange[0] + '/' 
        + timeseriesInfo.year + '-' + dayRange[1];

      return {
        queryKey: [dataType, location.id, timeseriesInfo.year, dayRange],
        
        staleTime: Number.MAX_SAFE_INTEGER,
        
        refetchOnWindowFocus: false,
        
        queryFn: () => fetchNOAAQuery(timeseriesInfo.queryString),

        onSettled: (data, error, variables, context) => {

          if(error !== null){
            if(Object.keys(data).includes('message')){      
              timeseriesInfo.errorMessage = 'error - ' + data['message'];
            }
          }

          else if(data !== null) {
            // TODO improve results processing. Sometimes may not get past Object.keys check
            if(Object.keys(data).includes('results')){
              
              if(data.results.length > 0){      
                createUpdateTimeseriesRawData(timeseriesInfo, data.results, );
                timeseriesInfo.errorMessage = undefined; // reset error message 
              } else{
                console.log('results list was 0 length')
                //deleteTimeseriesRawData(timeseriesInfo)
              }

            } else{
              console.log('No results in response to timeseires query', timeseriesInfo.queryString);
              
              if(Object.keys(data).includes('message')){      
                timeseriesInfo.errorMessage = 'error - ' + data['message'];
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
                        <ScatterChartExample />
                      </div>
                    </Grid>
                  </div>
                  <div tabName="Table">
                    <Grid item>
                      <div style={{ height: height < 1080 ? 550 : 700 }}>
                        <DataTable />
                      </div>
                    </Grid>
                  </div>
                  <div tabName="Sources">
                    <Grid item>
                      <div style={{ height: height < 1080 ? 550 : 700 }}>
                        <CDESourcesPanel />
                      </div>
                    </Grid>
                  </div>
                  <div tabName="Download">
                    <Grid item>
                      <div style={{ height: height < 1080 ? 550 : 700 }}>
                        <CDEDownloaderPanel/>
                      </div>
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
                  <LocationSelect title='Location' currentValueText={location.name} location={location} setLocation={setLocation} locationsList={locationsList} setLocationsList={setLocationsList} />
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