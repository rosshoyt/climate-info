import create from 'zustand';

const addYear = (years) => [
  ...years,
  {
    id: Math.max(0, Math.max(...years.map(({ id }) => id))) + 1,
    year: 2000,
    color: '#0d47a1', // blue
    colorSelectorOpen: false
  },
];

const updateYearDate = (years, id, newYear) =>
  years.map(year => ({
    ...year,
    year: year.id === id ? newYear : year.year,
  }));

const updateYearColor = (years, id, newColor) =>
years.map(year => ({
  ...year,
  color: year.id === id ? newColor : year.color,
}));

const updateYearColorSelectorOpen = (years, id, isOpen) =>
  years.map(year => ({
    ...year,
    colorSelectorOpen: year.id === id ? isOpen : year.colorSelectorOpen,
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
    years: [
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
    addYear(){
      set(state => ({
        ...state,
        years: addYear(state.years)
      }))
    },
    updateYear: (id, newYear) => {
      set((state) => ({
        ...state,
        years: updateYearDate(state.years, id, newYear),
      }))
    },
    updateYearColor(id, newColor) {
      set((state) => ({
        ...state,
        years: updateYearColor(state.years, id, newColor),
      }))
    },
    updateYearColorSelectorOpen(id, isOpen) {
      set((state) => ({
        ...state,
        years: updateYearColorSelectorOpen(state.years, id, isOpen),
      }))
    }
}));

export default useStore;