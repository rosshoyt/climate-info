import React, { useState } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import scatter from '../../Data/nivo-default-data/scatter';
import useStore from '../../store';
import { line, curveNatural } from 'd3-shape';
import { Box, Slider, Grid, Typography, CircularProgress } from '@material-ui/core/';
import { useTheme } from '@material-ui/core/styles';

const ScatterPlotChart = ({ data=scatter/* see data tab */ }) => {
    const theme = useTheme(); // theme.spacing

    const [lineWidth, setLineWidth] = useState(10);
    const [pointSize, setPointSize] = useState(5);
    
    const yearList = useStore(state => state.years);
    
    function getColor(year) {
        var yearEntry = yearList.find(y => y.year === year);
        return yearEntry === undefined ? 'green' : yearEntry.color; 
    }
    return (
        <>  
            <div style={{ height: 800 }}>
            { data.length === 0 ? (
              // TODO center progress spinner vertically
              // TODO update on each API call return; or, overlay spinner on graph while it has partial results
              <CircularProgress />
            ) : (
                <ResponsiveScatterPlot
                    data={data}
                    //colors={{ datum: 'data.color' }}
                    colors={(node) => {
                        return getColor(node.serieId);
                    }}
                    theme={{
                        fontSize: 16,
                        textColor: theme.palette.type == "dark" ? '#ffffff' : '#000000'
                    }}
                    margin={{ top: 40, right: 100, bottom: 65, left: 70 }}
                    xScale={{ type: 'point', min: 0, max: 'auto' }}
                    xFormat=" >-.2f"
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    yFormat=">-.2f"
                    blendMode="multiply"
                    nodeSize={pointSize}
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
                            anchor: 'top-right',
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
                />)}
            </div>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                <Grid  xs={12} lg={6} container direction="row">    
               
                    <Grid item xs={12} lg={2}>
                        <Typography gutterBottom>Line Size:</Typography>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Slider 
                        key={`slider-${0}`}
                            defaultValue={ lineWidth }
                            onChange={ (e, newValue) => setLineWidth(newValue) }
                            getAriaValueText={ (value) => `${value}` }
                            aria-labelledby=" asdf"
                            step={5}
                            marks
                            min={0}
                            max={50}
                            valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            
                <Grid  xs={12} lg={6} container direction="row"> 
                    <Grid item xs={12} lg={2}>
                        <Typography gutterBottom>Point Size:</Typography>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        
                        <Slider
                        key={`slider-${1}`}
                            defaultValue={ pointSize }
                            onChange={ (e, newValue) => setPointSize(newValue) }
                            getAriaValueText={ (value) => `${value}` }
                            aria-labelledby="asdf "
                            step={3}
                            marks
                            min={0}
                            max={30}
                            valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );

    function Line({ data, nodes, xScale, yScale}) {
        // use the d3 line generator line()
        const lineGenerator = line().curve(curveNatural)
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
                // TODO improve line style controls
                style={{
                        // strokeDasharray: "3, 6",
                        strokeWidth: lineWidth
                }}
            />);
        });
        
    };
}
export default ScatterPlotChart;