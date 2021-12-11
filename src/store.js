import create from 'zustand';
import { Timeseries } from './model/Timeseries';

const createTimeseries = (timeseriesList) => [
  ...timeseriesList,
  {
    id: Math.max(0, Math.max(...timeseriesList.map(({ id }) => id))) + 1,
    year: 2000,
    color: '#0d47a1', // blue
    colorSelectorOpen: false
  },
];

const createUpdateChartDataTimeseries = (chartData, timeseries)  =>
  chartData.find(tmsr => tmsr.id === timeseries.id) ? 
    updateChartDataTimeseries(chartData, timeseries) :
    createChartDataTimeseries(chartData, timeseries )  

const createChartDataTimeseries = (chartData, newTimeseries) => [
  ...chartData,
  newTimeseries.data
]

const updateChartDataTimeseries = (chartData, id, data) => [
  chartData.map(chartDataTimeseries => ({
    ...chartDataTimeseries,
    year: chartDataTimeseries.id === id ? data : chartDataTimeseries.data,
  }))
]

const updateTimeseriesYear = (timeseriesList, id, newYear) =>
  timeseriesList.map(timeseries => ({
    ...timeseries,
    year: timeseries.id === id ? newYear : timeseries.year,
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


const useStore = create((set) => ({
    // TODO
    //querys: [{NOAAQuery, results}]
    
    apiResults: [],
    setAPIResults(newResults){
      set(state => ({
        ...state,
        apiResults: newResults
      }))
    },
    chartData: [],
    createUpdateChartDataTimeseries(timeseries) {
      console.log("in CreateUpdate Chart Data")
    
      set((state) => ({
        ...state,
        chartData: createUpdateChartDataTimeseries(state.chartData, timeseries)
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
        timeseriesList: updateTimeseriesYear(state.timeseriesList, id, year),
      }))
    },
    // createUpdateTimeseries: (id, year) => {
    //   if(state.timeseriesList.)
    //   set((state) => ({
    //     ...state,
    //     timeseriesList: updateTimeseriesYear(state.timeseriesList, id, year),
    //   }))
    // }

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