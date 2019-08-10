import React from 'react';
import {List} from '@material-ui/core';
import InputProps from './InputProps'

export default React.memo((props) => {
  return (
    <List>
      <p>Hey</p>
      <InputProps name='LV_Ees'/>
      <InputProps name='LV_alpha'/>
      <InputProps name='LV_beta'/>
      <InputProps name='LV_Tmax'/>
    </List>
  )
})
