import React, {useState, useRef,useLayoutEffect} from 'react';
import rk  from '../utils/RungeKutta/Rk4'
import pv_func, {e} from '../utils/pvFunc'
import mutationTimings from '../settings/mutationTimings'
import {UPDATE_SERIES, UPDATE_PROPS, ShIFT_PROP_MUTATION} from '../actions'
import {IconButton} from '@material-ui/core'

import {PlayArrow,Pause} from '@material-ui/icons';

import {
  useDispatch,
  useTrackedState,
} from 'reactive-react-redux';


const Engine = props =>{
  const state = useTrackedState();
  const dispatch = useDispatch();

  const [speed, setSpeed] = useState(0.5);

  const rafIdRef = useRef(new Set())
  const activeCallbacks = useRef(new Set())
  const endLoopFunc = useRef(null)
  
  const maxAVdelay  = useRef(160)

  const isTiming = (hemodynamicProp) => {
    const cvProps = state.hemodynamicProps
    const maybeChamber =  hemodynamicProp.slice(0,2)
    let chamber = ['LV','LA','RA','RV'].includes(maybeChamber) ?  maybeChamber : 'LV'
    if(hemodynamicProp === 'HR'){
      chamber = 'LA'
    }
    const [Tmax_,tau_,AV_delay_]  = ['Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
    const [Tmax,tau,AV_delay, HR] = [cvProps[Tmax_], cvProps[tau_], cvProps[AV_delay_], cvProps['HR']]
    const Timing = mutationTimings[hemodynamicProp]
    return t =>{
      switch (Timing){
        case 'EndDiastolic':
          return e(t-AV_delay,Tmax,tau,HR) < 0.001
        case 'EndSystolic':
          return e(t-AV_delay,Tmax,tau,HR) > 0.999
        case 'HR':
          return t < maxAVdelay.current + 15
        default:
          return true
      }
    }
  }

  const mainCallback = (timestamp,prevTimestamp, payload) => {
    let {data, time, logger} = payload
    if(data.length === 0){
      cancelAnimationFrame(rafId)
      deactivateCallbacks(mainCallback)
    }

    let delta = (timestamp -  prevTimestamp) * speed 
    const new_logger = []
    let flag = true
    while (delta > 0 ){
      let dt = delta >= 2 ? 2 : delta
      time = time % (60000/state.hemodynamicProps.HR)
      data = flag ? rk(pv_func,state.hemodynamicProps,new_logger)(data,time + maxAVdelay.current,dt): rk(pv_func,state.hemodynamicProps,null)(data,time + maxAVdelay.current,dt)
      time += dt
      delta -= dt
      flag = !flag
    }
    dispatch({
      type: UPDATE_SERIES,
      data,
      time,
      logger: new_logger
    })
    if(state.hemodynamicPropsMutations.length !== 0){
      const propMutation = state.hemodynamicPropsMutations[0]
      const propKey = Object.keys(propMutation)[0]
      if(propKey==='Volume'){
        let [Qvs, ...rest]  = data
        Qvs +=  propMutation[propKey] - data.reduce((a,x)=>a+=x,0)
        dispatch({
          type: UPDATE_SERIES,
          data: [Qvs, ...rest],
          time,
          logger: []
        })
        dispatch({
          type: ShIFT_PROP_MUTATION
        })
        deactivateCallbacks(mainCallback)  
      }
      if(isTiming(propKey)(time)){
        dispatch({
            type: UPDATE_PROPS,
            propsUpdated: propMutation,
        })
        dispatch({
            type: ShIFT_PROP_MUTATION
        })
        deactivateCallbacks(mainCallback)      
      }
    }
    return {data, time, logger: new_logger}
  }

  const activateCallbacks = callback =>{
    const isLoopNotStarted = activeCallbacks.current.size === 0
    console.log('isLoopNotStarted: ',isLoopNotStarted)
    activeCallbacks.current.add(callback)
    if(isLoopNotStarted){
      let payload =state.hemodynamicSeries
      console.log('payload in activateCallbacks: ',payload)
      let prevTimestamp = performance.now()
      let rafId = null
      const loop = timestamp =>{
        activeCallbacks.current.forEach(f => {
          payload = f(timestamp,prevTimestamp,payload)}
        )
        prevTimestamp = timestamp
        rafIdRef.current.delete(rafId)
        if(speed !=0){
          rafId = requestAnimationFrame(loop)
        }
        rafIdRef.current.add(rafId)
      }
      loop()
      endLoopFunc.current =  () => {
        if(rafId != null){
          cancelAnimationFrame(rafId)
        }
      }
    }
  }
  const deactivateCallbacks = callback => {
    activeCallbacks.current.delete(callback)
    console.log('rest activate callbacks: ', activeCallbacks.current.size)
    if(activeCallbacks.current ===0 && endLoopFunc.current != null ){
      endLoopFunc.current()
      endLoopFunc.current = null
    }
    console.log('all raf is about to be canceled....: ',Array.from(rafIdRef.current) )
    Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
    rafIdRef.current.clear()
  }

  useLayoutEffect(()=>{
    maxAVdelay.current = Math.max(state.hemodynamicProps.LV_AV_delay, state.hemodynamicProps.LA_AV_delay, state.hemodynamicProps.RV_AV_delay, state.hemodynamicProps.RA_AV_delay)
    activateCallbacks(mainCallback)
    return ()=>deactivateCallbacks(mainCallback)
  }, [speed, state.hemodynamicPropsMutations])

  if(speed!=0){
    return( 
      <IconButton style={{color:'inherit'}}
        onClick={()=>{
            Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
                  activeCallbacks.current.clear()
                  rafIdRef.current.clear()
                  setSpeed(0)
          }}>
        <Pause fontSize='large'/>
      </IconButton>
      )
  }else{
    return( 
      <IconButton style={{color:'inherit'}} onClick={()=>{ setSpeed(0.5) }}>
        <PlayArrow fontSize='large'/>
      </IconButton>
    )
  }
  // return (
  //       <Switch
  //         checked={speed!=0}
  //         onChange={()=>{
  //           if(speed!=0){
  //             Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
  //             activeCallbacks.current.clear()
  //             rafIdRef.current.clear()
  //             setSpeed(0)
  //           }else{
  //             setSpeed(0.2)
  //           }
  //         }}/>
        
  // )
}

export default Engine