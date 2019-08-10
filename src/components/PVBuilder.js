import React,{useEffect, useContext,useState,useRef} from 'react';
import AppContext from '../contexts/AppContexts'
import {u_P} from '../utils/pvFunc'
import {get_column,  zip_series_with_label} from '../utils/utils'
// import SimpleLine from './SimpleLine'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,MarkSeries, XAxis,YAxis} from 'react-vis';
import { Box } from '@material-ui/core';

export default (props) => {
  const {state,_} = useContext(AppContext);
  const [trajectory, setTrajectory] = useState([]);
  const calcPressure = useRef()
  const chamber = props.chamber
  
  useEffect(()=>{
    const cv_props = state.hemodynamicProps
    const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
    
    const [c_Ees,c_V0,c_alpha, c_beta, c_Tmax, c_tau, c_AV_delay] = ['Ees','V0','alpha', 'beta', 'Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
    const [Ees,V0,alpha, beta, Tmax, tau, AV_delay] = [cv_props[c_Ees],cv_props[c_V0],cv_props[c_alpha], cv_props[c_beta], cv_props[c_Tmax], cv_props[c_tau], cv_props[c_AV_delay]] 
    const HR = cv_props['HR']
    calcPressure.current = (time, data) => {
      const v = get_column(data, chamber_volume_mapping[chamber])
      // console.log('v:', v)
      // console.log('time:', time)
      const p = u_P(v,time,Ees,V0,alpha, beta, Tmax, tau, AV_delay, HR)
      // console.log('p: ',p)
      // console.log('zip_series(v,p): ',zip_series(v,p))
      return  zip_series_with_label(v,p)
    } 
  },[state.hemodynamicProps])

  useEffect(()=>{
    const {data,time} = state.hemodynamicSeries
    setTrajectory(trajectory => {
      let newTrajectory = trajectory.concat(calcPressure.current(time,data))
      const len = newTrajectory.length
      if (len >1000){
        return newTrajectory.slice(len-1000+1,1000)
      }
      return newTrajectory
    })
  },[state.hemodynamicSeries])

  return (
    <FlexibleXYPlot > 
      <XAxis/>
      <YAxis/>
      <LineSeries data={trajectory} />
      {trajectory.length > 2 ?  <MarkSeries data={[{...trajectory[trajectory.length-1], size: 3},{...trajectory[0], size: 10, opacity:0},{...trajectory[0], size: 0, opacity:0}]}/>: null}
    </FlexibleXYPlot>
  ) 
}

