import React,{useContext,useState } from 'react';
import AppContext from '../contexts/AppContexts'
import {Slider,Typography} from '@material-ui/core';
import {PUSH_PROP_MUTATION} from '../actions'
import InputSetting from '../settings/InputSetting'

const InputProps  = React.memo((props) => {
  const {state,dispatch} = useContext(AppContext);
  const [inputValue, setInputValue] = useState( state.hemodynamicProps[props.name]);
  const {min,max,step} = InputSetting[props.name]
  const dispatchChangeComitted = (e,v) =>{
    dispatch(
      {
        type: PUSH_PROP_MUTATION,
        propMutation: {[props.name]:v},
      }
    )
  }
  const handleChange = (e,v) =>{
    setInputValue(v)
  }
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