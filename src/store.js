import create from 'zustand';
import { Timeseries } from './model/Timeseries';
import { processScatterplotTimeseriesData } from './Data/converters/NivoDataConverters';

const createTimeseries = (timeseriesList) => [
  ...timeseriesList,
  {
    id: Math.max(0, Math.max(...timeseriesList.map(({ id }) => id))) + 1,
    year: 2000,
    color: '#0d47a1', // blue
    colorSelectorOpen: false
  },
];

const createUpdateTimeseriesRawData = (rawData, newData)  =>
  rawData.find(tmsr => tmsr['id'] === newData['id']) ? 
    updateTimeseriesRawData(rawData, newData['id'], newData) :
    createTimeseriesRawData(rawData, newData )  

const createTimeseriesRawData = (rawData, newData) => [
  ...rawData,
  newData
]

const updateTimeseriesRawData = (rawData, id, data) => [
  rawData.map(rawDataTimeseries => ({
    ...rawDataTimeseries,
    year: rawDataTimeseries.id === id ? data : rawDataTimeseries.data,
  }))
]

const clearRawDataTimeseries = (rawData, id) =>
  rawData.filter((timeseries) => timeseries.id !== id);

const updateTimeseriesYear = (timeseriesList, id, newYear) =>
  timeseriesList.map(timeseries => ({
    ...timeseries,
    year: timeseries.id === id ? newYear : timeseries.year,
    data: []
  }));

const updateTimeseriesColor = (timeseriesList, id, newColor) =>
  timeseriesList.map(timeseries => ({
    ...timeseries,
    color: timeseries.id === id ? newColor : timeseries.color,
  }));

const updateTimeseriesColorSelectorOpen = (timeseriesList, id, isOpen) =>
  timeseriesList.map(timeseries => ({
    ...timeseries,
    colorSelectorOpen: timeseries.id === id ? isOpen : timeseries.colorSelectorOpen,
  }));


const findStationWithID = (stationsList, stationID) => {
  // TODO convert to array.find()
  // e.g let station = stationsList.find(station => station['id'] === stationID)
  let station = null;

  stationsList.forEach(s => {
    //console.log(s)
    if(s['id'] == stationID)
      station = s;
  });
  console.log('found station ', station)
  return station
}

const updateActiveStationIDsSet = (activeStationIDsSet, newData) => {
  // create a new set so that elements will update
  let activeStations = new Set(activeStationIDsSet);
  newData.forEach(element => {
      //console.log(element)
      activeStations.add(element.station)
  });
  return activeStations;
}

// TODO move to a class, e.g. NoaaLocations.js
const defaultLocation = {
  "datacoverage": 1,
  "id": "CITY:US530018",
  "maxdate": "2021-07-02",
  "mindate": "1891-01-01",
  "name": "Seattle, WA US"
}

const useStore = create((set, get) => ({
  /**
   * The main datastore
   * List of objects in form { queryID, queryResults }  
   */
  rawData: [],
  createUpdateTimeseriesRawData(timeseries, newData) {
    // console.log('newdata', newData)
    set((state) => ({
      ...state,
      rawData: createUpdateTimeseriesRawData(
        state.rawData, { 
          id: timeseries.id, 
          data: newData, 
          //stations: new Set(newData.map(entry => entry.station))
        }
      ),
      // also update the map of stations that are used in the raw timeseries data
      activeStationIDsSet: updateActiveStationIDsSet(
        state.activeStationIDsSet, 
        newData
      )
    }));
  },

  // convert to class in NoaaLocation.js
  location: defaultLocation,
  setLocation(location){
    set(state => ({
      ...state,
      rawData: [],
      stationsList: [],
      activeStationIDsSet: new Set(),
      location: location
    }))
  },
  locationsList: [defaultLocation],
  setLocationsList(locationsList){
    set(state => ({
      ...state,
      locationsList: locationsList
    }))
  },

  selectedStation: null,
  setSelectedStation(station){
    set(state => ({
      ...state,
      selectedStation: station
    }))
  },
  setSelectedStationFromStationID(stationID){
    set(state => ({
      ...state,
      selectedStation: findStationWithID(state.stationsList, stationID)
    }))   
  },

  stationsList: [],
  setStationsList(stationsList){
    set(state => ({
      ...state,
      stationsList: stationsList
    }))
  },

  activeStationIDsSet: new Set(),

  dayRange: ['06-01', '06-30'],
  setDayRange(dayRange) {
    set(state => ({
      ...state,
      rawData: [],
      dayRange: dayRange,
      activeStationIDsSet: new Set(),
      stationsList: [],
      selectedStation: undefined,
    }))
  },

  dataType: "TMAX",
  setDataType(dataType){
    set(state => ({
      ...state,
      rawData: [],
      activeStationIDsSet: new Set(),
      stationsList: [],
      selectedStation: undefined,
      dataType: dataType
    }))
  },


  timeseriesList: [
    new Timeseries(0, 2021,'#9900EF'),
    new Timeseries(1, 1971,'#0693e3')
  ],
  createTimeseries(){
    set(state => ({
      ...state,
      timeseriesList: createTimeseries(state.timeseriesList)
    }))
  },

  updateTimeseriesYear: (id, year) => {
    set((state) => ({
      ...state,
      rawData: clearRawDataTimeseries(state.rawData, id),
      timeseriesList: updateTimeseriesYear(state.timeseriesList, id, year),
    }))
  },


  /* UI settings to Update (move to other store?) */
  updateTimeseriesColor(id, newColor) {
    set((state) => ({
      ...state,
      timeseriesList: updateTimeseriesColor(state.timeseriesList, id, newColor),
    }))
  },
  updateTimeseriesColorSelectorOpen(id, isOpen) {
    set((state) => ({
      ...state,
      timeseriesList: updateTimeseriesColorSelectorOpen(state.timeseriesList, id, isOpen),
    }))
  }
}));

export default useStore;