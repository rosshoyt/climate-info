import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton';
import DarkModeButton from '../DarkModeButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TitleAppBar({ title, darkMode, setDarkMode }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title} align='left'>
            <WbSunnyIcon /> {title}
          </Typography>

          <DarkModeButton darkMode={darkMode} setDarkMode={setDarkMode} />
          <a href='https://github.com/rosshoyt/climate-info'>
            <IconButton>
              <GitHubIcon />
            </IconButton>
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
}
