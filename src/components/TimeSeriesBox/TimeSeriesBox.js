import React, {useState, useRef, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import {Grid, Box, Button, MenuItem, Checkbox, ListItemText, Menu,Divider,ListSubheader,Snackbar, IconButton} from '@material-ui/core'
import {Clear, Add}from '@material-ui/icons';
import Legend from './PlotFlowLegend'
import propSettings from '../../settings/PropSettings'
import PlotFlow from './PlotFlow'

const useStyles= makeStyles(theme =>({
  fullWidthBox: {
    // maxWidth: `calc(100vw * 7/ 12  - ${theme.spacing(0)}px)`,
    height: `calc(100vw * 2/ 12 )`,
    backgroundColor: theme.palette.background.paper,
    boxShadow:'1px 1px 2px 0px rgba(0,0,0,0.08)',
  },
}))

export default (props) => {
  const classes = useStyles()
  const [propTypes, setPropTypes] = useState([
    { key: 'Imv',  selected: false },
    { key: 'Iasp',  selected: false },
    { key: 'Itv',  selected: false },
    { key: 'Iapp',  selected: false },
    { key: 'AoP',  selected: false },
    { key: 'PAP',  selected: false },
    { key: 'Plv',  selected: false },
    { key: 'Pla',  selected: false },
    { key: 'Prv',  selected: false },
    { key: 'Pra',  selected: false }
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const legendItems = useRef([])
  const selectedItems = useRef([])
  const selectedItemsCounter = useRef(0)
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const mode = useRef(null)

  useEffect(() => {
    if(props.initialKeys!= null){
      setPropTypes(prev=>{
        const newState = [...prev]
        prev.forEach((item,index) =>{
          if(props.initialKeys.some(x=>x==item.key)){
            newState[index].selected = true
            selectedItems.current = [...selectedItems.current, item.key]
            legendItems.current = [...legendItems.current, propSettings[item.key].name]            
            selectedItemsCounter.current += 1
          }
        })
        if(propTypes.slice(4).some(x=>x.selected)){
          mode.current = 'pressure'
        }else{
          if(propTypes.slice(0,4).some(x=>x.selected)){
            mode.current = 'flow'
          }else{
            mode.current = null
          }
        }             
        return newState
      })
    }
  }, []);

  if(propTypes.slice(4).some(x=>x.selected)){
    mode.current = 'pressure'
  }else{
    if(propTypes.slice(0,4).some(x=>x.selected)){
      mode.current = 'flow'
    }else{
      mode.current = null
    }
  }        
  const clickHandler = ind=>e=>{
    e.preventDefault();
    setPropTypes(propTypes=>{
      const newPropTypes = [...propTypes]
      // console.log('ind: ', ind)
      if(!propTypes[ind].selected){
        selectedItems.current = [...selectedItems.current, propTypes[ind].key]
        legendItems.current = [...legendItems.current, propSettings[propTypes[ind].key].name]
        newPropTypes[ind].selected = true
        selectedItemsCounter.current += 1
      }else{
        selectedItems.current = selectedItems.current.map(item=> item != propTypes[ind].key ? item: null)
        legendItems.current = legendItems.current.map(name => name != propSettings[propTypes[ind].key].name ? name: null)
        newPropTypes[ind].selected = false
        selectedItemsCounter.current -= 1
      }
      // console.log('selectedItems: ',selectedItems.current)
      // console.log('selectedItemsCounter: ',selectedItemsCounter.current)
      return newPropTypes
    })
  }

  return (
    <Grid item xs={12}>
      <Box className={classes.fullWidthBox}  px ={2} pt={1} pb={-1} mt={2} position='relative' >
        <Box position='absolute' left={68} top={-8} display='flex'>
          <Legend items = {legendItems.current} />
          <IconButton  aria-controls='ts-menu' aria-haspopup= {true} onClick={e=>setAnchorEl(e.currentTarget)} style={{zIndex:100}}>
            <Add/>
          </IconButton>
          {/* <Button  size="small"  variant="outlined" style={{zIndex:100, color:'grey', padding: '3px 6px', marginLeft:'15px'}} aria-controls='ts-menu' aria-haspopup= {true} onClick={e=>setAnchorEl(e.currentTarget)}>
            <Add fontSize='small'/> Add
          </Button> */}
          <Menu id="ts-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=>setAnchorEl(null)}>
            <ListSubheader>Flow</ListSubheader>
            {propTypes.map((item,index) =>{
              return (index < 4) && (
                <>
                  <MenuItem key={index} onClick={clickHandler(index)} disabled = {mode.current == 'pressure'}>
                    <Checkbox checked ={item.selected} color='primary' />
                    <ListItemText>{propSettings[item.key].name}</ListItemText>
                  </MenuItem>
                  {
                    (mode.current == 'pressure' ) && 
                    <MenuItem key={index+20} style={{position: 'absolute',opacity: 0, marginTop:'-48px'}} onClick={()=>{if(!openSnackbar){setOpenSnackbar(true)}}}>
                      <Checkbox checked ={false}/>
                      <ListItemText>{propSettings[item.key].name}</ListItemText>
                    </MenuItem>
                  }
                </>
                )
            })} 
            <Divider/>
            <ListSubheader>Pressure</ListSubheader>
            {propTypes.map((item,index) =>{
              return (index >= 4) && (
                <>
                  <MenuItem key={index} onClick={clickHandler(index)}  disabled = {mode.current == 'flow'}>
                    <Checkbox checked ={item.selected} color='primary'/>
                    <ListItemText>{propSettings[item.key].name}</ListItemText>
                  </MenuItem>
                  {
                    (mode.current == 'flow' ) && 
                    <MenuItem key={index+20} style={{position: 'absolute',opacity: 0, marginTop:'-48px'}} onClick={()=>{if(!openSnackbar){setOpenSnackbar(true)}}}>
                      <Checkbox checked ={false}/>
                      <ListItemText>{propSettings[item.key].name}</ListItemText>
                    </MenuItem>
                  }
                </>
                )
            })}                         
          </Menu>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={()=>{setOpenSnackbar(false)}}
            message={<span>Uncheck all {mode.current} items</span>}
            action={[
              <IconButton onClick={()=>{setOpenSnackbar(false)}} color='inherit'>
                <Clear />
              </IconButton>,
            ]}
          />          
        </Box>
        <Box position='absolute' zIndex={3} right={0} top={-8} >
          <IconButton onClick={props.remove}>
            <Clear/>
          </IconButton>
        </Box>
        { (selectedItemsCounter.current >0 ) && <PlotFlow keys={selectedItems.current}/> }
      </Box>
    </Grid>
  )
}