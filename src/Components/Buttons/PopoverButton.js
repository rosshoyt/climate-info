import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  button: {
    minWidth: 150,
    maxWidth: 275
  }
}));

export default function PopoverButton({ children, currentValue, secondaryValues }) {


  //const arrayChildren = Children.toArray(children);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const childrenWithNewProps = React.Children.map(children, child =>
    React.cloneElement(child, { onClose: handleClose })
  );


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Box m={2}>
        <Button 
          aria-describedby={id} 
          variant="contained" 
          color="secondary" 
          onClick={handleClick} 
          className={classes.button} 
          endIcon={<KeyboardArrowDownIcon />}>
          <Typography variant="button" noWrap>{currentValue}</Typography>
        </Button>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        { childrenWithNewProps }
      </Popover>
    </div>
  );
}
