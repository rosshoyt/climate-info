import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));


const CustomSlider = withStyles({
  root: {
    color: '#3a8589',
    height: 3,
    padding: '13px 0',
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    boxShadow: '#ebebeb 0 2px 2px',
    '&:focus, &:hover, &$active': {
      boxShadow: '#ccc 0 2px 3px 1px',
    },
    '& .bar': {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  // valueLabel: {
  //   left: 'calc(-50% + 4px)',
  // },
  track: {
    height: 3,
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
  },
})(Slider);

function ThumbComponent(props) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

export default function RangeSlider( { label=false, onChangeCommitted, startingValue, max, min, marks }) {
  const classes = useStyles();

  return (
    <div div className={classes.root}>
      { label  ? (
      <Typography gutterBottom>Airbnb</Typography>
      ) : (
        <></>
      )}
      <CustomSlider
        ThumbComponent={ThumbComponent}
        onChangeCommitted={onChangeCommitted}
        defaultValue={startingValue}
        max={max}
        min={min}
        marks={marks}

        // valueLabelDisplay="on"
        // TODO implement custom slider label ala https://codesandbox.io/s/material-demo-y76cj?file=/demo.js:196-258
        //aria-labelledby="range-slider"
        // getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
        //getAriaValueText={valueLabelFormat}
        //aria-label="range-slider"
        //valueLabelFormat={valuetext}
        
    />
  </div>
  )
}
