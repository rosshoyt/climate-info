// Todo implement
// Should default to MiniDrawer for desktop screens,
// Responsive Drawer for Mobile size

import React, { Children, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import GitHubIcon from '@material-ui/icons/GitHub';
import DarkModeButton from '../DarkModeButton';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import useWindowDimensions from '../../Utils/WindowUtils';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    //flexGrow: 1
  },
  appBar: {
    //flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ResponsiveMiniDrawer({ children, darkMode, setDarkMode }) {
  const arrayChildren = Children.toArray(children)
  const classes = useStyles();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title} align="left">
            ClimateInfo.US
          </Typography>
          <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode} />
          <a href='https://github.com/rosshoyt/climate-info'>
            <IconButton>
              <GitHubIcon />
            </IconButton>
            </a>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {Children.map(arrayChildren, (child, index) =>  (
              <ListItem button key={child.props.name} component={Link} to={child.props.path}>
                <ListItemIcon>{child.props.name === "Climate Data" ? <WbSunnyIcon /> : <FastfoodIcon />}</ListItemIcon>
                <ListItemText primary={child.props.name} />
              </ListItem>
            ))}
          </List>
          {/* <Divider /> */}
        </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          {Children.map(arrayChildren, (child, index) => {
            return(
              <Route exact path={child.props.path}>
                {child}
              </Route>
            )
          })
        }
        </Switch>
      </main>
      </BrowserRouter>
    </div>
  );
}
