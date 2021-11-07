import React, { useEffect, useState } from 'react';
import useStore from "../store";
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DatePicker from './DatePicker';

const YearListItems= () => {
  const store = useStore(state => state);

  return (
    <>
      {store.years.map(year => (
        <DatePicker
        views={["year"]}
        // label={label}
        value={year.year}
        onChange={(date) => store.updateYear(year.id, date)}
        />
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