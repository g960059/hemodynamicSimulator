import React,{useEffect, useState,useRef} from 'react';
import {Box} from '@material-ui/core'
import {getMinMaxY, extractTimeSereis, extractTimeSereisDivider} from '../utils/utils'
import PlotFlowLine from './PlotFlowLine'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,XAxis,YAxis} from 'react-vis';

import { useTrackedState} from 'reactive-react-redux';

import PlowFlowAxis from './PlotFlowAxis'

const time_range = 8000
const initial_time = 3103.4394

// last = 5200 -> 1200  4000 -> 5200, 3200->4000, 

const slice_trajectory = (trajectory, time_range = 8000) =>{
  const last_time = trajectory[trajectory.length-1]['x']
  const split_time = last_time - last_time % time_range
  const start_time = last_time - time_range

  if(trajectory.length < 1 || last_time <= time_range){
    return [trajectory, trajectory, []]
  }else{
    const firstArray = []
    const secondArray = []
    const res = []
    const tl = trajectory.length
    for(let i=0;i<tl;i++){
      if(trajectory[i]['x'] > start_time){
        if(0 < i && i< tl-1){
          if(trajectory[i-1]['x'] != trajectory[i]['x']  || trajectory[i]['x'] != trajectory[i+1]['x']){
            res.push(trajectory[i])
          }
        }else{
          res.push(trajectory[i])
        }
      }
      
      if(start_time+200 < trajectory[i]['x'] && trajectory[i]['x'] <= split_time){
        firstArray.push(
          {
            x:trajectory[i]['x'] % time_range, 
            y:trajectory[i]['y']
          }
        )
      }
      if(split_time < trajectory[i]['x'] ){
        secondArray.push(
          {
            x:trajectory[i]['x'] % time_range, 
            y:trajectory[i]['y']            
          }
        )
      }
    }
    return [res, firstArray, secondArray]
  }
}


export default (props) => {
  const state = useTrackedState();
  const cv_props = state.hemodynamicProps
  const [trajectory, setTrajectory] = useState([]);
  // const trajectoryLines = useRef([[],[]])
  const firstArray = useRef([])
  const secondArray = useRef([])
  const history = useRef([[[]],[[]]])
  const historyIndex = useRef(0)
  const historyColumn = useRef(0)
  const historyColumnPrev = useRef(-1)
  const prevAreasCounter = useRef(0)
  const prevAreaData = useRef([])

  const xlimsRef = useRef([0, time_range])
  const xlimsRefPrev = useRef([-time_range,0])
  const ylimsRef = useRef([0,0])
  const accTime = useRef(0)
  const lastLogTime = useRef(0)

  useEffect(() => {
    const {data,time,logger} = state.hemodynamicSeries
    if(logger.length > 0){
      setTrajectory(trajectory =>{
        let newData
        if(props.divider == null){
          newData = extractTimeSereis(logger,props.name, lastLogTime.current, accTime.current, 60000/state.hemodynamicProps.HR)
        }else{
          newData = extractTimeSereisDivider(logger, props.name, cv_props[props.divider],lastLogTime.current,  accTime.current, 60000/state.hemodynamicProps.HR)
        }
        // console.log(newData)
        let timeDif = logger[logger.length-1]['t'] - lastLogTime.current 
        if(timeDif < 0){
          timeDif += 60000/state.hemodynamicProps.HR 
        }
        if(timeDif > 0){
          accTime.current += timeDif
        }
        lastLogTime.current = logger[logger.length-1]['t']
        let newTrajectory = trajectory.concat(newData)


        // let res
        // [res, firstArray.current, secondArray.current] = slice_trajectory(newTrajectory,time_range)

        let [yMin,yMax] = getMinMaxY(newTrajectory)
        if(yMin >= 0){ 
          yMin = 0
        }else{
          yMin = Math.floor((yMin*1.2)/0.1+1)*0.1
        }
        yMax = Math.floor((yMax*1.2/0.1)+1)*0.1
        if(yMax > ylimsRef.current[1]){
          ylimsRef.current[1]  = yMax
        }
        if(yMin < ylimsRef.current[0]){
          ylimsRef.current[0] = yMin
        }
        let res = newTrajectory
        // console.log('accTime.current: ', accTime.current)
        // console.log('xlim: ', xlimsRef.current[1])
        const len = newTrajectory.length
        if(accTime.current > xlimsRef.current[1]){
          for(let i=0; i< len; i++){
            if(newTrajectory[i].x > xlimsRef.current[1]){
              history.current[historyColumn.current][historyIndex.current] = newTrajectory.slice(0,i)
              res =  newTrajectory.slice(i)
              // console.log('rest_data: ', newTrajectory.slice(0,i))
            }
          }
        }else{
          if (len > 100 ){
            history.current[historyColumn.current][historyIndex.current] = newTrajectory.slice(0,40)
            // console.log('newTrajectory.slice(0,100): ',newTrajectory.slice(0,100))
            historyIndex.current += 1
            res = newTrajectory.slice(38)
          }
        }        

        // if(yMin != ylimsRef.current[0] || yMax !=  ylimsRef.current[1]){
        //   console.log('hey')
        //   ylimsRef.current=[yMin, yMax]
        // }
        if(xlimsRef.current[1] < accTime.current){
          historyColumn.current = (historyColumn.current + 1) % 2
          historyColumnPrev.current = (historyColumnPrev.current + 1) % 2
          historyIndex.current  = 0
          // console.log('historyColumn: ',historyColumn.current)
          // console.log('historyColumnPrev: ', historyColumnPrev.current)
          history.current[historyColumn.current] = []
          xlimsRef.current[0] += time_range
          xlimsRef.current[1] += time_range
          xlimsRefPrev.current[0] += time_range
          xlimsRefPrev.current[1] += time_range
          console.log(history.current[historyColumnPrev.current])
        }
        if(historyColumnPrev.current>=0){
          const prevHistoryLen =  history.current[historyColumnPrev.current].length 
          prevAreasCounter.current = prevHistoryLen - 1
          for(let i =0; i< prevHistoryLen; i++){
            if(history.current[historyColumnPrev.current][i][0].x >= accTime.current- time_range+100){
              prevAreasCounter.current = i-1 < 0 ? 0: i-1
              break
            }
          }
          const prevAreaLen = history.current[historyColumnPrev.current][prevAreasCounter.current].length
          for(let i=0; i<prevAreaLen; i++){
            if( history.current[historyColumnPrev.current][prevAreasCounter.current][i].x >= accTime.current- time_range+100){
              prevAreaData.current = history.current[historyColumnPrev.current][prevAreasCounter.current].slice(i)
              break;
            }
          }
        }

        return res
      })
    }
  }, [state.hemodynamicSeries]);

// 0                  4000
// 4000   4500        8000



  return (
    <Box position ='relative' width={1} height={1}>
      <PlowFlowAxis xlims = {xlimsRef.current} ylims={ylimsRef.current}/>
      {
        historyColumnPrev.current >= 0 && (
          history.current[historyColumnPrev.current].map((data,index)=> (
            (index > prevAreasCounter.current)  && <PlotFlowLine key={index} data={data} xlims = {xlimsRefPrev.current} ylims={ylimsRef.current}/>
          )
        ))
      } 
      {
        (
          history.current[historyColumn.current].map((data,index)=>(
            <PlotFlowLine key={index} data={data} xlims = {xlimsRef.current} ylims={ylimsRef.current}/>
          )
        ))
      }        
      <PlotFlowLine data ={prevAreaData.current} xlims = {xlimsRefPrev.current} ylims={ylimsRef.current}/>

      <Box position='absolute'  width={1} height={1}>
        <FlexibleXYPlot xDomain = {xlimsRef.current} yDomain={ylimsRef.current}> 
          {/* <LineSeries data={firstArray.current} color="#12939a"/>    
          <LineSeries data={secondArray.current} color="#12939a"/>          */}
          <LineSeries data={trajectory} opacity={0.6} />               
        </FlexibleXYPlot>
      </Box>
    </Box>
  )
}



// const transformTrajectory = (trajectory, time,time_range=4000) =>{
//   const time_ = time - initial_time
//   if(trajectory.length < 1){
//     return  [[trajectory,[]], [0, time_range]]
//   }
//   const tl = trajectory.length
//   const quotient = Math.floor(time_/time_range)
//   if(trajectory[0]['x'] > quotient * time_range){
//     return [[trajectory,[]],[quotient * time_range,(quotient+1) * time_range]]
//   }
//   const frontArray = []
//   let endInd  = 0
//   let flag = false
//   for(let i=0;i<tl;i++){
//     if(trajectory[i]['x'] > quotient * time_range){
//       if(! flag){
//         endInd = i
//         flag = true
//       }
//       frontArray.push({x:trajectory[i]['x']-time_range, y:trajectory[i]['y']})
//     }
//   }
//   return [[frontArray, trajectory.slice(10,endInd)],[(quotient-1) * time_range,(quotient) * time_range]]
// }

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