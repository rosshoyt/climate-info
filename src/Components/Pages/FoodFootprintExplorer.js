import React, { useEffect, useState } from 'react'
import Data from '../../Data/food-footprints/food-footprints-per-kg.json' 
import BarChart from '../Charts/BarChart'

export default function FoodFootprintExplorer() {
  useEffect(() => {
  }, []);

  const key = "GHG emissions per kilogram";

  return (
    <>
      <h1>
        Food Footprint Explorer (Work In Progress)
      </h1>
      <div style={{ height: 900, width: "99%"}}>
        <BarChart data={Data.sort((a,b) => a[key] - b[key])} keys={[key]} indexBy={"Entity"} yAxisLabel={"GHG emissions per kilogram"}/>
      </div>
    </>
  )
}
