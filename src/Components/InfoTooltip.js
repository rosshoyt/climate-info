import React from 'react'
import { Info } from '@material-ui/icons';

const InfoTooltip = (text) => {
    return (
        <>
            <Tooltip title="Delete">
                <IconButton aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}