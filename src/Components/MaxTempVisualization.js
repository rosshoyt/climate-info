import React, { useState } from 'react';
import LocationSelect from './LocationSelect';
import { Grid, Button } from '@material-ui/core';
import LineChart from './Charts/LineChart';


const MaxTempVisualization = () => {
    const [chartData, setChartData] = useState([
        {
          id: "japan",
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

      function changeChart() {
        console.log('Pressed button!');
        setChartData([
          {
            id: "japan",
            color: "hsl(221, 70%, 50%)",
            data: [
              {
                x: "new planes",
                y: 403
              },
              {
                x: "helicopter",
                y: 234
              }
            ]
          },
          {
            id: "france",
            color: "hsl(175, 70%, 50%)",
            data: [
              {
                x: "new planes",
                y: 400
              },
              {
                x: "helicopter",
                y: 2
              }
            ]
          }
        ]);
      }

    return (
        <>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <LocationSelect />
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