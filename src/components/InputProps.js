import React,{useState, useCallback, useEffect } from 'react';
import {Slider,Typography, Grid,Box} from '@material-ui/core';
import {PUSH_PROP_MUTATION} from '../actions'
import InputSetting from '../settings/InputSetting'
import {
  useDispatch,
  useTrackedState,
} from 'reactive-react-redux';

const InputProps  = (props) => {
  const state = useTrackedState();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState(state.hemodynamicProps[props.name]);
  const {min,max,step} = InputSetting[props.name]
  useEffect(() => {
      setInputValue(state.hemodynamicProps[props.name])
  }, [props.name]); 

  const dispatchChangeComitted = useCallback((e,v) =>{
    dispatch(
      {
        type: PUSH_PROP_MUTATION,
        propMutation: {[props.name]:v},
      }
    )
  })
  const handleChange = useCallback((e,v) =>{
    setInputValue(v)
  })
  return (
    <>
      <Box display={{xs:'none',sm:'none', md:'block'}} py={1}>
        <Grid container>
          <Grid item md={5}>
              <Typography id={props.name}>
                {props.label}
              </Typography>
          </Grid>
          <Grid item md={7}>
            <Box alignItems="center" display="flex" height={1}>
              <Slider value = {inputValue} aria-labelledby = {props.name}  
              onChange={handleChange} onChangeCommitted={dispatchChangeComitted} 
              min={min} max={max} step={step} marks={props.marks || []}
              valueLabelDisplay="auto"/>
            </Box>          
          </Grid>
        </Grid>
      </Box>
      <Box display={{sm:'block', md:'none'}} pb={1}>
          <Typography id={props.name}>
            {props.label}
          </Typography>
            <Slider value = {inputValue} aria-labelledby = {props.name}  
            onChange={handleChange} onChangeCommitted={dispatchChangeComitted} 
            min={min} max={max} step={step} marks={props.marks || []}
            valueLabelDisplay="auto"/>
      </Box>
    </>
  )
}

export default InputProps