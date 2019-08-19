import React,{useState} from 'react';
import { Box, ExpansionPanel,ExpansionPanelDetails,ExpansionPanelSummary, Typography, Select, MenuItem, InputLabel,FormControl} from '@material-ui/core';
import InputProps from './InputProps'
import {ExpandMore} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles= makeStyles(theme =>({
  expanded: {
    margin: '0 !important',
  },
}))

const ChamberItems =[
  {value:'Ees', label:'Ees'},
  {value:'alpha', label:'alpha'},
  {value:'beta', label:'beta'},
  {value:'Tmax', label:'Tmax'},
  {value:'tau', label:'tau'},
  {value:'AV_delay', label:'AV_delay'}
]
const VesselItems = [
  {value: 'Ra', label: 'Arterial Resistance'},
  {value: 'Rc', label: 'Characteritic Resistance'},
  {value: 'Rv', label: 'Venous Resistance'},
  {value: 'Ra_prox', label: 'Proximal Resistance'},
  {value: 'Ca', label: 'Arterial Compliance'},
  {value: 'Cv', label: 'Venous Compliance'},
  {value: 'Ca_prox', label: 'Proximal Compliance'},
]

export default React.memo((props) => {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    chamber: 'LV',
    vessel: 's'
  });

  const handleChange = (event)=> {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <>
      <ExpansionPanel classes={{expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} >
          <Typography variant='h6'>Chamber</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{paddingRight:0, paddingLeft:0}}>
          <Box width={1} px={1}>
            <FormControl>
              <InputLabel htmlFor='chamber-select'>Chamber</InputLabel> 
              <Select value={values.chamber} onChange={handleChange} inputProps={{name:'chamber',id:'chamber-select'}}>
                <MenuItem value={'LV'}>Left Ventricle</MenuItem>
                <MenuItem value={'LA'}>Left Atrium</MenuItem>
                <MenuItem value={'RV'}>Right Ventricle</MenuItem>
                <MenuItem value={'RA'}>Right Atrium</MenuItem>
              </Select>
            </FormControl>
            {ChamberItems.map(({value,label})=>{
              return (
                <InputProps name={values.chamber + '_'+value} label={label} key={label}/>
              )
            })}
          </Box>    
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel  classes={{expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} >
          <Typography variant='h6'>Vessels</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{paddingRight:0, paddingLeft:0}}>
          <Box width={1} px={1}>
            <FormControl>
              <InputLabel htmlFor='vessel-select'>Vessel</InputLabel> 
              <Select value={values.vessel} onChange={handleChange} inputProps={{name:'vessel',id:'vessel-select'}}>
                <MenuItem value={'s'}>Systemic</MenuItem>
                <MenuItem value={'p'}>Pulmonary</MenuItem>
              </Select>
            </FormControl>
            {VesselItems.map(({value,label}) => {
              let name
              switch(value){
                case 'Ra_prox':
                  name = 'Ra'+values.vessel +'_prox'; break;
                case 'Ca_prox':
                  name = 'Ca'+values.vessel +'_prox'; break;
                default:
                  name =  value + values.vessel
              }
              {/* console.log('value: ',value, 'name: ', name) */}
              return (
                <InputProps name={name} label={label} key={label}/>
              )
            })}
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel  classes={{expanded: classes.expanded}}>
        <ExpansionPanelDetails style={{paddingRight:0, paddingLeft:0, paddingTop:'24px'}}>
          <Box width={1} px={1}>
            <InputProps name='Volume' label='Volume' key='Volume'/>
            <InputProps name='HR' label='HR' key='HR'/>
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>      
    </>
  )
})
