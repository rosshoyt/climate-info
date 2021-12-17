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

const useStore = create((set, get) => ({
  rawData: [],
  
  createUpdateTimeseriesRawData(timeseries, newData) {
    console.log("in CreateUpdate Chart Data to create/update timeseries", timeseries)
    

    set((state) => ({
      ...state,
      rawData: createUpdateTimeseriesRawData(
        state.rawData, { id: timeseries.id, data: newData }
      )
    }))     
  },
  timeseriesList: [
    new Timeseries(0, 2021,'#9900EF'),
    new Timeseries(1, 1981,'#00d084'),
    new Timeseries(2, 1941,'#0693e3')
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