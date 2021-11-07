import create from 'zustand';
import YearList from './Components/YearList';



const addYear = (years) => [
  ...years,
  {
    id: Math.max(0, Math.max(...years.map(({ id }) => id))) + 1,
    year: 2021,
    color: 'green TODO colors',
  },
];

const updateYearDate = (years, id, date) => {
  years.map(year => ({
    ...year,
    year: year.id === id ? date : year.year,
  }));
}

// TODO: const updateYearColor



const useStore = create((set) => ({
    years: [],
    addYear(){
      set(state => ({
        ...state,
        years: addYear(state.years)
      }))
    },
    updateYear: (id, date) => {
      set((state) => ({
        ...state,
        years: updateYearDate(state.years, id, date),
      }))
    },
}));

export default useStore;

// class Year {
//   constructor(){
//     this.id = 0;
//     this.year = 2010;
//     this.color = 'RGB(3,60,100)';
//   }
// }