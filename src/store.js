import create from 'zustand';

const useStore = create((set) => ({
    timeseriesData : [ {
        id: "First",
        color: "hsl(221, 70%, 50%)",
        data: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          }
        ]
      }
    ],
    setTimeseriesData: data => {
      // TODO could move fetching here
      set({timeseriesData: data}); 
    }
}));

export default useStore;