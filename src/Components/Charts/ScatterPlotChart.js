import React from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import scatter from '../../Data/nivo-default-data/scatter';
import useStore from '../../store';
import { line } from 'd3-shape';

const ScatterPlotChart = ({ data=scatter/* see data tab */ }) => {
    const yearInfo = useStore(state => state.years);
    function getColor(year) {
        return yearInfo.find(y => y.year === year).color;
    }
    return (
        <ResponsiveScatterPlot
            data={data}
            //colors={{ datum: 'data.color' }}
            colors={(node) => {
                return getColor(node.serieId);
            }}
            theme={{
                fontSize: 16,
            }}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'point', min: 0, max: 'auto' }}
            xFormat=" >-.2f"
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yFormat=">-.2f"
            blendMode="multiply"
            nodeSize={18}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendPosition: 'middle',
                legendOffset: 46
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Temperature (F)',
                legendPosition: 'middle',
                legendOffset: -60
            }}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 130,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 12,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    symbolSize: 20,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            layers={[
                "grid",
                "axes",
                Line,
                "nodes",
                "markers",
                "mesh",
                "annotations",
                "legends",
              ]}
        />
    );

    function Line({ data, nodes, xScale, yScale}) {
        // use the d3 line generator line()
        const lineGenerator = line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        // a list to hold each line ID and its list of points
        const averagedLineData = [];
    
        // look at each time series (data.data)
        data.forEach(({id, data }) => {
            const tracking = {}
            // look at each datum in the time series and track averages

            data.forEach(({x, y}) => {
                if(tracking.hasOwnProperty(x)){
                    tracking[x].total += y;
                    tracking[x].num++; 
                } else {
                    tracking[x] = {
                        total: y,
                        num: 1
                    }
                }
            });
            
            // calculate the averages for this timeseries
            const avgs = [];
            Object.entries(tracking).forEach(([key, value])=> {
                avgs.push({ x: key, y: value.total / value.num })
            });
            // add to list
            averagedLineData.push({ id: id, data: avgs})
        });
    
        return averagedLineData.map(({ id, data }, index) => {
            return (<path
                key={id}
                d={lineGenerator(data)}
                fill="none"
                stroke={getColor(id)}
                // TODO improve style
                style={
                index % 2 === 0
                    ? {
                        // simulate line will dash stroke when index is even
                        strokeDasharray: "3, 6",
                        strokeWidth: 3
                    }
                    : {
                        // simulate line with solid stroke
                        strokeWidth: 3
                    }
                }
            />);
        });
        
    };
}
export default ScatterPlotChart;