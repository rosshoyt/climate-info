import create from 'zustand';
import moment from 'moment';

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
    fetchTimeseriesData: async ((urlList) => {
        console.log('Fetching urls', urlList);
        let apiResultList = [];
        urlList.foreach((url) => {
            fetch(url).then(res => res.json()).then(recData => {
                let formattedDataList = [];
                for (const [key, value] of Object.entries(recData)) {
                    formattedDataList.push({ x: moment(key).format('M-D'), y: value });
                }
                apiResultList.push({
                    id: recData['timeRange'],
                    color: "hsl(175, 70%, 50%)",
                    data: processData(recData['data'])
                });
            });
        });
        set({ timeseriesData: apiResultList });
    }),
}));

export default useStore;