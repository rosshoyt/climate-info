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
      {store.years.map(year => (
        <>
          <ListItem>
            <Box display="flex" justifyContent="center" >
              <DatePicker
                views={['year']}
                // label={label}
                value={ new Date(year.year, 1, 1) } // fill in dummy month/day vals with JS date
                onChange={(date) => store.updateYear(year.id, date.year())} // TODO 'date' here is a moment object, for some reason...
              />
              <Box
                onClick= {(event)=>store.updateYearColorSelectorOpen(year.id, !year.colorSelectorOpen)}
                sx={{
                  width: 100,
                  bgcolor: year.color,
                }}
              >
                <EditIcon/>{year.color}
              </Box>
              
            </Box>
          </ListItem>
          { year.colorSelectorOpen ? (
            <ListItem>
              <TwitterPicker onChangeComplete={(c) => store.updateYearColor(year.id, c.hex)}/>
            </ListItem>
          ) : <></>}
        </>
      ))}
      <ListItem>
        <Button 
          varient="outlined" 
          color="primary"
          onClick={(evt) => store.addYear()}
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