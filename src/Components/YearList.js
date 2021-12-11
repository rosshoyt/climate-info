import React from 'react';
import useStore from "../store";
import { Button, Box, List, ListItem } from '@material-ui/core';
import AddIcon  from '@material-ui/icons/Add';
import EditIcon  from '@material-ui/icons/Edit';
import { DatePicker } from "@material-ui/pickers";
import { TwitterPicker } from 'react-color'

const YearListItems= () => {
  const store = useStore(state => state);
  
  return (
    <List>
      {store.timeseriesList.map(timeseries => (
        <>
          <ListItem>
            <Box display="flex" justifyContent="center" >
              <DatePicker
                views={['year']}
                // label={label}
                value={ new Date(timeseries.year, 1, 1) } // fill in dummy month/day vals with JS date
                onChange={(date) => store.updateTimeseriesYear(timeseries.id, date.year())} // TODO 'date' here is a moment object, for some reason...
              />
              <Box
                onClick= {(event)=>store.updateTimeseriesColorSelectorOpen(timeseries.id, !timeseries.colorSelectorOpen)}
                sx={{
                  width: 100,
                  bgcolor: timeseries.color,
                }}
              >
                <EditIcon/>{timeseries.color}
              </Box>
              
            </Box>
          </ListItem>
          { timeseries.colorSelectorOpen ? (
            <ListItem>
              <TwitterPicker onChangeComplete={(c) => store.updateTimeseriesColor(timeseries.id, c.hex)}/>
            </ListItem>
          ) : <></>}
        </>
      ))}
      <ListItem>
        <Button 
          varient="outlined" 
          color="primary"
          onClick={(evt) => store.createTimeseries()}
          >
          <AddIcon />Add Year
        </Button>
      </ListItem>
    </List>
  );
}

function YearList() {
  return (
    <>
      <YearListItems />
    </>
  );
}

export default YearList;