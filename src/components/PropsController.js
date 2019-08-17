import React,{useState} from 'react';
import { Box, ExpansionPanel,ExpansionPanelDetails,ExpansionPanelSummary, Typography, ListItem} from '@material-ui/core';
import InputProps from './InputProps'
import {ExpandMore} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles= makeStyles(theme =>({
  expanded: {
    margin: '0 !important',
  },
}))

export default React.memo((props) => {
  const classes = useStyles()
  return (
    <>
      <ExpansionPanel classes={{expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} >
          <Typography variant='h6'>Chamber</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{paddingRight:0, paddingLeft:0}}>
          <Box width={1} px={1}> 
            {['LV_Ees','LV_alpha','LV_beta','LV_Tmax','LV_tau','LV_AV_delay'].map(name=>{
              return (
                <InputProps name={name} key={name}/>
              )
            })}
          </Box>    
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel  classes={{expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} >
          <Typography variant='h6'>Vascular</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          test
        </ExpansionPanelDetails>
      </ExpansionPanel>


    </>
  )
})
