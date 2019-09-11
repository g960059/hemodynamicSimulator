import React,{useEffect, useRef} from 'react';
import {List, ListItem ,ListItemText} from '@material-ui/core'
import { useTrackedState } from 'reactive-react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles= makeStyles(theme =>({
  root:{
    paddingTop: 0,
  },
  dense:{
    paddingTop: 0,
    paddingBottom: 0,
  },
  body2:{
    lineHeight: 0.5
  },
  h6:{
    fontSize: '1.1rem'
  },
  multiline:{
    marginTop: 0,
    marginBottom: '8px'
  }
}))


export default (props) => {
  const classes = useStyles()

  const state = useTrackedState();
  const {Cas_prox,Cap_prox} = state.hemodynamicProps
  const outputs = useRef({
    AoP: {min: 66, max: 109},
    CVP: {min: 2, max: 10},
    PAP: {min: 16, max: 24}
  })
  const nextOutputs = useRef({
    AoP: {min: Infinity, max: -Infinity},
    CVP: {min: Infinity, max: -Infinity},
    PAP: {min: Infinity, max: -Infinity}
  })
  const isFinished = useRef(false)
  useEffect(() => {
    const {data,time,logger} = state.hemodynamicSeries
    if(time < 50 && !isFinished.current){
      isFinished.current = true
      outputs.current = {...nextOutputs.current}
      nextOutputs.current = {
        AoP: {min: Infinity, max: -Infinity},
        CVP: {min: Infinity, max: -Infinity},
        PAP: {min: Infinity, max: -Infinity}
      }
    }
    if(50< time && time<100　&& isFinished.current){
      isFinished.current = false
    }
    

    const logger_length = logger.length
    for(let i=0; i<logger_length; i++){
      const _AoP = logger[i]['Qas_prox'] / Cas_prox
      const _PAP = logger[i]['Qap_prox'] / Cap_prox
      const _CVP = logger[i]['Pra']
      if(_AoP > nextOutputs.current.AoP.max){nextOutputs.current.AoP.max=_AoP.toFixed()}
      if(_AoP < nextOutputs.current.AoP.min){nextOutputs.current.AoP.min=_AoP.toFixed()}
      if(_PAP > nextOutputs.current.PAP.max){nextOutputs.current.PAP.max=_PAP.toFixed()}
      if(_PAP < nextOutputs.current.PAP.min){nextOutputs.current.PAP.min=_PAP.toFixed()}
      if(_CVP > nextOutputs.current.CVP.max){nextOutputs.current.CVP.max=_CVP.toFixed()}
      if(_CVP < nextOutputs.current.CVP.min){nextOutputs.current.CVP.min=_CVP.toFixed()}
    }
    
  }, [state.hemodynamicSeries])
  return (
    <List dense classes={{root:classes.root}}>
      <ListItem dense divider classes={{dense: classes.dense}}>
        <ListItemText primary='AoP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{classes:{root:classes.body2}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.AoP.max + '/'+ outputs.current.AoP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense divider classes={{dense: classes.dense}}>
        <ListItemText primary='PAP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{classes:{root:classes.body2}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.PAP.max + '/'+ outputs.current.PAP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense divider classes={{dense: classes.dense}}>
        <ListItemText primary='CVP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{classes:{root:classes.body2}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.CVP.max + '/'+ outputs.current.CVP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>      
    </List>
  )
}
