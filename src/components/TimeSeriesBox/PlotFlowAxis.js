import React from 'react';
import {Box} from '@material-ui/core'


import '../../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot,YAxis, LineSeries} from 'react-vis';


export default React.memo((props) => {
  return (
    <Box position='absolute' width={1} height={1}>
      <FlexibleXYPlot xDomain={props.xlims} yDomain={props.ylims} margin={props.margin}> 
        <YAxis/>
        <LineSeries data={[{x:props.xlims[0], y:props.ylims[0]}]}/>
      </FlexibleXYPlot>
    </Box>
  )
})
