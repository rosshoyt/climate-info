import React, { useState, Children } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography'
// https://codesandbox.io/embed/sm-article-21-lt6le?fontsize=14&hidenavigation=1&theme=dark
const useStyles = makeStyles((theme) => ({
  nested: {
    alignItems: 'left',
    justifyContent: 'left',
  },
  root: {
    paddingLeft: theme.spacing(1),
    alignItems: 'left',
    justifyContent: 'left',
    textAlign: 'left',    
  },

}));

export default function CollapsibleList({ title, children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(Array.from({length: 20}, () => true));
  const arrayChildren = Children.toArray(children)
  const theme = useTheme();

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {title}
        </ListSubheader>
      }
      className={classes.root}
    >
      {Children.map(arrayChildren, (child, index) => {
        function handleClick(){
          console.log('List Item ', index, 'clicked');
          setOpen(open.map((element, i) => {
            return i === index ? !element : element;
          }));
        }
        return(
          <>
            <ListItem button onClick={handleClick} className={classes.root}>
              {open[index] ? <ExpandLess /> : <ExpandMore />}
              {/* TODO Display a custom list icon ala
               <ListItemIcon><InboxIcon /></ListItemIcon>
              TODO format secondary text https://github.com/mui-org/material-ui/pull/20039 */ }
              <ListItemText
                style={{flexDirection: 'column' }}
                disableTypography
                primary={ 
                <>
                  <Typography type="body3" display='inline' style={{ color: theme.palette.type == "dark" ? '#ffffff' : '#000000' }}>{ child.props.title + ':' } &nbsp; </Typography>
                  <Typography type="body3" display='inline' style={{ color: '#808080' }}>{ child.props.currentValueText} </Typography>
                </>}
              />
            </ListItem>
            <Collapse in={open[index]} timeout="auto" >
              <List component="div" disablePadding className={classes.root}>
                <ListItem className={classes.nested} >
                  {child}
                </ListItem>
              </List>
            </Collapse>
          </>
        );
      })}
    </List>
  );
}