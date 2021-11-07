import React from 'react';
import useStore from "../store";
import { Button, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { DatePicker } from "@material-ui/pickers";
import { GithubPicker } from 'react-color'

const YearListItems= () => {
  const store = useStore(state => state);
  
  return (
    <>
      {store.years.map(year => (
        <>
        <Box display="flex" justifyContent="center" >
          <DatePicker
            views={['year']}
            // label={label}
            value={year.year}
            onChange={(date) => store.updateYear(year.id, date)}
          />
          <Box
            onClick= {(event)=>store.updateYearColorSelectorOpen(year.id, !year.colorSelectorOpen)}
            sx={{
              width: 40,
              height: 20,
              bgcolor: year.color,
            }}
          />
          
        </Box>
        { year.colorSelectorOpen ? (
          <GithubPicker />
        ) : <></>}
      </>
      ))}
      <Button 
        varient="outlined" 
        color="primary"
        onClick={(evt) => store.addYear()}
        >
        <AddIcon />Add Year
      </Button>            
    </>
  );
}

function YearList() {
  return (
    <>
      <div>Year List</div>
      <YearListItems />
    </>
  );
}

export default YearList;