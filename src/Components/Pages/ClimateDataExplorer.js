import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import TimeseriesList from '../TimeseriesList';
import useStore from '../../store';
import DataTable from '../DataTable';
import TabbedContainer from '../Tabs/TabbedContainer';
import DateRangeSlider from '../sliders/DateRangeSlider';
import DataTypes from '../../api/noaa/DataTypes';
import axios from 'axios';
import { useQuery, useQueries } from 'react-query';
import useWindowDimensions from '../../Utils/WindowUtils';
import CDEGraphSettingsPanel from '../CDEGraphSettingsPanel';
import CDEDownloaderPanel from '../CDEDownloaderPanel';
import CDESourcesPanel from '../CDESourcesPanel';
import ScatterChartExample from '../timeseries-charts/ScatterChart';
import { getReadableTimeString } from '../../Utils/TimeUtils';
import MapboxComponent from '../../mapbox/MapboxComponent';
import PopoverButton from '../Buttons/PopoverButton';
import SelectableList from '../Lists/SelectableList';
import CustomAutocomplete from '../Autocomplete/CustomAutocomplete';
import QueryAlerts from '../Alerts/QueryAlerts';

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
  const setStationsList = useStore(state => state.setStationsList);
  const createUpdateTimeseriesRawData = useStore(state => state.createUpdateTimeseriesRawData);

  const [globalErrorMessage, setGlobalErrorMessage] = useState(null);

  const fetchNOAAQuery = (noaaQueryString) => axios.get(noaaQueryString).then((res) => res.data);

  useQueries(
    timeseriesList.map(timeseriesInfo => {

      // set the query string based on the current settings
      timeseriesInfo.queryString =
        '/api/noaa/data/daily/'
        + dataType + '/'
        + location.id + '/' // TODO NULL CHECK - can't be null (location selector can break)
        + timeseriesInfo.year + '-' + dayRange[0] + '/'
        + timeseriesInfo.year + '-' + dayRange[1];

      return {
        queryKey: [dataType, location.id, timeseriesInfo.year, dayRange],

        staleTime: Number.MAX_SAFE_INTEGER,

        refetchOnWindowFocus: false,

        queryFn: () => fetchNOAAQuery(timeseriesInfo.queryString),

        onSettled: (data, error, variables, context) => {

          if (error !== null) {
            console.log(error);
            if (data === null || data === undefined) {
              timeseriesInfo.errorMessage = error;
              console.log("did not recieve response to query", timeseriesInfo.queryString)
            }
            else if (Object.keys(data).includes('message')) {
              let errorMessage = data['message'];
              console.log("Server returned error", errorMessage, "on request for", timeseriesInfo.queryString)
              timeseriesInfo.errorMessage = errorMessage;
              // TODO add error code from react query onto timeseries error message?
            }
          }
          else if (data !== null || data !== undefined) {
            // TODO improve results processing. Sometimes may not get past Object.keys check
            if (Object.keys(data).includes('results')) {
              if (data.results.length > 0) {
                createUpdateTimeseriesRawData(timeseriesInfo, data.results,);
                timeseriesInfo.errorMessage = undefined; // reset error message 
              } else {
                console.log('results list was 0 length')
                //deleteTimeseriesRawData(timeseriesInfo)
              }

            } else if (Object.keys(data).includes('error')) {
              console.log('Error occured, according to API. Status code = ', data.error)
              if(data.error == 503){
                setGlobalErrorMessage('Error 503: NOAA GHCN Service is temporarily unavailable. See https://www.ncei.noaa.gov/');
              }  
            } else {
              console.log('No results in response to timeseires query', timeseriesInfo.queryString);

              if (Object.keys(data).includes('message')) {
                timeseriesInfo.errorMessage = 'error - ' + data['message'];
              }
            }
          }
        }
      }
    })
  )

  useQuery({

    queryKey: [location.id],

    staleTime: Number.MAX_SAFE_INTEGER,

    refetchOnWindowFocus: false,

    queryFn: () => {
      let url = 'api/locations/get/stations/' + location.id;
      console.log('fetching url', url);
      // TODO use fetchNoaaQuery
      return axios.get(url).then((res) => res.data);
    },

    onSettled: (data, error, variables, context) => {
      if (error !== null) {
        console.log(error);
        if (data === null || data === undefined) {
          console.log("did not recieve response to stations query")
        }
        else if (Object.keys(data).includes('message')) {
          let errorMessage = data['message'];
          console.log("Server returned error", errorMessage, "on request for stations");
        }
      }
      else if (data !== null || data !== undefined) {
        // TODO improve results processing. Sometimes may not get past Object.keys check
        if (Object.keys(data).includes('stations')) {
          if (data.stations.length > 0) {
            console.log('got stations', data.stations);
            setStationsList(data.stations);
          } else {
            console.log('stations list was 0 length');
          }
        }
      }
    }
  })
  // Get static Cities json file
  useQuery({

    queryKey: [],

    staleTime: Number.MAX_SAFE_INTEGER,

    refetchOnWindowFocus: false,

    queryFn: () => {
      return axios.get('/static/Cities.json').then((res) => res.data);
    },

    onSettled: (data, error, variables, context) => {
      console.log('cities data',data)
      if (error !== null) {
        console.log(error);
        if (data === null || data === undefined) {
          console.log("did not recieve response to cities query")
        }
        else if (Object.keys(data).includes('message')) {
          let errorMessage = data['message'];
          console.log("Server returned error", errorMessage, "on request for cities");
        }
      }
      else if (data !== null || data !== undefined) {
        // TODO improve results processing. Sometimes may not get past Object.keys check
        if (Object.keys(data).includes('cities')) {
          if (data.cities.length > 0) {
            console.log('got cities', data.cities);
            setLocationsList(data.cities);
          } else {
            console.log('cities list was 0 length');
          }
        }
      }
    }
  })

  useEffect(() => {
  }, [timeseriesList]);


  const getContainerHeight = () => {
    return height * .73;
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h4' align='left' fontWeight="fontWeightBold">
          NOAA Global Historical Climate Network Daily (GHCN) - Data Explorer
        </Typography>
      </Grid>
      <Grid
        container
        direction="row"
        // wrap="no-wrap"
        spacing={3}
        justifyContent="flex-start"
        alignItems="center"
        overflow-x="scroll"
      >
          <PopoverButton currentValue={location.name}>
            <CustomAutocomplete 
              selectedOption={location} 
              setSelectedOption={setLocation} 
              selectionOptions={locationsList}
            />
          </PopoverButton>
          <PopoverButton currentValue={dataType}>
            <SelectableList
              // secondaryValues={false}
              currentValue={dataType}
              setCurrentValue={setDataType}
              valuesList={Object.entries(DataTypes)} />
          </PopoverButton>
          <PopoverButton currentValue={'Days: ' + dayRange.join(' to ')} secondaryValues>
            <DateRangeSlider title='Day Range' currentValueText={dayRange.join(' to ')} dayRange={dayRange} setDayRange={setDayRange} />

          </PopoverButton>
        {/* </Grid>
        <Grid  item xl={2} lg={2} md={4} xs={6}   > */}

          <PopoverButton currentValue={'Years: ' + timeseriesList.map(yearEntry => { return yearEntry.year }).join(', ')}>
            <TimeseriesList title='Years' currentValueText={timeseriesList.map(yearEntry => { return yearEntry.year }).join(', ')} />
          </PopoverButton>
        {/* </Grid> */}
      </Grid>
      <Grid container direction="row" justifyContent="center">
        <Grid item xs={12}>
          <QueryAlerts errorMessage={globalErrorMessage}/>
        </Grid>
        <Grid item container direction="column" sm={12} lg={8}>
          {/* <Grid item> */}
          <div>
            <TabbedContainer>
              <div tabName="Graph">
                <Grid item>
                  <div style={{ height: getContainerHeight() }}>
                    <Typography variant='h5' align='left' fontWeight="fontWeightBold">
                      {DataTypes[dataType]} in {location.name} from {dayRange.map(mmDD => getReadableTimeString(mmDD)).join(' to ')}
                    </Typography>
                    <Typography variant='h6' align='left'>
                      Years: {timeseriesList.map(yearEntry => { return yearEntry.year }).join(', ')}
                    </Typography>
                    {/* <Divider variant="middle" /> */}

                    <ScatterChartExample height={.8 * getContainerHeight()} errorMessage={globalErrorMessage}/>
                  </div>
                </Grid>
              </div>
              <div tabName="Table">
                <Grid item>
                  <div style={{ height: getContainerHeight() }}>
                    <DataTable />
                  </div>
                </Grid>
              </div>
              <div tabName="Sources">
                <Grid item>
                  <div style={{ height: getContainerHeight() }}>
                    <CDESourcesPanel />
                  </div>
                </Grid>
              </div>
              <div tabName="Download">
                <Grid item>
                  <div style={{ height: getContainerHeight() }}>
                    <CDEDownloaderPanel />
                  </div>
                </Grid>
              </div>

            </TabbedContainer>
          </div>
          {/* </Grid> */}
        </Grid>
        <Grid item container direction="column" sm={12} lg={4}>
          <TabbedContainer>
            <div tabName="Weather Stations">
              <Grid item justify="center" style={{ height: getContainerHeight() }} >
                <MapboxComponent />
              </Grid>
            </div>
            <div tabName="Graph Settings">
              <Grid item justify="center" style={{ height: getContainerHeight() }} >
                <CDEGraphSettingsPanel />
              </Grid>
            </div>
          </TabbedContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ClimateDataExplorer;