import moment from 'moment';

export function processScatterplotTimeseriesData(data){
  return data.reduce((formattedDataList, datum) => {
    const date = datum['date'];
    const value = datum['value'];
    const entry = { x: moment(date).format('MM-DD'), y: value };
    formattedDataList.push(entry);
    return formattedDataList;
  }, []);
}
