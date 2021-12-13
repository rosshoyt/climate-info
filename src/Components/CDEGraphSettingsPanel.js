import React from 'react'
import useCDEGraphSettingsStore from './CDEGraphSettingsStore'
import { Slider, Grid, Typography,  } from '@material-ui/core/';

export default function GraphSettings() {
  const store = useCDEGraphSettingsStore();

  return (
    <Grid container direction="column" justifyContent="left" alignItems="center">
                <Grid container direction="row">    
                    <Grid item xs={12}>
                        <Typography gutterBottom>Line Size:</Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Slider 
                        key={`slider-${0}`}
                            defaultValue={ store.lineWidth }
                            onChange={ (e, newValue) => store.setLineWidth(newValue) }
                            getAriaValueText={ (value) => `${value}` }
                            aria-labelledby=" asdf"
                            step={5}
                            marks
                            min={0}
                            max={50}
                            valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            
                <Grid container direction="row"> 
                    <Grid item xs={12}>
                        <Typography gutterBottom>Point Size:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        
                        <Slider
                        key={`slider-${1}`}
                            defaultValue={ store.pointSize }
                            onChange={ (e, newValue) => store.setPointSize(newValue) }
                            getAriaValueText={ (value) => `${value}` }
                            aria-labelledby="asdf "
                            step={3}
                            marks
                            min={0}
                            max={30}
                            valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            </Grid>
  )
}
