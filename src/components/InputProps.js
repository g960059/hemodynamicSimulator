import React,{useContext,useState, useCallback } from 'react';
import AppContext from '../contexts/AppContexts'
import {Slider,Typography, Grid} from '@material-ui/core';
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
      <Typography id={props.name} gutterBottom>
        {props.name}
      </Typography>
      <Slider value = {inputValue} aria-labelledby = {props.name}  onChange={handleChange} onChangeCommitted={dispatchChangeComitted} min={min} max={max} step={step} valueLabelDisplay="auto"/>
    </>
  )
})

export default InputProps