import React from 'react';
import {Box} from '@material-ui/core'


import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries, XAxis,YAxis} from 'react-vis';

export default React.memo((props) => {
  return (
    <Box position='absolute'  width={1} height={1}>
      <FlexibleXYPlot xDomain={[0,props.lims[0]]} yDomain={[0,props.lims[1]]}> 
        <XAxis/>
        <YAxis/>
        <LineSeries data ={props.ESPVR} strokeStyle='dashed' opacity={0.5} color='gray'/>
        <LineSeries data ={props.EDPVR} strokeStyle='dashed' opacity={0.5} color='gray'/>      
      </FlexibleXYPlot>
    </Box>
  )
})

