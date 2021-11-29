import React from 'react'
import RangeSlider from './RangeSlider'
import moment from 'moment';

export default function DateRangeSlider({ dayRange, setDayRange }) {
  
  function rangeChangeCommitted(event, value){
    const date1 = moment().dayOfYear(value[0])
    const date2 = moment().dayOfYear(value[1])
    
    setDayRange([moment(date1).format('MM-DD'), moment(date2).format('MM-DD')]);
  }
  
  // TODO format a value label for the slider
  // function valueLabelFormat(value) {
  //   console.log('in valuelabelformat', value)
  //   return 'asd';
  // }
  function convertStartingDayRange(){
    const dayNums = [];
    dayRange.forEach(date => {
      dayNums.push(moment(date, 'MM-DD').dayOfYear());
    });
    // console.log('setting default vals', dayNums);
    return dayNums;
  }

  return (
    <RangeSlider
      onChangeCommitted={rangeChangeCommitted}
      startingValue={convertStartingDayRange}
    />
  )
}
