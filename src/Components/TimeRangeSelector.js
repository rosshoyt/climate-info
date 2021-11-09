import React, { useState, useEffect } from 'react';

import { ResponsiveTimeRange } from '@nivo/calendar';
import { CircularProgress } from '@material-ui/core';
import TimeRangeChart from './Charts/TimeRangeChart'
import moment from "moment";
function getTimeRangeData() {
  console.log('getting timerange data')
  let array = [];
  const currentMoment = moment('2017-01-01', 'YYYY-MM-DD');
  const endMoment = moment('2018-01-01', 'YYYY-MM-DD');
  let currVal = 0
  while (currentMoment.isBefore(endMoment, 'day')) {
    //console.log(`Loop at ${currentMoment.format('YYYY-MM-DD')}`);
    array.push({
      "value": 0,
      "day": currentMoment.format('YYYY-MM-DD')
    })
    currentMoment.add(1, 'days');
    currVal++;
  }
  console.log(array);
  return array;
}

const TimeRangeSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [timeRangeData, setTimeRangeData] = useState(getTimeRangeData());

  useEffect(() => {
  }, [])

 
  // TODO get custom tooltip, only show Month/day of hover
  function getTooltip(){

  }
  function dateClicked(day, event){
    console.log('clicked', day, 'event', event);
    
    setTimeRangeData(timeRangeData.map(dayValPair => ({
      ...dayValPair,
      value: dayValPair.day === day.day ? 100 : dayValPair.value
    })));
    
    console.log(timeRangeData)
  }
  return (
     <>
      { isLoading ? (
        <CircularProgress />) : (
          <TimeRangeChart data={timeRangeData} handleDateClicked={dateClicked}/>
    ) }
    </>
  );
}

export default TimeRangeSelector;