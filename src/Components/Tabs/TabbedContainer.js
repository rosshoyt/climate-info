import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        {children}
        // <Box p={3}>
        //   <Typography>{children}</Typography>
        // </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function TabbedContainer({ children }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const arrayChildren = Children.toArray(children);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      { Children.map(arrayChildren, (child, index) => {
        return(
          <TabPanel value={value} index={index}>
          { child }
        </TabPanel>
        )})}
     <Paper className={classes.root}>
      
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {Children.map(arrayChildren, (child, index) => {
        return(
          <Tab label={value} index={index}/>
        )})}

      </Tabs>
    </Paper>
    </>
  );
}
