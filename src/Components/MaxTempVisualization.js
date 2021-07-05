import React, { useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button } from '@material-ui/core';
import LineChart from './Charts/LineChart';
import DatePicker from './DatePicker'


const MaxTempVisualization = () => {
    const [chartData, setChartData] = useState([
        {
          id: "",
          color: "hsl(221, 70%, 50%)",
          data: [
            {
              x: "plane",
              y: 89
            },
            {
              x: "helicopter",
              y: 118
            }
          ]
        },
        {
          id: "france",
          color: "hsl(175, 70%, 50%)",
          data: [
            {
              x: "plane",
              y: 173
            },
            {
              x: "helicopter",
              y: 183
            }
          ]
        }
      ]);

      const [location, setLocation] = useState('CITY:US530018');

      const[startDate, setStartDate] = useState('2020-06-01');

      const[endDate, setEndDate] = useState('2020-06-30');

      function changeChart() {
        console.log('Pressed start button!');
        let url = '/api/temperature/max/' + location + '/' + startDate + '/' + endDate;
        fetch(url).then(res => res.json()).then(recData => {
            let formattedList = [];
            for (const [key, value] of Object.entries(recData)) {
                formattedList.push({ x : key, y: value});
            }
            setChartData([{
                id: startDate + " - " + endDate,
                color: "hsl(175, 70%, 50%)",
                data: formattedList
            }]);
            
          });
      }

    return (
        <>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <LocationSelect />
                <DatePicker label='Start'/>
                <DatePicker label='End'/>
                <Button onClick={changeChart} variant="contained" color="primary">
                    Start
                </Button>
            </Grid>
            <div style={{ height: 500 }}>
                <LineChart data={chartData}/>
            </div>
        </>
    );
}

export default MaxTempVisualization;