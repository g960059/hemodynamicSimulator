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
        <FlexibleXYPlot xDomain={props.xlims} yDomain={props.ylims}> 
          <LineSeries data={props.data} opacity={0.6}/>
        </FlexibleXYPlot>
      </Box>
    )
  }
})