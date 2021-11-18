/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { makeStyles, FormControl, InputLabel, Select, MenuItem,FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DataTypeSelector({dataType, setDataType}) {
  const [dataTypes, setDataTypes] = useState( [ 
    "TMAX",
    "TMIN",
    "PRCP",
    "SNOW",
    "SNWD",
   ] );

  const classes = useStyles();


  const handleChange = (event) => {
    setDataType(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}
    >
      <InputLabel id="demo-simple-select-label">DataType</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dataType} 
          onChange={handleChange}
        >
          {
            dataTypes.map(dataType => {
              return(
                <MenuItem value={dataType}>{dataType}</MenuItem>
              );
            })
          }
        </Select>
    </FormControl>
  );
}