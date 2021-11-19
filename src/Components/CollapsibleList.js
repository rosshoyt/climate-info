import React, { useState, Children } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
    // paddingLeft: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',    
  },

}));

export default function CollapsibleList({ title, children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(Array.from({length: 20}, () => true));
  // const [open, setOpen[] = useState([true]) // TODO
  const arrayChildren = Children.toArray(children)

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
              {/*TODO DIsplay a custom list icon
               <ListItemIcon>
                <InboxIcon />
              </ListItemIcon> */}
              
              { /* TODO format secondary text https://github.com/mui-org/material-ui/pull/20039 */ }
              <ListItemText 
                disableTypography
                primary={ <Typography type="body3" style={{ color: '#000000' }}>{ (index + 1) + '. ' + child.props.title + ':' } &nbsp; { child.props.currentValueText} </Typography>}
              />
              
              {open[index] ? <ExpandLess /> : <ExpandMore />}
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