import React from 'react';

import LocationSelect from './LocationSelect';
import { Grid, Button } from '@material-ui/core';
import LineChart from './Charts/LineChart';


const MaxTempVisualization = () => {
    return (
        <>
            <Grid container direction="row" justify="center" alignItems="stretch">
                <LocationSelect />
                <Button variant="contained" color="primary">
                    Start
                </Button>
            </Grid>
            <div style={{ height: 500 }}>
                <LineChart/>
            </div>
        </>
    );
}

export default MaxTempVisualization;