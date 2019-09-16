import React from 'react';
import {Box} from '@material-ui/core'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries} from 'react-vis';

export default React.memo((props) => {
  if(props.data.length < 1){
    return(
      <></>
    )
  }else{
    return (
      <Box position='absolute'  width={1} height={1}>
        <FlexibleXYPlot xDomain={[0,props.lims[0]]} yDomain={[0,props.lims[1]]}> 
          <LineSeries data={props.data} opacity={0.6}/>
        </FlexibleXYPlot>
      </Box>
    )
  }
})

