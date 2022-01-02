import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  button: {

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
      <Button aria-describedby={id} variant="outlined" color="primary" onClick={handleClick} className={classes.button} endIcon={<KeyboardArrowDownIcon />}>
        {currentValue}
      </Button>
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
