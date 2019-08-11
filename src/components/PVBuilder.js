import React,{useEffect, useContext,useState,useRef} from 'react';
import AppContext from '../contexts/AppContexts'
import {u_P} from '../utils/pvFunc'
import {get_column,  zip_series_with_label, getMax} from '../utils/utils'
// import SimpleLine from './SimpleLine'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,MarkSeries, XAxis,YAxis} from 'react-vis';

export default (props) => {
  const {state,_} = useContext(AppContext);
  const [trajectory, setTrajectory] = useState([]);
  const calcPressure = useRef()
  const chamber = props.chamber
  const limsRef = useRef([0,0])
  const ESPVR_Ref = useRef([])
  const EDPVR_Ref = useRef([])

  const Ees = useRef()
  const V0 = useRef()
  const alpha = useRef()
  const beta = useRef()
  const Tmax = useRef()
  const tau = useRef()
  const AV_delay = useRef()
  const HR = useRef()
  
  useEffect(()=>{
    const cv_props = state.hemodynamicProps
    const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
    const [c_Ees,c_V0,c_alpha, c_beta, c_Tmax, c_tau, c_AV_delay] = ['Ees','V0','alpha', 'beta', 'Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
    Ees.current = cv_props[c_Ees]
    V0.current  = cv_props[c_V0]
    alpha.current = cv_props[c_alpha]
    beta.current = cv_props[c_beta]
    Tmax.current = cv_props[c_Tmax]
    tau.current = cv_props[c_tau]
    AV_delay.current  =  cv_props[c_AV_delay] 
    HR.current = cv_props['HR']
    calcPressure.current = (time, data) => {
      const v = get_column(data, chamber_volume_mapping[chamber])
      // console.log('v:', v)
      // console.log('time:', time)
      const p = u_P(v,time,Ees.current,V0.current,alpha.current, beta.current, Tmax.current, tau.current, AV_delay.current, HR.current)
      // console.log('p: ',p)
      // console.log('zip_series(v,p): ',zip_series(v,p))
      return  zip_series_with_label(v,p)
    } 
  },[state.hemodynamicProps])

  useEffect(()=>{
    const {data,time} = state.hemodynamicSeries
    setTrajectory(trajectory => {
      let newTrajectory = trajectory.concat(calcPressure.current(time,data))
      if(newTrajectory.length>10){
        let maxs = getMax(newTrajectory)
        limsRef.current = [Math.floor((maxs[0]*1.2)/20+1)*20, Math.floor((maxs[1]*1.2/20)+1)*20]
        let ESPVR_last_point = Ees.current * (limsRef.current[0]-V0.current) < limsRef.current[1] ? {x: limsRef.current[0],y: Ees.current * (limsRef.current[0]-V0.current)} : {x:limsRef.current[1]/Ees.current + V0.current , y: limsRef.current[1]} 
        ESPVR_Ref.current = [{x:V0.current,y:0},ESPVR_last_point]
        const step_size = 50
        let edpvr_points = []
        if(beta.current * (Math.exp(alpha.current*(limsRef.current[0]-V0.current))-1) <  limsRef.current[1]){
          for(let i=0; i < step_size; i++){
            let x = limsRef.current[0] * i / step_size
            let y = beta.current * (Math.exp(alpha.current*(x-V0.current))-1)
            edpvr_points.push({x,y})
          }
        }else{
          for(let i=0; i < step_size; i++){
            let y = limsRef.current[1] * i / step_size
            let x =  Math.log1p(y/beta.current) / alpha.current + V0.current
            edpvr_points.push({x,y})
          }
        }
        EDPVR_Ref.current = edpvr_points
      }
      const len = newTrajectory.length
      if (len >500){
        return newTrajectory.slice(len-500+1,500)
      }
      return newTrajectory
    })
  },[state.hemodynamicSeries])

  

  return (
    <FlexibleXYPlot xDomain={[0,limsRef.current[0]]} yDomain={[0,limsRef.current[1]]}> 
      <XAxis/>
      <YAxis/>
      <LineSeries data={trajectory} />
      <LineSeries data ={ESPVR_Ref.current} strokeStyle='dashed' opacity={0.5} color='gray'/>
      <LineSeries data ={EDPVR_Ref.current} strokeStyle='dashed' opacity={0.5} color='gray'/>      
      {trajectory.length > 2 ?  <MarkSeries data={[{...trajectory[trajectory.length-1], size: 3},{...trajectory[0], size: 10, opacity:0},{...trajectory[0], size: 0, opacity:0}]}/>: null}
    </FlexibleXYPlot>
  ) 
}

