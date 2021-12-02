import React, { useEffect, useState } from 'react'
import Data from '../../Data/food-footprints/food-footprints-per-kg.json' 
import BarChart from '../Charts/BarChart'
import { Typography } from '@material-ui/core';

export default function FoodFootprintExplorer() {
  useEffect(() => {
  }, []);

  const key = "GHG emissions per kilogram";

  return (
    <>
     <Typography variant='h4' align='center' fontWeight="fontWeightBold">
        Food Footprints
      </Typography>
      <div style={{ height: 900, width: "99%"}}>
        <BarChart data={Data.sort((a,b) => a[key] - b[key])} keys={[key]} indexBy={"Entity"} bottomAxisLabel={key}/>
      </div>
    </>
  )
}
