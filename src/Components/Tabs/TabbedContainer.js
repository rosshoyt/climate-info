import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs({ children }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const arrayChildren = Children.toArray(children)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {Children.map(arrayChildren, (child, index) => {
        return(
          <TabPanel value={value} index={index}>
           {child}
          </TabPanel>
        );
        })}
      <Paper square>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        { Children.map(arrayChildren, (child, index) => {
        
          return(
            <Tab label={ child.props.tabName } {...a11yProps(index)} />
            );
          })}
        </Tabs>
      </Paper>
    </div>
  );
}
