import Alert from '@material-ui/lab/Alert';
import React from 'react';

export default function QueryAlerts({ errorMessage=null}) {
  // const queryList = useStore(state => state.timeseriesList)
  // TODO update on each query's status, relevant error messages
  return (
    errorMessage === null ? (
      <></>
    ):(
      <Alert variant="filled" severity="warning" >
          {errorMessage}
      </Alert>
    ))
}
