import React,{useEffect, useState,useRef} from 'react';
import {Box} from '@material-ui/core'
import {getMinMaxY, extractTimeSereis, extractTimeSereisDivider} from '../utils/utils'
// import {u_P} from '../utils/pvFunc'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,XAxis,YAxis} from 'react-vis';

import {
  useTrackedState,
} from 'reactive-react-redux';

import PlowFlowAxis from './PlotFlowAxis'

const time_range = 4000
const initial_time = 3103.4394

const slice_trajectory = (trajectory_data, time, time_range = 4000) =>{
  const time_ = time - initial_time
  if(trajectory_data.length < 1){
    return trajectory_data
  }
  if(trajectory_data[0]['x']>=time_-time_range){
    return trajectory_data
  }else{
    let sliceInd  = 0
    const tl = trajectory_data.length
    for(let i=0;i<tl;i++){
      if(trajectory_data[i]['x'] > time_-time_range){
        sliceInd = i
        break
      }
    }
    return trajectory_data.slice(sliceInd)
  }
}

const transformTrajectory = (trajectory, time,time_range=4000) =>{
  const time_ = time - initial_time
  if(trajectory.length < 1){
    return  [[trajectory,[]], [0, time_range]]
  }
  const tl = trajectory.length
  const quotient = Math.floor(time_/time_range)
  if(trajectory[0]['x'] > quotient * time_range){
    return [[trajectory,[]],[quotient * time_range,(quotient+1) * time_range]]
  }
  const frontArray = []
  let endInd  = 0
  let flag = false
  for(let i=0;i<tl;i++){
    if(trajectory[i]['x'] > quotient * time_range){
      if(! flag){
        endInd = i
        flag = true
      }
      frontArray.push({x:trajectory[i]['x']-time_range, y:trajectory[i]['y']})
    }
  }
  return [[frontArray, trajectory.slice(10,endInd)],[(quotient-1) * time_range,(quotient) * time_range]]
}


export default (props) => {
  const state = useTrackedState();
  const cv_props = state.hemodynamicProps
  const [trajectory, setTrajectory] = useState([]);
  const trajectoryLines = useRef([[],[]])
  const xlimsRef = useRef([0,4000])
  const ylimsRef = useRef([0,0])

  useEffect(() => {
    const {data,time,logger} = state.hemodynamicSeries
    if(logger.length > 0){
      setTrajectory(trajectory =>{
        let newData
        if(props.divider == null){
          newData = extractTimeSereis(logger,props.name, initial_time)
        }else{
          newData = extractTimeSereisDivider(logger,props.name, initial_time, cv_props[props.divider])
        }
        let newTrajectory = trajectory.concat(newData)
        const res = slice_trajectory(newTrajectory,time,time_range)

        let [yMin,yMax] = getMinMaxY(res)
        if(yMin >= 0){ 
          yMin = 0
        }else{
          yMin = Math.floor((yMin*1.2)/0.1+1)*0.1
        }
        yMax = Math.floor((yMax*1.2/0.1)+1)*0.1
        if(yMin != ylimsRef.current[0] || yMax !=  ylimsRef.current[1]){
          ylimsRef.current=[yMin, yMax]
        }

        trajectoryLines.current = transformTrajectory(res,time,time_range)[0]
        const newXLims= transformTrajectory(res,time,time_range)[1]
        if (newXLims[1] != xlimsRef.current[1]){
          xlimsRef.current = newXLims
        }
        return res
      })
    }
  }, [state.hemodynamicSeries]);



  return (
    <Box position ='relative' width={1} height={1}>
      <PlowFlowAxis xlims = {xlimsRef.current} ylims={ylimsRef.current}/>
      <Box position='absolute'  width={1} height={1}>
        <FlexibleXYPlot xDomain={xlimsRef.current}> 
          <LineSeries data={trajectoryLines.current[0]} color="#12939a"/>    
          <LineSeries data={trajectoryLines.current[1]} color="#12939a"/>          
        </FlexibleXYPlot>
      </Box>
    </Box>
  )
}


  // const cvProps = useRef()
  // const calcFlow = useRef()
  

  // useEffect(() => {
  //   cvProps.current = state.hemodynamicProps
  //   const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
  //   switch(props.name){
  //     case 'MVF':
  //       calcFlow.current = (time,data)=>{
  //         const pla = u_P(get_column(data, chamber_volume_mapping['LA']),time,cvProps.current.LA_Ees,cvProps.current.LA_V0,cvProps.current.LA_alpha, cvProps.current.LA_beta, cvProps.current.LA_Tmax, cvProps.current.LA_tau, cvProps.current.LA_AV_delay, cvProps.current.HR)
  //         const plv = u_P(get_column(data, chamber_volume_mapping['LV']),time,cvProps.current.LV_Ees,cvProps.current.LV_V0,cvProps.current.LV_alpha, cvProps.current.LV_beta, cvProps.current.LV_Tmax, cvProps.current.LV_tau, cvProps.current.LV_AV_delay, cvProps.current.HR)
  //         const res = []
  //         for(let i=0; i<pla.length; i=i+3){
  //           if(pla[i]-plv[i]<0){
  //             res.push({ x:time[i], y: 0})
  //           }else{
  //             res.push({ x:time[i], y: (pla[i]-plv[i])/cvProps.current.Rmv})
  //           }
  //         }
  //         return res
  //       }
  //   }
  // }, [state.hemodynamicProps]);

  // let Ias = (Qas/Cas-Qvs/Cvs)/Ras
  // let Ics = (Qas_prox/Cas_prox-Qas/Cas)/Rcs  
  // let Imv = (Pla-Plv)/Rmv
  // let Ivp = (Qvp/Cvp-Pla)/Rvp
  // let Iap = (Qap/Cap-Qvp/Cvp)/Rap
  // let Icp = (Qap_prox/Cap_prox-Qap/Cap)/Rcp
  // let Itv = (Pra-Prv)/Rtv
  // let Ivs = (Qvs/Cvs-Pra)/Rvs
  // let Iasp =(Plv-Qas_prox/Cas_prox)/Ras_prox
  // let Iapp =(Prv-Qap_prox/Cap_prox)/Rap_prox