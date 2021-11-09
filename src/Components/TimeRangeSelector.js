import React, { useEffect } from 'react';
import moment from "moment";
import { ResponsiveTimeRange } from '@nivo/calendar';
import defaultData from '../Data/nivo-default-data/timerange';
// website examples showcase many properties,
// you'll often use just a few of them.
const TimeRangeSelector = ({ data=defaultData /* see data tab */ }) => {
  
  function getTimerangeData() {
    let array = [];
    const currentMoment = moment('2017-01-01', 'YYYY-MM-DD');
    const endMoment = moment('2018-01-01', 'YYYY-MM-DD');
    while (currentMoment.isBefore(endMoment, 'day')) {
      //console.log(`Loop at ${currentMoment.format('YYYY-MM-DD')}`);
      array.push({
        "value": 1,
        "day": currentMoment.format('YYYY-MM-DD')
      })
      // {
    //   "value": 200,
    //   "day": "2018-07-09"
    // },
      currentMoment.add(0, 'days');
    }
    return array;
  }

  return (
    <ResponsiveTimeRange
      data={data}
      from="2018-01-01"
      to="2018-12-31"
      emptyColor="#ededed"
      colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
      //margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
      dayBorderWidth={2}
      dayBorderColor="#000000"
      // legends={[
      //     {
      //         anchor: 'bottom-right',
      //         direction: 'row',
      //         justify: false,
      //         itemCount: 4,
      //         itemWidth: 42,
      //         itemHeight: 36,
      //         itemsSpacing: 14,
      //         itemDirection: 'right-to-left',
      //         translateX: -60,
      //         translateY: -60,
      //         symbolSize: 20
      //     }
      // ]}
    />
  );
}

export default TimeRangeSelector;