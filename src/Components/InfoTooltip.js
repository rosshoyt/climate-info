import React from 'react'
import { Info, InfoOutlined } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';
const InfoTooltip = ({text}) => {
    return (
        <>
            <Tooltip title={text}>
                <IconButton aria-label="info">
                    <Info />
                </IconButton>
            </Tooltip>
        </>
    );
}
export default InfoTooltip;