/* eslint max-len:0 */
import React, { useState, useEffect } from "react";
import _ from "underscore";
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

    const [minYValue, setMinYValue] = useState(0);
    const [maxYValue, setMaxYValue] = useState(140);

    const [hover, setHover] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const [selection, setSelection] = useState(null);
    const [tracker, setTracker] = useState(null);
    const [timerange, setTimerange] = useState(null);
    const [columns, setColumns] = useState([]);
    
    const rawData = useStore(state => state.rawData); 
    const tmsrsInfoList = useStore(state => state.timeseriesList);

    const [lineSeries, setLineSeries] = useState(null);
    const [lineStyles, setLineStyles] = useState(null);
    const [lineColumns, setLineColumns] = useState(null);

    const getStationTmsrsId = (datum, tmsrsID) => {
        return tmsrsID + '-' + datum.station;
    }

    // TODO
    const getColor = (tmsrsIDNumber) => {
        // TODO optimize
        return tmsrsInfoList.map(tmsrs => tmsrs.color)[tmsrsIDNumber]
    }

    useEffect(() => {
        console.log('in scatterplot useeffect, rawData = ', rawData);
        
        // assume data was sorted (first by date, for same date, by stationID alphabetical)
        
        let dateToReadingsListMap = new Map();
        //let stationIDToReadingsListIndexMap = new Map();
        // a list that tracks the column index a reading should go in using  (station+timeseriesID)
        let stationTmsrsCombinedIdList = [] // basically, the columns array
        
        let timeseriesDailyAveragesMap = new Map(); // array to hold the averages per day readings
        if(rawData !== undefined){
            rawData.forEach(noaaTimeseries => {
                
                if(noaaTimeseries.data !== undefined){    
                    // a map<date, list<entries>> to track the values per-day for this individual timeseries
                    let tmsrsPerDateTempTotalsMap = new Map();
                    
                    noaaTimeseries.data.forEach(datum => {
                        const dayMonth = moment(datum.date).format('MM-DD');
                        
                        // update the average tracking map
                        if(tmsrsPerDateTempTotalsMap.has(dayMonth)){
                            tmsrsPerDateTempTotalsMap.get(dayMonth).push(datum.value);
                        }else {
                            tmsrsPerDateTempTotalsMap.set(dayMonth, [datum.value]);
                        }
                        
                        const stationTmsrsID = getStationTmsrsId(datum, noaaTimeseries.id);
                        console.log(stationTmsrsID)
                        
                        let insertionIndex = stationTmsrsCombinedIdList.indexOf(stationTmsrsID);
                        // haven't seen this station yet in this timeseries, add to list and get new insertion index
                        if(insertionIndex == -1) {
                            insertionIndex = stationTmsrsCombinedIdList.push(stationTmsrsID) - 1;
                        }
                        
                        // check if this MM-DD is being tracked yet
                        if(dateToReadingsListMap.has(dayMonth)){
                            let readingsList = dateToReadingsListMap.get(dayMonth);
                            if(readingsList.length > insertionIndex){
                                // there is room in array, we can insert right away
                                // (this should be replaceing a null value)
                                readingsList[insertionIndex] = datum;
                            } else if(readingsList.length === insertionIndex){
                                // we need to push it at the end of the array
                                readingsList.push(datum);
                            } else {
                                // we need to add a list of null values and then add the value to the end
                                let padLength = insertionIndex + 1 - readingsList.length;
                                let listPad = new Array(padLength).fill(null);
                                
                                let extendedReadingsList = readingsList.concat(listPad);
                                extendedReadingsList[insertionIndex] = datum;
                                dateToReadingsListMap.set(dayMonth, extendedReadingsList)
                            }
                        } else {
                            if(insertionIndex === 0) {
                                let readings = [datum];
                                // add the new date
                                dateToReadingsListMap.set(dayMonth, readings);
                                //readingsListLength = 1;
                            } else{
                                // we need to add a list of null values and then add the value to the end
                                let newReadingsList = new Array(insertionIndex + 1).fill(null);
                                newReadingsList[insertionIndex] = datum;
                                dateToReadingsListMap.set(dayMonth,newReadingsList)
                            }
                        }
                    
                    });
                    
                    console.log('tmsrsPerDateTemptotalsmap', tmsrsPerDateTempTotalsMap, 'type is', tmsrsPerDateTempTotalsMap);

                 
                    // convert the map values from list of readings to an average reading
                    tmsrsPerDateTempTotalsMap.forEach(function(readingsList, date, map) {
                        let accum = 0;
                        readingsList.forEach(value => {
                            accum += value;
                        }); 
                        map.set(date, accum / readingsList.length);
                    });

                    console.log('averages', tmsrsPerDateTempTotalsMap);
                    timeseriesDailyAveragesMap.set(noaaTimeseries.id, tmsrsPerDateTempTotalsMap);
                }
                
                
            })


            if(rawData.length > 0){
                console.log(dateToReadingsListMap);
                // create dummy array of columns

                // for(let i = 0; i < rawData.length; i++){
                //     for(let j = 0; j < )
                //     // create an ID string for each column
                //     columns.push(i.toString() + '-' + i);
                // }
                let cols = ["time"].concat(stationTmsrsCombinedIdList);
                console.log('cols:', cols)

                // for(let i = 0; i < maxNumReadingsPerDay; i++){
                //     cols.push(i.toString());
                // }
                // console.log(cols);
                
                const newPoints = [];

                dateToReadingsListMap.forEach((readingsList, date) => {
                    const time = moment(date + '-2017', 'MM-DD-YYYY');
                    // let randomVar = (Math.random() - 0.5) * 60_000 * 1000;
                    newPoints.push([
                        time.toDate().getTime(),
                        ...readingsList.map(reading => reading === null ? null : reading.value)
                    ]);
                    
                });
                const ts = new TimeSeries({
                    name: "TMAX", // TODO replace with current datatype
                    columns: cols,
                    points: newPoints
                });
                console.log('new points', newPoints)
                



                
                console.log('creating linear timeseries from these dataz', timeseriesDailyAveragesMap);

                let length = timeseriesDailyAveragesMap.size + 1;
                let lineSeriesCols = new Array(length);
                lineSeriesCols[0] = 'time';
                let linePointsMap = new Map()
                let index = 1; // unix time will be index 1
                timeseriesDailyAveragesMap.forEach((dailyAverageMap, id, theMap) => {
                    lineSeriesCols[index] = id.toString();
                    dailyAverageMap.forEach((value, date) => {
                        if(linePointsMap.has(date)){
                            linePointsMap.get(date)[index] = value;
                        }else{
                            let valuesArray = new Array(length);
                            // set the first entry, the time
                            valuesArray[0] = moment(date + '-2017', 'MM-DD-YYYY').toDate().getTime();
                            valuesArray[index] = value;
                            linePointsMap.set(date, valuesArray);
                        }
                    })
                    index++;
                });
                
                const lnCols = lineSeriesCols.slice(1)
                console.log('line series columns',lineSeriesCols, 'lnCols = ', lnCols)

                const linePoints = [...linePointsMap].map(([key, value]) => ( value ));
                // console.log('working points array: newPoints,', newPoints, 'linePoints', linePoints)
             
                
                const lnStyles = styler([...lnCols].map(([key, value]) => ({ key: key, color: getColor(Number(key)), width: 4 })))
                console.log('line styles', lnStyles)
                setLineStyles(lnStyles)
                setLineSeries(new TimeSeries({
                    name: "averages",
                    columns: lineSeriesCols,
                    points: linePoints//[[1234444, 94]]
                }));
                setLineColumns(lnCols)
 
                setColumns(cols);
                setTimerange(ts.range());

                // calculate the max and min Y values for graph
                // TODO refactor timeseries averaging to utilize the series.average() method
                let newYMin = Number.MAX_SAFE_INTEGER, newYMax = Number.MIN_SAFE_INTEGER;
                cols.forEach((col) => {
                    if(col !== 'time'){
                        newYMax = Math.max(ts.max(col), newYMax);
                        newYMin = Math.min(ts.min(col), newYMin);
                        console.log('After looking at col', col, 'newMax/newMin=', newYMax, newYMin)
                    }
                })
                setMinYValue(newYMin)
                setMaxYValue(newYMax)


                // this must be set last, because chart starts to render once
                // series isn't null or undefined
                setSeries(ts);
            }
        }
    }, [rawData, tmsrsInfoList])


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
        
        // get the color using the first character of the column string name (the timeseries ID number)
        const color = getColor(Number(column[0])); // === '1' ? 'green' : 'blue';//heat[Math.floor((1 - event.get(column) / 40) * 9)];
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
                                // trackerPosition={tracker}
                                // trackerStyle={{
                                //     box: {
                                //         fill: "black",
                                //         color: "#DDD"
                                //     },
                                //     line: {
                                //         stroke: "red",
                                //         strokeDasharray: 2
                                //     }
                                // }}
                                maxTime={series.range().end()}
                                minTime={series.range().begin()}
                                enablePanZoom={true}
                                onBackgroundClick={() => setSelection(selection)}
                                onTimeRangeChanged={timerange => setTimerange(timerange)}
                                onTrackerChanged={tracker => setTracker(tracker)}
                            >
                                <ChartRow
                                    height="500"
                                    debug={false}
                                    trackerInfoWidth={125}
                                    trackerInfoHeight={30}
                                    trackerInfoValues={infoValues}
                                >
                                    <YAxis
                                        id="Temperature (F)"
                                        label="Temperature (F)" 
                                        labelOffset={-5}
                                        min={minYValue}
                                        max={maxYValue}//series.max("station1")}
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
                                        <LineChart
                                                axis="Temperature (F)"
                                                //breakLine={false}
                                                series={lineSeries}
                                                columns={lineColumns}
                                                style={lineStyles}
                                                interpolation="curveBasis"
                                                // highlight={}//this.state.highlight}
                                                // onHighlightChange={highlight => }
                                                //     this.setState({ highlight })
                                                // }
                                                // selection={this.state.selection}
                                                // onSelectionChange={selection =>
                                                //     this.setState({ selection })
                                                // }
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
