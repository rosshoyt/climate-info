import React from 'react';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { useTheme } from '@material-ui/core/styles';
import useWindowDimensions from '../../Utils/WindowUtils';

const TimeRangeChart  = ({ data, handleDateClicked}) => {
  const { height, width } = useWindowDimensions();
  const theme = useTheme();
 
  return (
    <div style={{height: width/6, width:"99%"}}>
      <ResponsiveTimeRange
        theme={{ textColor: theme.palette.type == "dark" ? '#ffffff' : '#000000' }}
        data={data}
        from="2017-01-01"
        to="2017-12-31"
        domain={[1,150]}
        colors={[ '#61cdbb', '#ededed']}
        margin={{ top: 30, right: 40, bottom: 20, left: 40 }}
        dayBorderWidth={2}
        dayBorderColor="#000000"
        daySpacing={4}
        monthLegendPosition='before'
        monthLegendOffset={20}
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
    </div>
  );
}

export default TimeRangeChart;