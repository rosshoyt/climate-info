import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import TimeRangeChart from './Charts/TimeRangeChart'
import moment from "moment";


// TODO figure out why this method being called more than at the start
function getDefaultTimeRangeData() {
  console.log('getting default timerange data')
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
  return array;
}

const TimeRangeSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [timeRangeData, setTimeRangeData] = useState(getDefaultTimeRangeData());

  useEffect(() => {
  }, [])

 
  // TODO get custom tooltip, only show Month/day of hover
  //function getTooltip(){}

  const [isSelectingSecondDate, setIsSelectingSecondDate] = useState(false);

  const [date1, setDate1] = useState(null);

  function dateIsInRange(date, dateMin, dateMax){
    let dateMoment = moment(date, 'YYYY-MM-DD');
    console.log('Checking if is in range', dateMin, dateMax);
    if(dateMoment.isSame(dateMin) || dateMoment.isSame(dateMax)) {
      console.log('Date is same as a start or end date!');
      return true;
    } 
    else if(dateMoment.isBetween(dateMin, dateMax)){
      console.log('Date is in between start or end date!');
      return true;
    }
    return false;
  }

  function dateClicked(day, event){
    if(isSelectingSecondDate){
      console.log('Selected second date', day.day);

      setTimeRangeData(timeRangeData.map(dayValPair => ({
        ...dayValPair,
        value: dateIsInRange(dayValPair.day, date1, day.day) ? 100 : dayValPair.value
      })));
      

    } else {
      // TODO clear any existing selections: setTimeRangeData(defData) doesn't work because of useState slow
      // google await setState
      //setTimeRangeData(getDefaultTimeRangeData());
      
      console.log('Selected first date');  
      setDate1(day.day);
      //console.log('Testing Date1 val', date1);
      setTimeRangeData(timeRangeData.map(dayValPair => ({
        ...dayValPair,
        value: dayValPair.day === day.day ? 100 : dayValPair.value
      })));

    }
    setIsSelectingSecondDate(!isSelectingSecondDate);
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