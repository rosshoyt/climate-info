/* eslint max-len:0 */
import React, { useState, useEffect } from "react";
import _ from "underscore";
import { format } from "d3-format";
import moment from "moment";
import useStore from '../../store';
import useCDEGraphSettingsStore from "../CDEGraphSettingsStore";

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import { ChartContainer, ChartRow, Charts, YAxis, ScatterChart, LineChart, styler, BandChart, Resizable, Legend } from "react-timeseries-charts";

import { CircularProgress, Typography } from "@material-ui/core";
//
// Read in the weather data and add some randomness and intensity for fun
//

//
// Render scatter chart
//

export default function ScatterChartExample( { height }) {
    /// the main timeseries data
    const [series, setSeries] = useState(null);

    const [minYValue, setMinYValue] = useState(0);
    const [maxYValue, setMaxYValue] = useState(140);

    const [hover, setHover] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const [selection, setSelection] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [tracker, setTracker] = useState(null);
    const [timerange, setTimerange] = useState(null);
    const [columns, setColumns] = useState([]);
    
    const rawData = useStore(state => state.rawData); 
    const tmsrsInfoList = useStore(state => state.timeseriesList);

    const [lineSeries, setLineSeries] = useState(null);
    const [lineStyles, setLineStyles] = useState(null);
    const [lineColumns, setLineColumns] = useState(null);


    const [fontFamily, setFontFamily] = useState('roboto');
    const [axisLabelFontSize, setAxisLabelFontSize] = useState(17);
    const [axisValueFontSize, setAxisValueFontSize] = useState(13);


    const [legendCategories, setLegendCategories] = useState(null);
    const [legendStyle, setLegendStyle] = useState(null);

    
    const lineWidth = useCDEGraphSettingsStore(state => state.lineWidth);
    const pointSize = useCDEGraphSettingsStore(state => state.pointSize);

    const dataType = useStore(state => state.dataType)
    
    

    const getStationTmsrsId = (datum, tmsrsID) => {
        return tmsrsID + '-' + datum.station;
    }
    

    const getTimeseriesYearFromID = (tmsrsID) => {
        return tmsrsInfoList.map(tmsrs => tmsrs.year)[tmsrsID];
    }

    // TODO
    const getColor = (tmsrsIDNumber) => {
        // TODO optimize
        return tmsrsInfoList.map(tmsrs => tmsrs.color)[tmsrsIDNumber]
    }

    const getYear = (tmsrsIDNumber) => {
        return tmsrsInfoList.map(tmsrs => tmsrs.id)[tmsrsIDNumber]
    }

    const handleSelectedPointChanged = point => {
        console.log('Graph selection:', point)
        setSelection(point);
        setSelectedPoint(point);
    };

    // const handleMouseNear = point => {
    //     setHighlight(point);
    // };

    const formatInfoTextForPoint = (point) => {
        if(point !== null){
            let timeText = "Date: " + moment(point.event.timestamp()).set('year', getTimeseriesYearFromID(Number(point.column[0]))).format("MMMM DD, YYYY");            //let m = moment(point.event.timestamp());
            let stationText = "Station: " + new RegExp('(?<=-).*').exec(point.column);
            let readingText = " Value: " + point.event.get(point.column)
            return "(Selected Point) " + timeText + ", " + stationText + ", " + readingText
        }
        else{
            return "";
        }
    }

    useEffect(() => {
        console.log('Scatterplot useEffect, rawData =', rawData);
        
        
        let readingsByDate = new Map();
        //let stationIDToReadingsListIndexMap = new Map();
        // a list that tracks the column index a reading should go in using  (station+timeseriesID)
        let stationTmsrsCombinedIdList = [] // basically, the columns array
        
        let timeseriesDailyAveragesMap = new Map(); // array to hold the averages per day readings
        if(rawData !== undefined && rawData.length > 0 ){
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
                        
                        let insertionIndex = stationTmsrsCombinedIdList.indexOf(stationTmsrsID);
                        // haven't seen this station yet in this timeseries, add to list and get new insertion index
                        if(insertionIndex == -1) {
                            insertionIndex = stationTmsrsCombinedIdList.push(stationTmsrsID) - 1;
                        }
                        
                        // check if this MM-DD is being tracked yet
                        if(readingsByDate.has(dayMonth)){
                            let readingsList = readingsByDate.get(dayMonth);
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
                                readingsByDate.set(dayMonth, extendedReadingsList)
                            }
                        } else {
                            // this date isn't being tracked, add it to the map
                            if(insertionIndex === 0) {
                                let readings = [datum];
                                // add the new date
                                readingsByDate.set(dayMonth, readings);
                                //readingsListLength = 1;
                            } else{
                                // we need to add a list of null values and then add the value to the end
                                let newReadingsList = new Array(insertionIndex + 1).fill(null);
                                newReadingsList[insertionIndex] = datum;
                                readingsByDate.set(dayMonth,newReadingsList)
                            }
                        }
                    
                    });

                    // convert the map values from list of readings to an average reading
                    tmsrsPerDateTempTotalsMap.forEach(function(readingsList, date, map) {
                        let accum = 0;
                        readingsList.forEach(value => {
                            accum += value;
                        }); 
                        map.set(date, accum / readingsList.length);
                    });

                    timeseriesDailyAveragesMap.set(noaaTimeseries.id, tmsrsPerDateTempTotalsMap);
                }
                
                
            })


            let cols = ["time"].concat(stationTmsrsCombinedIdList);

            const newPoints = [];

            readingsByDate.forEach((readingsList, date) => {
                const time = moment(date + '-2017', 'MM-DD-YYYY');
                // let randomVar = (Math.random() - 0.5) * 60_000 * 1000;
                newPoints.push([
                    time.toDate().getTime(),
                    ...readingsList.map(reading => reading === null ? null : reading.value)
                ]);
                
            });

            // sort the points in order
            newPoints.sort((a, b) => a[0] - b[0]);

            const ts = new TimeSeries({
                name: "TMAX", // TODO replace with current datatype
                columns: cols,
                points: newPoints
            });
            

            // creating linear timeseries from these data 
            // TODO just use the built in timeseries methods
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
            
            const linePoints = [...linePointsMap].map(([key, value]) => ( value ));
            linePoints.sort((a, b) => a[0] - b[0]);

            setLineSeries(new TimeSeries({
                name: "averages",
                columns: lineSeriesCols,
                points: linePoints
            }));
            
            // calculate the max and min Y values for graph
            // TODO refactor timeseries averaging to utilize the series.average() method
            let newYMin = Number.MAX_SAFE_INTEGER, newYMax = Number.MIN_SAFE_INTEGER;
            cols.forEach((col) => {
                if(col !== 'time'){
                    newYMax = Math.max(ts.max(col), newYMax);
                    newYMin = Math.min(ts.min(col), newYMin);
                }
            })
            
            setLineColumns(lnCols);
            setColumns(cols);
            setTimerange(ts.range());


            let lgndCats = lnCols.map(d => ({ key: d, label: getTimeseriesYearFromID(Number(d)) }));
            let lgndStyle = styler(lnCols.map((c, i) => ({
                key: c,
                color: getColor(Number(i))
            })));
            setLegendCategories(lgndCats);
            setLegendStyle(lgndStyle);
            
            setMinYValue(newYMin)
            setMaxYValue(newYMax)


            // this must be set last, because chart starts to render once
            // series isn't null or undefined
            setSeries(ts);
        }
    }, [rawData, tmsrsInfoList, lineWidth, pointSize ])
    
   
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
                // fill: color,
                fill: "color",
                stroke: color,
                opacity: 0.7,
                strokeWidth: pointSize
            },
            highlighted: {
                //fill: "color",
                //stroke: "none",
                fill: "none",
                stroke: color,
                strokeWidth: pointSize * 2,
                opacity: 1.0
            },
            selected: {
                fill: "color",
                stroke: color,
                strokeWidth: pointSize * 3,
                opacity: 1.0
            },
            muted: {
                // stroke: "none",
                // fill: color,
                fill: "none",
                stroke: color,
                strokeWidth: pointSize * .75,
                opacity: 0.6,
                

            }
        };
    };

    const timeAxisStyle = {
        values: { valueColor: "Green", valueWeight: 200, valueSize: 12, "font-size": axisValueFontSize }
    };

    const YAxisStyle = {
        axis: { axisColor: "#C0C0C0" },
        label: { labelColor: "Blue", labelWeight: 100, labelSize: 12, "font-size": axisLabelFontSize },
        values: { valueSize: 12, "font-size": axisValueFontSize }
    };

    return (
        <div>
            <>
                
                              
            </>
            <>
            { series === null || series === undefined ? (
                <CircularProgress/>
            ) : (
                <div className="row">
                    <Typography  gutterBottom align="right">
                      {formatInfoTextForPoint(selectedPoint)}
                    </Typography>  
                    <div className="col-md-12">
                        {/* <Typography>
                        TODO add text of current selection (point or line)    
                        </Typography>
                         */}
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
                                //onBackgroundClick={() => setSelection(selection)}
                                onTimeRangeChanged={timerange => setTimerange(timerange)}
                                onTrackerChanged={tracker => setTracker(tracker)}
                            >
                                <ChartRow
                                    height={height}
                                    debug={false}
                                    trackerInfoWidth={125}
                                    trackerInfoHeight={30}
                                    trackerInfoValues={infoValues}
                                >
                                    <YAxis
                                        id="Temperature (F)"
                                        label="Temperature (F)" 
                                        labelOffset={-20}
                                        min={minYValue}
                                        max={maxYValue}//series.max("station1")}
                                        style={YAxisStyle}
                                        width="80"
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
                                            onSelectionChange={p => handleSelectedPointChanged(p)}
                                            //onMouseNear={p => handleMouseNear(p)}
                                            highlight={highlight}
                                            radius={ 2 } //(event, column) => column === "station1" ? 3 : 2 }
                                        />
                                        <LineChart
                                                axis="Temperature (F)"
                                                //breakLine={false}
                                                series={lineSeries}
                                                columns={lineColumns}
                                                style= { styler([...lineColumns].map(([key, value]) => ({ key: key, color: getColor(Number(key)), width: lineWidth, opacity: 1 })))}//{lineStyles}
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
                    <div>
                        <Legend categories={legendCategories} style={legendStyle} type="dot" />
                    </div>
                </div>
            )}</>
        </div>
    )
}
