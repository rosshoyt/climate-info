import React, { useState, Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// https://codesandbox.io/embed/sm-article-21-lt6le?fontsize=14&hidenavigation=1&theme=dark
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    //justifyContent: 'right'
    //maxWidth: 360,
    //backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
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
            <ListItem button onClick={handleClick}>
              {/*TODO DIsplay a custom list icon
               <ListItemIcon>
                <InboxIcon />
              </ListItemIcon> */}
              <ListItemText primary={ (index + 1) + '. ' + child.props.title} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open[index]} timeout="auto" >
              <List component="div" disablePadding>
                <ListItem className={classes.nested}>
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