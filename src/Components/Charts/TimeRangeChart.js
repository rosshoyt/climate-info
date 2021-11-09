import React from 'react';
import { ResponsiveTimeRange } from '@nivo/calendar';
const TimeRangeChart  = ({ data, handleDateClicked }) => {

  return (
    <ResponsiveTimeRange
      data={data}
      from="2018-01-01"
      to="2018-12-31"
      domain={[1,150]}
      colors={[ '#61cdbb', '#ededed']}//'#97e3d5', '#e8c1a0', '#f47560' ]}
      //colors={[ '#61cdbb','#97e3d5', '#e8c1a0', '#f47560' ]}
      //margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
      dayBorderWidth={2}
      dayBorderColor="#000000"
      daySpacing={4}
      monthLegendPosition='after'
      monthLegendOffset={175}
      onClick={(day,event)=>handleDateClicked(day, event)}
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

export default TimeRangeChart;