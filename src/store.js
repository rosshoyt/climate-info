import create from 'zustand';

// TODO rename timeseriesList
const createTimeseries = (timeseriesList) => [
  ...timeseriesList,
  {
    id: Math.max(0, Math.max(...timeseriesList.map(({ id }) => id))) + 1,
    year: 2000,
    color: '#0d47a1', // blue
    colorSelectorOpen: false
  },
];

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
    timeseriesList: [
      {
        id:0,
        year: 2021,
        color: '#9900EF',
        colorSelectorOpen: false
      },
      {
        id: 1,
        year: 1980,
        color: '#8ed1fc',
        colorSelectorOpen: false
      }
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