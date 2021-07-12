import React, { useEffect, useState } from 'react';
import VisualizationTitle from './VisualizationTitle';

const GSOMVisualization = () => {

  useEffect(() => {
    updateData();
  }, []);

  const [dataType, setDataType] = useState('TAVG');

  const [location, setLocation] = useState('CITY:US530018');

  const [startDate, setStartDate] = useState('2021-06-01');

  const [endDate, setEndDate] = useState('2021-06-02');

  // An example statistic from the GSOM api
  const [averageTemp, setAverageTemp] = useState(0);

  function updateData() {
    console.log('GSOM Visualization fetching data...')
    let url = '/api/gsom/' + dataType + '/' + location + '/' + startDate + '/' + endDate;
    console.log('Updating data, fetching ' + url);
    fetch(url).then(res => res.json()).then(recData => {
      // set the example value for now  TODO update a graph or other visualization with GSOM data
      setAverageTemp(recData.temperature);
    });
  }



  return (
    <>
      <VisualizationTitle title="Global Summary of the Month API"/>
      <h3>[Placeholder API usage]:The average temperature for Seattle, WA in June 2021 was {averageTemp}°F.</h3>
      {/* <Grid container direction="row" justify="center" alignItems="stretch">
        <LocationSelect setLocation={setLocation} />
        <DatePicker label='Start' defaultValue={startDate} setDate={setStartDate} />
        <DatePicker label='End' defaultValue={endDate} setDate={setEndDate} />
        <Button onClick={updateChart} variant="contained" color="primary">
          Start
        </Button>
      </Grid> 
      <div style={{ height: 500 }}>
        <LineChart data={chartData} />
      </div>*/}
    </>
  );
}

export default GSOMVisualization;