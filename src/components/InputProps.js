import React,{useState, useCallback } from 'react';
import {Slider,Typography, Grid,Box} from '@material-ui/core';
import {PUSH_PROP_MUTATION} from '../actions'
import InputSetting from '../settings/InputSetting'
import {
  useDispatch,
  useTrackedState,
} from 'reactive-react-redux';

const InputProps  = React.memo((props) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState( state.hemodynamicProps[props.name]);
  const {min,max,step} = InputSetting[props.name]
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
                {props.name}
              </Typography>
          </Grid>
          <Grid item md={7}>
            <Slider value = {inputValue} aria-labelledby = {props.name}  onChange={handleChange} onChangeCommitted={dispatchChangeComitted} min={min} max={max} step={step} valueLabelDisplay="auto"/>
          </Grid>
        </Grid>
      </Box>
      <Box display={{sm:'block', md:'none'}} pb={1}>
          <Typography id={props.name}>
            {props.name}
          </Typography>
          <Slider value = {inputValue} aria-labelledby = {props.name}  onChange={handleChange} onChangeCommitted={dispatchChangeComitted} min={min} max={max} step={step} valueLabelDisplay="auto"/>
      </Box>
    </>
  )
})

export default InputProps