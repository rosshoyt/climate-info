import React, { Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


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
  const [open, setOpen] = React.useState(true);
  // const [open, setOpen[] = useState([true]) // TODO
  const arrayChildren = Children.toArray(children)

  const handleClick = () => {
    setOpen(!open);
  };

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
        
        return(
          <>
            <ListItem button onClick={handleClick}>
              {/*TODO DIsplay a custom list icon
               <ListItemIcon>
                <InboxIcon />
              </ListItemIcon> */}
              <ListItemText primary={child.props.title} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
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