/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { withSize } from 'react-sizeme';

const useStyles = makeStyles({
  root: {
    border: 0
  },
  //border: 0,
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

function AutocompleteSelector({ size, selection, selectionOptions, setSelection, id='selector', label }) {

  // TODO ensure selection options always has a value ?
  const [value, setValue] = useState(selectionOptions[0])

  const classes = useStyles();

  function valueChanged(newValue) {
    setValue(newValue);
    setSelection(newValue);
  }

  return (
    <Autocomplete
      value={selectionOptions[0]}
      onChange={(event, value) => setSelection(value)}
      id={id}
      style={{ width: size.width }}
      options={selectionOptions}
      classes={{
        root: classes.root,
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(option) => (
        <React.Fragment>
          <span> {option.name}</span>
          {option.id}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

export default withSize({ monitorHeight: true })(AutocompleteSelector)