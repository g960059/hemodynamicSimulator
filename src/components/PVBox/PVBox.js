import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import {Grid, Box, IconButton, Typography} from '@material-ui/core'
import {Clear, Add}from '@material-ui/icons';
import PVPropSettings from '../../settings/PVPropSettings'
import PVBuilder from './PVBuilder'

const useStyles= makeStyles(theme =>({
  withBoxShadow: {
    boxShadow:'1px 1px 2px 0px rgba(0,0,0,0.08)'
  },
  halfBox: {
    [theme.breakpoints.up('sm')]: {
      height: `calc((100vmax * 7/ 12 / 2 - ${theme.spacing(1)}px * 3) *3 / 4 )`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc((100vmax * 7/ 12 / 2 - ${theme.spacing(1)}px * 3) *3 / 2 )`,
    },
    backgroundColor: theme.palette.background.paper,
  },
}))

export default (props) => {
  const classes = useStyles()
  console.log('PVPropSettings[props.chamber]: ',PVPropSettings[props.chamber])
  return (
    <Grid item xs={12} sm={6} className={classes.withBoxShadow}>
      <Box className={classes.halfBox} px ={2} pt={2} pb={-1} position='relative' style={{margin:'2px'}}>
        <Box lineHeight={0} color="text.secondary"  position='absolute' zIndex={3} left={70} top={3}><Typography variant ='overline'>{PVPropSettings[props.chamber].name}</Typography></Box>
        <Box position='absolute' zIndex={3} right={-3} top={-6} >
          <IconButton onClick={props.remove}>
            <Clear/>
          </IconButton>
        </Box>
        <PVBuilder chamber={props.chamber}/>
      </Box>
    </Grid>
  )
}