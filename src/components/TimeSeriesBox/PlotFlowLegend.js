import React from 'react';
import {Box} from '@material-ui/core'
import {FiberManualRecord} from '@material-ui/icons';
import palette from '../../settings/Palette'
// import { makeStyles} from '@material-ui/core/styles';

// const useStyles= makeStyles(theme =>({
//   chipRoot:  {
//     margin: '2px',
//     // color: 'white'
//   },
//   deleteIcon: {
//     color: 'inherit',
//     opacity: 0.6,
//     "&:hover": {
//       color: 'inherit',
//       opacity: 1
//     } 
//   }
// }))


export default React.memo((props) => {
  // const classes = useStyles()
  return (
    <>
      {props.items.map((item, index)=>(
        (item != null) && <Box display='flex' alignItems='center' mr={1} style={{color: '#0000008a'}}>
          <FiberManualRecord style={{color: palette[index]}} fontSize='small'/>
            {item}
        </Box>
      ))}
    </>
  )
})

