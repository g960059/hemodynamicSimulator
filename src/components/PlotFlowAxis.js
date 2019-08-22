import React from 'react';
import {Box} from '@material-ui/core'


import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot,YAxis} from 'react-vis';


export default React.memo((props) => {
  return (
    <Box position='absolute' width={1} height={1}>
      <FlexibleXYPlot xDomain={props.lims}> 
        <YAxis/>
      </FlexibleXYPlot>
    </Box>
  )
})
