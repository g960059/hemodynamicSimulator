import React,{useEffect,useState,useRef} from 'react';
import {getMax, zip_cols} from '../utils/utils'
import {Box} from '@material-ui/core'


import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,MarkSeries, XAxis,YAxis} from 'react-vis';
import PVBuilderAxis from './PVBuilderAxis'

import {
  useTrackedState,
} from 'reactive-react-redux';


export default (props) => {
  const state = useTrackedState();
  const [trajectory, setTrajectory] = useState([]);
  const limsRef = useRef([0,0])
  const ESPVR_Ref = useRef([])
  const EDPVR_Ref = useRef([])

  const Ees = useRef()
  const V0 = useRef()
  const alpha = useRef()
  const beta = useRef()

  const chamber_mapping ={LV:['Qlv','Plv'],LA:['Qla','Pla'],RV:['Qrv','Prv'],RA:['Qra','Pra']}

  useEffect(()=>{
    const chamber = props.chamber
    const cv_props = state.hemodynamicProps
    // const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
    // const chamber_mapping ={LV:[4,10],LA:[5,11],RV:[6,12],RA:[7,13]}
    const [c_Ees,c_V0,c_alpha, c_beta,] = ['Ees','V0','alpha', 'beta'].map(x=>chamber+'_'+x)
    Ees.current = cv_props[c_Ees]
    V0.current  = cv_props[c_V0]
    alpha.current = cv_props[c_alpha]
    beta.current = cv_props[c_beta]

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
    


    } ,[state.hemodynamicProps])

  useEffect(()=>{
    const {data,time,logger} = state.hemodynamicSeries
    setTrajectory(trajectory => {
      // console.log(chamber_mapping[props.chamber])
      let newTrajectory = trajectory.concat(zip_cols(logger,chamber_mapping[props.chamber]))
      // console.log('newTrajectory:',newTrajectory)
      if(newTrajectory.length>10){
        let maxs = getMax(newTrajectory)
        const [xMaxOld, yMaxOld] = limsRef.current
        const [xMaxNew, yMaxNew] = [Math.floor((maxs[0]*1.2)/20+1)*20, Math.floor((maxs[1]*1.2/20)+1)*20]
        if(xMaxOld != xMaxNew || yMaxOld != yMaxNew){
          limsRef.current = [xMaxNew, yMaxNew]
          let ESPVR_last_point = Ees.current * (limsRef.current[0]-V0.current) < limsRef.current[1] ? {x: limsRef.current[0],y: Ees.current * (limsRef.current[0]-V0.current)} : {x:limsRef.current[1]/Ees.current + V0.current , y: limsRef.current[1]} 
          ESPVR_Ref.current = [{x:V0.current,y:0},ESPVR_last_point]
          const step_size = 50
          let edpvr_points = []
          if(beta.current * (Math.exp(alpha.current*(limsRef.current[0]-V0.current))-1) <  limsRef.current[1]){
            for(let i=0; i < step_size; i=i+2){
              let x = limsRef.current[0] * i / step_size
              let y = beta.current * (Math.exp(alpha.current*(x-V0.current))-1)
              edpvr_points.push({x,y})
            }
          }else{
            for(let i=0; i < step_size; i=i+2){
              let y = limsRef.current[1] * i / step_size
              let x =  Math.log1p(y/beta.current) / alpha.current + V0.current
              edpvr_points.push({x,y})
            }
          }
          EDPVR_Ref.current = edpvr_points
        }          
      }
      const len = newTrajectory.length
      if (len >300){
        return newTrajectory.slice(len-300+1,300)
      }
      return newTrajectory
    })
  },[state.hemodynamicSeries])

   if(trajectory.length > 2){
     return (
      <Box position ='relative' width={1} height={1}>
        <PVBuilderAxis lims={limsRef.current} ESPVR={ESPVR_Ref.current} EDPVR={EDPVR_Ref.current} />
        <Box position='absolute'  width={1} height={1}>
          <FlexibleXYPlot xDomain={[0,limsRef.current[0]]} yDomain={[0,limsRef.current[1]]}> 
            <LineSeries data= {trajectory} />
            <MarkSeries data={[{...trajectory[trajectory.length-1], size: 3},{...trajectory[0], size: 10, opacity:0},{...trajectory[0], size: 0, opacity:0}]}/>
          </FlexibleXYPlot>
        </Box>
      </Box>
      
      )
     }else{
      return null
    }
}


    // Tmax.current = cv_props[c_Tmax]
    // tau.current = cv_props[c_tau]
    // AV_delay.current  =  cv_props[c_AV_delay] 
    // HR.current = cv_props['HR']
    // calcPressure.current = (data) => {
      // const v = get_column(data, chamber_volume_mapping[chamber])
      // console.log('v:', v)
      // console.log('time:', time)
      // const p = u_P(v,time,Ees.current,V0.current,alpha.current, beta.current, Tmax.current, tau.current, AV_delay.current, HR.current)
      // console.log('p: ',p)
      // console.log('zip_series(v,p): ',zip_series(v,p))
      
  //     return zip_cols(data,chamber_mapping[chamber])