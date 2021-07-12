import React from 'react';

import { Typography } from '@material-ui/core';

const VisualizationTitle = ({title}) => {
    return(
        <Typography variant='h4' align='left'>{title}</Typography>
    );
}

export default VisualizationTitle;