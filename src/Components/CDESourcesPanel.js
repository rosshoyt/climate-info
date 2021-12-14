import { Typography } from '@material-ui/core';
import React, { useState } from 'react'

export default function CDESourcesPanel() {
  const [noaaDatasetName, setNoaaDatasetName] = useState('GHCND');
  const [accessDate, setAccessDate] = useState(new Date()); // todo display as readable citation format
  const [subset, setSubset] = useState(); // TODO set subset
  
  return (
    <>
      <h1>Sources</h1>
      <Typography>
        Menne, Matthew J., Imke Durre, Bryant Korzeniewski, Shelley McNeal, Kristy Thomas, Xungang Yin, Steven Anthony, Ron Ray, Russell S. Vose, Byron E.Gleason, and Tamara G. Houston (2012): Global Historical Climatology Network - Daily (GHCN-Daily), Version 3. [indicate subset used]. NOAA National Climatic Data Center. doi:10.7289/V5D21VHZ [{accessDate.toString()}].
      </Typography>
    </>
  )
}
