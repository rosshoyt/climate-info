/* eslint max-len:0 */
import React, { useState, useEffect } from "react";
import _ from "underscore";
import Moment from "moment";
import { format } from "d3-format";
import useStore from '../../store';
import moment from "moment";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import { ChartContainer, ChartRow, Charts, YAxis, ScatterChart, LineChart, styler, BandChart, Resizable, } from "react-timeseries-charts";

import { CircularProgress } from "@material-ui/core";
//
// Read in the weather data and add some randomness and intensity for fun
//

//
// Render scatter chart
//

export default function ScatterChartExample() {
    /// the main timeseries data
    const [series, setSeries] = useState(null);

    const [hover, setHover] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const [selection, setSelection] = useState(null);
    const [tracker, setTracker] = useState(null);
    const [timerange, setTimerange] = useState(null);
    const [columns, setColumns] = useState([]);  

    const rawData = useStore(state => state.rawData); 

    useEffect(() => {
        console.log('in scatterplot useeffect, rawData = ', rawData);
        // assume data was sorted (first by date, for same date, by stationID alphabetical)
        let dateToReadingsListMap = new Map();
        // let columns = [];
        let maxNumReadingsPerDay = 0;
        let numColumnsPerTimeseries = []
        rawData.forEach(noaaTimeseries => {
            noaaTimeseries.data.forEach(datum => {
                const dayMonth = moment(datum.date).format('MM-DD');
                
                let readingsListLength = 0; // track the most entries 
                if(dateToReadingsListMap.has(dayMonth)){
                    readingsListLength = dateToReadingsListMap.get(dayMonth).push(datum);
                } else {
                    let readings = [datum];
                    dateToReadingsListMap.set(dayMonth, readings);
                    readingsListLength = 1;
                }
                maxNumReadingsPerDay = Math.max(readingsListLength, maxNumReadingsPerDay);
            });
           
            // normalize the lists so theyre the same length 
            // TODO instead, should ensure (during first data processing) that each station stays in exact same column
            dateToReadingsListMap.forEach((readingsList, date) => {
                const difference = maxNumReadingsPerDay - readingsList.length;
                console.log(difference)
                if(difference > 0){
                    // pad the array with null values
                    for(let i = 0; i < difference; i++){
                        readingsList.push(null);
                    }
                }
            })
            
        })

        if(rawData.length > 0){
            console.log(dateToReadingsListMap);
            // create dummy array of columns

            // for(let i = 0; i < rawData.length; i++){
            //     for(let j = 0; j < )
            //     // create an ID string for each column
            //     columns.push(i.toString() + '-' + i);
            // }
            let cols =  ["time"];
            for(let i = 0; i < maxNumReadingsPerDay; i++){
                cols.push(i.toString());
            }
            console.log(cols);
            
            const newPoints = []

            dateToReadingsListMap.forEach((readingsList, date) => {
                const time = moment(date + '-2017', 'MM-DD-YYYY')
                newPoints.push([
                    time.toDate().getTime(),
                    ...readingsList.map(reading => reading === null ? null : reading.value)
                ]);
                // let readingsList = []
                
                // newPoints.push([])
            });


            const ts = new TimeSeries({
                name: "TMAX", // TODO replace with current datatype
                columns: cols,
                points: newPoints
            });
            // set the state variables
            setColumns(cols);
            setTimerange(ts.range());
            // this must be set last, because chart starts to render once
            // series isn't null or undefined
            setSeries(ts);
        }
        
    }, [rawData])


    const handleSelectionChanged = point => {
        setSelection(point);
    };

    const handleMouseNear = point => {
        setHighlight(point);
    };

    const formatter = format(".2f");
    let text = `Speed: - mph, time: -:--`;
    let infoValues = [];
    if (highlight) {
        const speedText = `${formatter(highlight.event.get(highlight.column))} mph`;
        text = `
            Speed: ${speedText},
            time: ${highlight.event.timestamp().toLocaleTimeString()}
        `;
        infoValues = [{ label: "Speed", value: speedText }];
    }

    const heat = [
        "#023858",
        "#045a8d",
        "#0570b0",
        "#3690c0",
        "#74a9cf",
        "#a6bddb",
        "#d0d1e6",
        "#ece7f2",
        "#fff7fb"
    ]; 

    const perEventStyle = (column, event) => {

        //console.log('event:', event, 'column', column)
        //console.log('event.get(\"column\"', event.get("station1"))
        const color = column == 'station1' ? 'blue' : 'green';//heat[Math.floor((1 - event.get(column) / 40) * 9)];
        return {
            normal: {
                fill: color,
                opacity: 1.0
            },
            highlighted: {
                fill: color,
                stroke: "none",
                opacity: 1.0
            },
            selected: {
                fill: "none",
                stroke: "#2CB1CF",
                strokeWidth: 3,
                opacity: 1.0
            },
            muted: {
                stroke: "none",
                opacity: 0.4,
                fill: color
            }
        };
    };

    const timeAxisStyle = {
        values: { valueColor: "Green", valueWeight: 200, valueSize: 12 }
    };

    const YAxisStyle = {
        axis: { axisColor: "#C0C0C0" },
        label: { labelColor: "Blue", labelWeight: 100, labelSize: 12 },
        values: { valueSize: 12 }
    };

    return (
        <div>
            <div className="row">
                {/* <div className="col-md-12">{text}</div> */}
            </div>
            <>
            { series === null || series === undefined ? (
                <CircularProgress/>
            ) : (
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={timerange}
                                timeAxisStyle={timeAxisStyle}
                                timeAxisTickCount={10}
                                trackerPosition={tracker}
                                trackerStyle={{
                                    box: {
                                        fill: "black",
                                        color: "#DDD"
                                    },
                                    line: {
                                        stroke: "red",
                                        strokeDasharray: 2
                                    }
                                }}
                                maxTime={series.range().end()}
                                minTime={series.range().begin()}
                                enablePanZoom={true}
                                onBackgroundClick={() => setSelection(selection)}
                                onTimeRangeChanged={timerange => setTimerange(timerange)}
                                onTrackerChanged={tracker => setTracker(tracker)}
                            >
                                <ChartRow
                                    height="150"
                                    debug={false}
                                    trackerInfoWidth={125}
                                    trackerInfoHeight={30}
                                    trackerInfoValues={infoValues}
                                >
                                    <YAxis
                                        id="Temperature (F)"
                                        label="Temperature (F)"
                                        labelOffset={-5}
                                        min={0}
                                        max={140}//series.max("station1")}
                                        style={YAxisStyle}
                                        width="70"
                                        type="linear"
                                        format=",.1f"
                                    />
                                    <Charts>
                                        <ScatterChart
                                            axis="Temperature (F)"
                                            series={series}
                                            columns={columns}
                                            style={perEventStyle}
                                            // info={infoValues}
                                            // infoHeight={28}
                                            // infoWidth={110}
                                            // infoOffsetY={10}
                                            // infoStyle={{ box: {
                                            //     fill: "black",
                                            //     color: "#DDD"
                                            // }}}
                                            format=".1f"
                                            selected={selection}
                                            onSelectionChange={p => handleSelectionChanged(p)}
                                            onMouseNear={p => handleMouseNear(p)}
                                            highlight={highlight}
                                            radius={ 2 } //(event, column) => column === "station1" ? 3 : 2 }
                                        />
                                    
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                
                </div>
            )}</>
        </div>
    )
}
