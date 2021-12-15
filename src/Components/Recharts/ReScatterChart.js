// see https://codesandbox.io/s/scatter-chart-of-three-dimensions-forked-g43gf?file=/src/App.tsx:0-1576
import React, { useState, useEffect } from "react";
import useStore from '../../store';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import moment from "moment";
import { CircularProgress, Typography } from "@material-ui/core";


export default function ReScatterChart() {
  const rawData = useStore(state => state.rawData); 
  const timeseriesInfoList = useStore(state => state.timeseriesList);

  const [firstDay, setFirstDay] = useState(365);
  const [lastDay, setLastDay] = useState(0);

  useEffect(() => {
     
  }, [rawData])

  const  processTimeseries = (noaaTimeseries) => {

    let array = []
    if(noaaTimeseries.data !== undefined) {
      
      array = noaaTimeseries.data.map(datum => {
        let dayOfYear = moment(datum.date).dayOfYear();
        
        return {
          x: dayOfYear,
          y: datum.value
        }
      })
    }

    console.log(array)
    return array;
  }
  const renderCustomAxisTick = ({ x, y, payload }) => {
    let path = '';
    

     
    return (
      <>asdf</>
    );
  };
  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
  return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`value: ${value}`}</text>;
  };
  
// function CustomTooltip({ payload, label, active }) {
//   if (active) {
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value}`}</p>
//         <p className="intro">{getIntroOfPage(label)}</p>
//         <p className="desc">Anything you want can be displayed here.</p>
//       </div>
//       );
//     }
//   return null;
//   }

  function getColor(id) {
    var timseriesInfo = timeseriesInfoList.find(y => y.id === id);
    return timseriesInfo === undefined ? 'green' : timseriesInfo.color; 
  }

  return (
    <ScatterChart
      width={800}
      height={600}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }}
    >
      <CartesianGrid />
      
      <XAxis type="number" dataKey="x" name="stature" unit="" 
        //ticks={[100, 120, 140, 160, 180]} 
        domain={[150, 175]} 
      //tickCount={10}
      //range={[150,200]} 
        //scale="utc"
      />
      <YAxis type="number" dataKey="y" name="weight" unit="kg" domain={[50, 120]}/>
      
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Legend />
      { 
         <>
         { rawData.length === undefined || rawData.length === 0 ? (
             <CircularProgress/>
         ) : (
           rawData.map((noaaTimeseries, child, index) => {
             return (
             
                 <Scatter name="A school" data={processTimeseries(noaaTimeseries)} fill={getColor(noaaTimeseries.id)} shape="point" />
             )
           })
           )
          }
        </>
      }
      {/* <Scatter name="A school" data={getData1()} fill="#8884d8" shape="star" />
      <Scatter name="B school" data={getData1()} fill="#82ca9d" shape="triangle" />*/}
    </ScatterChart> 
  );

  
}
