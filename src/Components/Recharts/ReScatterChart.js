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
import { CircularProgress } from "@material-ui/core";


export default function ReScatterChart() {
  const rawData = useStore(state => state.rawData); 
   useEffect(() => {
     
   }, [rawData])

  const  processTimeseries = (noaaTimeseries) => {
    // return dummy data TODO implement
    return [
      { x: 10, y: 100},
      { x: 3, y: 50}
    ]
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
      <XAxis type="number" dataKey="x" name="stature" unit="cm" />
      <YAxis type="number" dataKey="y" name="weight" unit="kg" />
      <ZAxis
        type="number"
        dataKey="z"
        range={[60, 400]}
        name="score"
        unit="km"
      />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Legend />
      { 
         <>
         { rawData.length === undefined || rawData.length === 0 ? (
             <CircularProgress/>
         ) : (
           rawData.map((noaaTimeseries, child, index) => {
             return (
             
                 <Scatter name="A school" data={processTimeseries(noaaTimeseries)} fill="#8884d8" shape="star" />
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
