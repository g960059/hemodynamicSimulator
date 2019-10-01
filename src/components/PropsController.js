import React,{useState} from 'react';
import { Box, ExpansionPanel,ExpansionPanelDetails,ExpansionPanelSummary, Typography, Select, MenuItem, Button,ButtonGroup,FormControl, Divider} from '@material-ui/core';
import InputProps from './InputProps'
import {ExpandMore} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles= makeStyles(theme =>({
  expansionPanel: {
    boxShadow: 'none',
    backgroundColor: ' #fafafa',
    '&:before': {
      display: 'none'
    }
  },
  expansionPanelDetail: {
    padding: '8px'
  },
  expansionPanelSummaryRoot: {
    minHeight: "45px!important"
  },  
  expansionPanelSummaryExpanded: {
    minHeight: 'fit-content'
  },
  expansionPanelSummaryContent: {
    margin: '0px !important',
  },  
  expanded: {
    margin: '0 !important',
    minHeight: 'fit-content'
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    // fontWeight: theme.typography.fontWeightMedium
  }
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
const ValveItems = [
  {value: 'Rr', label: 'Regurgitation'},
  {value: 'Rs', label: 'Stenosis'}
]

export default React.memo((props) => {
  const classes = useStyles()
  const [chamber, setChamber] = useState('LV');
  const [vessel, setVessel] = useState('s');
  const [valve, setValve] = useState('av');

  const handleChange = (event)=> {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <>
    {/* <ExpansionPanel  classes={{root:classes.expansionPanel, expanded: classes.expanded}} defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} classes={{root:classes.expansionPanelSummaryRoot ,expanded: classes.expansionPanelSummaryExpanded, content:classes.expansionPanelSummaryContent}}>
          <Typography className={classes.heading}>Favorite List</Typography>
        </ExpansionPanelSummary>  
        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
          <Box width={1} px={1} >
            <InputProps name='Volume' label='Volume' key='Volume'/>
            <InputProps name='HR' label='HR' key='HR'/>
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>    
      <Divider variant="middle" light /> */}
      <ExpansionPanel classes={{root:classes.expansionPanel, expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}  classes={{root:classes.expansionPanelSummaryRoot ,expanded: classes.expansionPanelSummaryExpanded, content:classes.expansionPanelSummaryContent}}>
          <Typography className = {classes.heading}>Chamber</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
          <Box width={1} px={1}>
            <ButtonGroup fullWidth color="primary">
              <Button variant={chamber =='LV' ? 'contained' :'outlined'} onClick={()=>setChamber('LV')}>LV</Button>
              <Button variant={chamber =='LA' ? 'contained' :'outlined'} onClick={()=>setChamber('LA')}>LA</Button>
              <Button variant={chamber =='RV' ? 'contained' :'outlined'} onClick={()=>setChamber('RV')}>RV</Button>
              <Button variant={chamber =='RA' ? 'contained' :'outlined'} onClick={()=>setChamber('RA')}>RA</Button>
            </ButtonGroup>
            {ChamberItems.map(({value,label})=>{
              return (
                <InputProps name={chamber + '_'+value} label={label} key={label}/>
              )
            })}
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Divider variant="middle" light />
      <ExpansionPanel  classes={{root:classes.expansionPanel, expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} classes={{root:classes.expansionPanelSummaryRoot ,expanded: classes.expansionPanelSummaryExpanded, content:classes.expansionPanelSummaryContent}}>
          <Typography className={classes.heading}>Vessels</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
          <Box width={1} px={1}>
            <ButtonGroup fullWidth color="primary" >
              <Button variant={vessel =='s' ? 'contained' :'outlined'} onClick={()=>setVessel('s')}>Systemic</Button>
              <Button variant={vessel =='p' ? 'contained' :'outlined'} onClick={()=>setVessel('p')}>Pulmonary</Button>
            </ButtonGroup>
            {VesselItems.map(({value,label}) => {
              let name
              switch(value){
                case 'Ra_prox':
                  name = 'Ra'+ vessel +'_prox'; break;
                case 'Ca_prox':
                  name = 'Ca'+ vessel +'_prox'; break;
                default:
                  name =  value + vessel
              }
              return (
                <InputProps name={name} label={label} key={label}/>
              )
            })}
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Divider variant="middle" light />
      <ExpansionPanel  classes={{root:classes.expansionPanel, expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} classes={{root:classes.expansionPanelSummaryRoot ,expanded: classes.expansionPanelSummaryExpanded, content:classes.expansionPanelSummaryContent}}>
          <Typography className={classes.heading}>Valves</Typography>
        </ExpansionPanelSummary>  
        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
          <Box width={1} px={1} >
            <ButtonGroup fullWidth color="primary" >
              <Button variant={valve =='av' ? 'contained' :'outlined'} onClick={()=>setValve('av')}>AV</Button>
              <Button variant={valve =='mv' ? 'contained' :'outlined'} onClick={()=>setValve('mv')}>MV</Button>
              <Button variant={valve =='pv' ? 'contained' :'outlined'} onClick={()=>setValve('pv')}>PV</Button>
              <Button variant={valve =='tv' ? 'contained' :'outlined'} onClick={()=>setValve('tv')}>TV</Button>
            </ButtonGroup>
            {ValveItems.map(({value,label}) => {
              let name
              switch(value){
                case 'Rr':
                  name = 'R'+ valve +'r' 
                  return  <InputProps name={name} label={label} key={label} 
                         //marks={[{label:'none', value:10000}, {label:'mild', value:1200},{label:'moderate', value:600},{label:'severe', value:300}]}
                         />
                case 'Rs':
                  name = 'R'+ valve +'s';
                  return  <InputProps name={name} label={label} key={label} 
                          //marks={[{label:'none', value:0}, {label:'mild', value:10},{label:'moderate', value:40},{label:'severe', value:100}]}
                          />
                default:
                  name =  value + valve
              }
              return null
            })}
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>       
      <Divider variant="middle" light />      
      <ExpansionPanel  classes={{root:classes.expansionPanel, expanded: classes.expanded}}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>} classes={{root:classes.expansionPanelSummaryRoot ,expanded: classes.expansionPanelSummaryExpanded, content:classes.expansionPanelSummaryContent}}>
          <Typography className={classes.heading}>Basics</Typography>
        </ExpansionPanelSummary>  
        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
          <Box width={1} px={1} >
            <InputProps name='Volume' label='Volume' key='Volume'/>
            <InputProps name='HR' label='HR' key='HR'/>
          </Box>  
        </ExpansionPanelDetails>
      </ExpansionPanel>      
    </>
  )
})
