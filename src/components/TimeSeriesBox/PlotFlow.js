import React,{useEffect, useState,useRef} from 'react';
import {Box} from '@material-ui/core'
import {getMinMaxY, extractTimeSereis, extractTimeSereisDivider} from '../../utils/utils'
import PlotFlowLine from './PlotFlowLine'
import '../../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot, LineSeries,DiscreteColorLegend} from 'react-vis';
import './reactVisLengend.css'
import { useTrackedState} from 'reactive-react-redux';

import PlowFlowAxis from './PlotFlowAxis'
import palette from '../../settings/Palette'
import PropSettings from '../../settings/PropSettings'
// import Ledend from './PlotFlowLegend'

const time_range = 6000
// const initial_time = 3103.4394

// last = 5200 -> 1200  4000 -> 5200, 3200->4000, 
const margin = {left: 40, right: 10, top: 10, bottom: 20}

export default (props) => {
  const state = useTrackedState();
  const cv_props = state.hemodynamicProps
  const [trajectory, setTrajectory] = useState([[]]);

  const history = useRef([[[[]]]])
  const historyIndex = useRef(0)
  const historyColumn = useRef(0)
  const historyColumnPrev = useRef(-1)
  const prevAreasCounter = useRef(0)
  const prevAreaData = useRef([[]])

  const xlimsRef = useRef([0, time_range])
  const xlimsRefPrev = useRef([-time_range,0])
  const ylimsRef = useRef([0,0])
  const accTime = useRef(0)
  const lastLogTime = useRef(0)

  useEffect(() => {
    const {logger} = state.hemodynamicSeries
    if(logger.length > 0){
      setTrajectory(trajectory =>{
        // TODO: refactor performance, make extractTimeSereis take multiple keys
        let newTrajectory = [[]]
        props.keys.map((key,index)=>{
          if(key==null){
            newTrajectory[index] = []
          }else{
            if(PropSettings[key].divider == null){
              newTrajectory[index] = trajectory[index]== null ? extractTimeSereis(logger,key, lastLogTime.current, accTime.current, 60000/state.hemodynamicProps.HR):  trajectory[index].concat(extractTimeSereis(logger,key, lastLogTime.current, accTime.current, 60000/state.hemodynamicProps.HR))
            }else{
              // console.log('PropSettings[key].divider: ',PropSettings[key].divider)
              newTrajectory[index] = trajectory[index]== null ? extractTimeSereisDivider(logger, key, cv_props[PropSettings[key].divider],lastLogTime.current,  accTime.current, 60000/state.hemodynamicProps.HR) :  trajectory[index].concat(extractTimeSereisDivider(logger, key, cv_props[PropSettings[key].divider],lastLogTime.current,  accTime.current, 60000/state.hemodynamicProps.HR))
            }
          }
        })
        let mainIndex = 0
        for(let k=0; k<props.keys.length; k++){
          if(props.keys[k]!=null){
            mainIndex = k
            break
          }
        }


        let timeDif = logger[logger.length-1]['t'] - lastLogTime.current 
        if(timeDif < 0){
          timeDif += 60000/state.hemodynamicProps.HR 
        }
        if(timeDif > 0){
          accTime.current += timeDif
        }
        lastLogTime.current = logger[logger.length-1]['t']

        // let newTrajectory = trajectory.concat(newData)

        let yMin = Infinity
        let yMax = -Infinity
        newTrajectory.map(traj => {
          let [yMinNew, yMaxNew] = getMinMaxY(traj)
          yMin = yMinNew < yMin ? yMinNew : yMin
          yMax = yMaxNew > yMax ? yMaxNew : yMax
        })
        if(yMin >= 0){ 
          yMin = 0
        }else{
          yMin = Math.floor((yMin*1.2)/0.1+1)*0.1
        }
        yMax = Math.floor((yMax*1.2/0.1)+1)*0.1
        if(yMax > ylimsRef.current[1]){
          ylimsRef.current  = [ylimsRef.current[0], yMax]
        }
        if(yMin < ylimsRef.current[0]){
          ylimsRef.current = [yMin, ylimsRef.current[1]]
        }
        let res = newTrajectory

        const newDataLength = newTrajectory[mainIndex].length
        const trajTypeLength = newTrajectory.length
        // console.log('accTime:', accTime.current)
        if(accTime.current > xlimsRef.current[1]){
          // console.log('xlimsRef: ', xlimsRef.current[1])
          for(let i=0; i< newDataLength; i++){
            if(newTrajectory[mainIndex][i].x > xlimsRef.current[1]){
              for(let j=0; j<trajTypeLength; j++){
                if(history.current[historyColumn.current] == null){
                  history.current[historyColumn.current] = []
                }
                if(history.current[historyColumn.current][j]==null){
                  history.current[historyColumn.current][j] = []
                }
                history.current[historyColumn.current][j][historyIndex.current] = newTrajectory[j].slice(0,i)
                res[j] =  newTrajectory[j].slice(i)
              }
              // console.log('res: ', res)
              break
            }
          }
          
        }else{
          if (newDataLength > 100 ){
            // console.log('trajTypeLength: ',trajTypeLength)
            for(let j=0; j<trajTypeLength; j++){
              // console.log('j; ', j, 'historyIndex: ',historyIndex.current, 'history[historyColumn][j]: ', history.current[historyColumn.current][j])
              if(history.current[historyColumn.current][j]==null){
                history.current[historyColumn.current][j] = []
              }
              history.current[historyColumn.current][j][historyIndex.current] = newTrajectory[j].slice(0,40)
              res[j] = newTrajectory[j].slice(38)
            }
            historyIndex.current += 1
          }
        }        
        if(accTime.current > xlimsRef.current[1]){
          historyColumn.current = (historyColumn.current + 1) % 2
          historyColumnPrev.current = (historyColumnPrev.current + 1) % 2
          historyIndex.current  = 0
          xlimsRef.current[0] += time_range
          xlimsRef.current[1] += time_range
          // console.log('xlimsRef_changed: ', xlimsRef.current[1])
          xlimsRefPrev.current[0] += time_range
          xlimsRefPrev.current[1] += time_range
          // console.log('historyColumn: ',historyColumn.current)
          // console.log('historyColumnPrev: ', historyColumnPrev.current)
          for(let j=0; j<trajTypeLength; j++){
            // console.log('history[historyColumn]: ',history.current[historyColumn.current])
            if(history.current[historyColumn.current] == null) {
              history.current[historyColumn.current] = []
            }
            history.current[historyColumn.current][j] = []
          }
          // console.log('history[historyColumnPrev]: ',history.current[historyColumnPrev.current])
        }
        if(historyColumnPrev.current>=0){
          let history_prev_data = history.current[historyColumnPrev.current][mainIndex]
          // console.log('history_prev_data: ',history_prev_data)
          const prevHistoryLen =  history_prev_data.length 
          prevAreasCounter.current = prevHistoryLen - 1
          for(let i =0; i< prevHistoryLen; i++){
            if(history_prev_data[i] != null){
              if(history_prev_data[i][0].x >= accTime.current- time_range+100){
                prevAreasCounter.current = i-1 < 0 ? 0: i-1
                break
              }
            }
          }
          const prevAreaLen = history_prev_data[prevAreasCounter.current]!=null? history_prev_data[prevAreasCounter.current].length : 0
          for(let i=0; i<prevAreaLen; i++){
            if( history_prev_data[prevAreasCounter.current][i].x >= accTime.current- time_range+100){
              for(let j=0; j<trajTypeLength; j++){
                if(history.current[historyColumnPrev.current][j] == null){history.current[historyColumnPrev.current][j] = []}
                prevAreaData.current[j] =history.current[historyColumnPrev.current][j][prevAreasCounter.current] != null ? history.current[historyColumnPrev.current][j][prevAreasCounter.current].slice(i) : []
              }
              break;
            }
          }
        }
        return res
      })
    }
  }, [state.hemodynamicSeries]);


  return (
    <Box position ='relative' width={1} height={1}>
      <PlowFlowAxis xlims = {xlimsRef.current} ylims={ylimsRef.current} margin={margin}/>
      {
        historyColumnPrev.current >= 0 && (
            history.current[historyColumnPrev.current].map((x,ind) =>x.map((data,index)=> (
              (index > prevAreasCounter.current)  && <PlotFlowLine key={index} data={data} xlims = {xlimsRefPrev.current} ylims={ylimsRef.current} color={ind} margin={margin}/>
            )))
        )
      } 
      {
          history.current[historyColumn.current].map((x,ind)=>x.map((data,index)=>
            <PlotFlowLine key={index} data={data} xlims = {xlimsRef.current} ylims={ylimsRef.current} color={ind} margin={margin}/>
          ))
      }
      {
        prevAreaData.current.map((data,index) =>(
          <PlotFlowLine data ={data} xlims = {xlimsRefPrev.current} ylims={ylimsRef.current} color={index} margin={margin}/>
        ))
      }
     
      <Box position='absolute'  width={1} height={1}>
        <FlexibleXYPlot xDomain = {xlimsRef.current} yDomain={ylimsRef.current} margin={margin}>
          {trajectory.map((traj,index) => 
            <LineSeries data={traj} opacity={0.6} color={palette[index]}/>   
          )}
        </FlexibleXYPlot>
      </Box>
    </Box>
  )
}

// const slice_trajectory = (trajectory, time_range = 8000) =>{
//   const last_time = trajectory[trajectory.length-1]['x']
//   const split_time = last_time - last_time % time_range
//   const start_time = last_time - time_range

//   if(trajectory.length < 1 || last_time <= time_range){
//     return [trajectory, trajectory, []]
//   }else{
//     const firstArray = []
//     const secondArray = []
//     const res = []
//     const tl = trajectory.length
//     for(let i=0;i<tl;i++){
//       if(trajectory[i]['x'] > start_time){
//         if(0 < i && i< tl-1){
//           if(trajectory[i-1]['x'] != trajectory[i]['x']  || trajectory[i]['x'] != trajectory[i+1]['x']){
//             res.push(trajectory[i])
//           }
//         }else{
//           res.push(trajectory[i])
//         }
//       }
      
//       if(start_time+200 < trajectory[i]['x'] && trajectory[i]['x'] <= split_time){
//         firstArray.push(
//           {
//             x:trajectory[i]['x'] % time_range, 
//             y:trajectory[i]['y']
//           }
//         )
//       }
//       if(split_time < trajectory[i]['x'] ){
//         secondArray.push(
//           {
//             x:trajectory[i]['x'] % time_range, 
//             y:trajectory[i]['y']            
//           }
//         )
//       }
//     }
//     return [res, firstArray, secondArray]
//   }
// }


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
