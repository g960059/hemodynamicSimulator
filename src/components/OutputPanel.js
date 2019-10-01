import React,{useEffect, useRef} from 'react';
import {List, ListItem ,ListItemText} from '@material-ui/core'
import { useTrackedState } from 'reactive-react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles= makeStyles(theme =>({
  root:{
    // paddingTop: '13px',
    // paddingBottom: '13px',
    // marginLeft: '3px',
    // backgroundColor: 'white'
  },
  dense:{
    paddingTop: 0,
    paddingBottom: 0,
  },
  caption:{
    lineHeight: 0.3
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
  const {Cas_prox,Cap_prox, HR, Cvp} = state.hemodynamicProps
  const outputs = useRef({
    AoP: {min: 66, max: 109},
    CVP: {min: 2, max: 10},
    PAP: {min: 16, max: 24},
    Qlv: {min: 53, max: 146},
    PCWP: {min: 8, max: 20},
  })
  const nextOutputs = useRef({
    AoP: {min: 66, max: 109},
    CVP: {min: 2, max: 10},
    PAP: {min: 16, max: 24},
    Qlv: {min: 53, max: 146},
    PCWP: {min: 8, max: 20},      
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
        PAP: {min: Infinity, max: -Infinity},
        Qlv: {min: Infinity, max: -Infinity},
        PCWP: {min: Infinity, max: -Infinity},        
      }
    }
    if(50< time && time<100　&& isFinished.current){
      isFinished.current = false
    }
    

    const logger_length = logger.length
    for(let i=0; i<logger_length; i++){
      const _AoP = logger[i]['AoP']
      const _PAP = logger[i]['PAP'] 
      const _CVP = logger[i]['Pra']
      const _Qlv = logger[i]['Qlv']
      const _PCWP = logger[i]['Pla'] 
      if(_AoP > nextOutputs.current.AoP.max){nextOutputs.current.AoP.max=_AoP.toFixed()}
      if(_AoP < nextOutputs.current.AoP.min){nextOutputs.current.AoP.min=_AoP.toFixed()}
      if(_PAP > nextOutputs.current.PAP.max){nextOutputs.current.PAP.max=_PAP.toFixed()}
      if(_PAP < nextOutputs.current.PAP.min){nextOutputs.current.PAP.min=_PAP.toFixed()}
      if(_CVP > nextOutputs.current.CVP.max){nextOutputs.current.CVP.max=_CVP.toFixed()}
      if(_CVP < nextOutputs.current.CVP.min){nextOutputs.current.CVP.min=_CVP.toFixed()}
      if(_Qlv > nextOutputs.current.Qlv.max){nextOutputs.current.Qlv.max=_Qlv.toFixed()}
      if(_Qlv < nextOutputs.current.Qlv.min){nextOutputs.current.Qlv.min=_Qlv.toFixed()}  
      if(_PCWP > nextOutputs.current.PCWP.max){nextOutputs.current.PCWP.max=_PCWP.toFixed()}
      if(_PCWP < nextOutputs.current.PCWP.min){nextOutputs.current.PCWP.min=_PCWP.toFixed()}    
    }
    
  }, [state.hemodynamicSeries])
  return (
    <List dense classes={{root:classes.root}}>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='AoP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.AoP.max + '/'+ outputs.current.AoP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='PAP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.PAP.max + '/'+ outputs.current.PAP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='CVP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.CVP.max + '/'+ outputs.current.CVP.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='SV' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='ml' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={outputs.current.Qlv.max- outputs.current.Qlv.min} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='EF' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='%' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={((outputs.current.Qlv.max- outputs.current.Qlv.min)*100 / outputs.current.Qlv.max).toFixed()} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>  
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='CO' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='L/min' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={((outputs.current.Qlv.max- outputs.current.Qlv.min)*HR/1000).toFixed(2)} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>
      <ListItem dense  classes={{dense: classes.dense}}>
        <ListItemText primary='PCWP' primaryTypographyProps={{variant:'h6', classes:{h6:classes.h6}}} secondary='mmHg' secondaryTypographyProps	={{variant: 'caption',display: 'block', classes:{root:classes.caption}}} classes={{multiline: classes.multiline}}/>
        <ListItemText primary={(outputs.current.PCWP.max /3 + outputs.current.PCWP.min*2/3).toFixed()} primaryTypographyProps={{variant:'h6'}}/>
      </ListItem>            
    </List>
  )
}
