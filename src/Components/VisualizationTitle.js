import React from 'react';

import { Typography } from '@material-ui/core';

const VisualizationTitle = ({title}) => {
    return(
        <Typography noWrap variant='h4' align='left' fontWeight="fontWeightBold">{title}</Typography>
    );
}

export default VisualizationTitle;