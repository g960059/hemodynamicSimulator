import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {get_pressure} from '../utils/utils'
import Paper from '@material-ui/core/Paper'
import SimpleLine from './SimpleLine'

const useStyles= makeStyles(theme =>({
  paper: {
    padding: theme.spacing(2)
  }
}))

export default (props) => {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>
      <SimpleLine series = {[{'data':get_pressure(props.times,props.series, props.data_index)}]}/> 
    </Paper>
  )
}


