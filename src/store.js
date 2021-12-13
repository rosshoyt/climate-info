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

const createUpdateChartDataTimeseries = (chartData, newData)  =>
  chartData.find(tmsr => tmsr['id'] === newData['id']) ? 
    updateChartDataTimeseries(chartData, newData['id'], newData) :
    createChartDataTimeseries(chartData, newData )  

const createChartDataTimeseries = (chartData, newData) => [
  ...chartData,
  newData
]

const updateChartDataTimeseries = (chartData, id, data) => [
  chartData.map(chartDataTimeseries => ({
    ...chartDataTimeseries,
    year: chartDataTimeseries.id === id ? data : chartDataTimeseries.data,
  }))
]

const clearChartDataTimeseries = (chartData, id) =>
  chartData.filter((timeseries) => timeseries.id !== id);

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
    // scatter plot data
    chartData: [],
    
    createUpdateChartDataTimeseries(timeseries, newData) {
      console.log("in CreateUpdate Chart Data to create/update timeseries", timeseries)
      
      var newChartData = {
        id: timeseries.id, 
        color: "hsl(175, 70%, 50%)", // TODO needed?
        data: processScatterplotTimeseriesData(newData)
      }

      set((state) => ({
        ...state,
        chartData: createUpdateChartDataTimeseries(
          state.chartData, 
          newChartData
          ),
          rawData: createUpdateChartDataTimeseries(
            state.rawData, 
            {
              id: timeseries.id,
              data: newData
            }
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
        chartData: clearChartDataTimeseries(state.chartData, id),
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