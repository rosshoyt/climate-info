import React, { Children } from 'react'
import { Grid } from '@material-ui/core';

export default function RowContainer({ children }) {
  const arrayChildren = Children.toArray(children);
  return (
    <Grid container direction="row">
      {Children.map(arrayChildren, (child, index) => {
        return(
          <Grid item lg={3}>
            {child}
          </Grid>
        );
      })}
    </Grid>
  )
}
