import create from 'zustand';

const addYear = (years) => [
  ...years,
  {
    id: Math.max(0, Math.max(...years.map(({ id }) => id))) + 1,
    year: new Date("01/01/2021"),
    color: '#0d47a1', // blue
    colorSelectorOpen: false
  },
];

const updateYearDate = (years, id, date) =>
  years.map(year => ({
    ...year,
    year: year.id === id ? date : year.year,
  }));


const updateYearColorSelectorOpen = (years, id, isOpen) =>
  years.map(year => ({
    ...year,
    colorSelectorOpen: year.id === id ? isOpen : year.colorSelectorOpen,
  }));

// TODO: const updateYearColor


const useStore = create((set) => ({
    years: [
      {
        id:0,
        year: new Date("01/01/2021"),
        color: '#9900EF',
        colorSelectorOpen: false
      },
      {
        id: 1,
        year: new Date("01/01/2021"),
        color: '#008B02',
        colorSelectorOpen: false
      }
    ],
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
    updateYearColorSelectorOpen(id, isOpen) {
      set((state) => ({
        ...state,
        years: updateYearColorSelectorOpen(state.years, id, isOpen),
      }))
    }
}));

export default useStore;

// class Year {
//   constructor(){
//     this.id = 0;
//     this.year = 2010;
//     this.color = 'RGB(3,60,100)';
//   }
// }