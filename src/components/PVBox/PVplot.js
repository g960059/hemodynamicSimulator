import React, {useContext, useState, useEffect} from 'react';
import {get_column, zip_series} from '../utils/utils'
import {u_P,P} from '../utils/pvFunc'
import SimpleLine from './SimpleLine'
import { Paper } from '@material-ui/core';


const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
const calcPV = (chamber, cv_props, option={}) =>{
  const [c_Ees,c_V0,c_alpha, c_beta, c_Tmax, c_tau, c_AV_delay] = ['Ees','V0','alpha', 'beta', 'Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
  const [Ees,V0,alpha, beta, Tmax, tau, AV_delay] = [cv_props[c_Ees],cv_props[c_V0],cv_props[c_alpha], cv_props[c_beta], cv_props[c_Tmax], cv_props[c_tau], cv_props[c_AV_delay]] 
  const HR = cv_props['HR']
  const chart_option = {
    xaxis:{type:'numeric',tickAmount:4}, 
    yaxis:{type:'numeric',tickAmount:4,decimalsInFloat:0, min:0},
    ...option}

  return ((times, series)=>{
      const Vs = get_column(series, chamber_volume_mapping[chamber])
      const Ps = u_P(Vs,times, Ees,V0,alpha, beta, Tmax, tau, AV_delay, HR)
      const maxP = Math.max(...Ps)
      const max_ys = [5,20,50,100,150,200].filter(x=>x>maxP)
      const max_y = max_ys[0]
      chart_option['yaxis']['max']=max_y
      return [zip_series(Vs,Ps), chart_option]
    } )
} 

const calcPressureVolumeLV = (time,data, cv_props)=>{
  const chamber = 'LV'
  const v = data[chamber_volume_mapping[chamber]]
  const [c_Ees,c_V0,c_alpha, c_beta, c_Tmax, c_tau, c_AV_delay] = ['Ees','V0','alpha', 'beta', 'Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
  const [Ees,V0,alpha, beta, Tmax, tau, AV_delay] = [cv_props[c_Ees],cv_props[c_V0],cv_props[c_alpha], cv_props[c_beta], cv_props[c_Tmax], cv_props[c_tau], cv_props[c_AV_delay]] 
  const HR = cv_props['HR']
  const p = P(v,time,Ees,V0,alpha, beta, Tmax, tau, AV_delay, HR)
  return [v,p]
}

export const PV_LV = props =>{
  const [localTimes, setLocalTimes] = useState([]);
  const [localSeries, setLocalSeries] = useState([]);
  useEffect(() => {
    const new_series_data = calcPressureVolumeLV(props.time,props.data, props.cv_props)
    setLocalTimes(times => [...times, props.time])
    setLocalSeries(series =>[...series,new_series_data])
  }, [props.data]);
  return (
    <Paper>
      {
        localSeries.length > 2 ? <SimpleLine data = {[localSeries,{}]}/>: null
      }
    </Paper>
  )

}

export default calcPV;