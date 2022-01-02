import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function SelectableList({ valuesList=[['TMAX','temperatures'],['PRECIP','rain yo']], currentValue, setCurrentValue, onClose }) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(true);
  const [secondary, setSecondary] = React.useState(true);


  // React.useEffect(() => {
    
    
  // }, [valuesList])

  const handleListItemClick = (event, value) => {
    console.log('list itme clicked', value);
    setCurrentValue(value);
    onClose();
  };

  return (
    <div className={classes.demo}>
      <List dense={dense}>
        {valuesList.map(valuePair => (
          <ListItem>
            <ListItemAvatar>
              { valuePair[0] === currentValue ? (
                <Avatar>
                <CheckIcon style={{ color: "green" }}/>
              </Avatar> ) : (
                <></>
              ) }
            </ListItemAvatar>
            <ListItemText
              primary={valuePair[0]}
              secondary={secondary ? valuePair[1] : null}
              onClick={(event) => handleListItemClick(event, valuePair[0])}
            />
            {/* <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction> */}
          </ListItem>
        ))}
      </List>
    </div>
  );
}
