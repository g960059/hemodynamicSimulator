import React, {useState, useRef,useLayoutEffect} from 'react';
import rk  from '../utils/RungeKutta/Rk4'
import pv_func, {e} from '../utils/pvFunc'
import {Switch,} from '@material-ui/core'
import mutationTimings from '../settings/mutationTimings'
import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES, UPDATE_PROPS, ShIFT_PROP_MUTATION} from '../actions'

import {
  useDispatch,
  useTrackedState,
} from 'reactive-react-redux';

const Engine = props =>{
  const state = useTrackedState();
  const dispatch = useDispatch();

  const [speed, setSpeed] = useState(0.2);

  const rafIdRef = useRef(new Set())
  const activeCallbacks = useRef(new Set())
  const endLoopFunc = useRef(null)
  
  const isTiming = (hemodynamicProp) => {
    const cvProps = state.hemodynamicProps
    const maybeChamber =  hemodynamicProp.slice(0,2)
    const chamber = ['LV','LA','RA','RV'].includes(maybeChamber) ?  maybeChamber : 'LV'
    const [Tmax_,tau_,AV_delay_]  = ['Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
    const [Tmax,tau,AV_delay, HR] = [cvProps[Tmax_], cvProps[tau_], cvProps[AV_delay_], cvProps['HR']]
    const Timing = mutationTimings[hemodynamicProp]
    return t =>{
      switch (Timing){
        case 'EndDiastolic':
          return e(t-AV_delay,Tmax,tau,HR) < 0.001
        case 'EndSystolic':
          return e(t-AV_delay,Tmax,tau,HR) > 0.99
        default:
          return true
      }
    }
  }

  const mainCallback = (timestamp,prevTimestamp, payload) => {
    let {data, time} = payload
    if(data.length === 0){
      cancelAnimationFrame(rafId)
      deactivateCallbacks(mainCallback)
    }
    let data_ = data[data.length-1]
    let time_ = time[time.length-1]
    let delta = (timestamp -  prevTimestamp) * speed 
    const dataInFrame = []
    const timeInFrame = []
    while (delta > 0 ){
      let dt = delta >= 2 ? 2 : delta
      data_ = rk(pv_func,state.hemodynamicProps)(data_,time_,dt)
      time_ += dt
      delta -= dt
      dataInFrame.push(data_)
      timeInFrame.push(time_)
    }
    if(dataInFrame.length > 0){
      dispatch({
        type: UPDATE_SERIES,
        data: dataInFrame,
        time: timeInFrame
      })
    }
    if(state.hemodynamicPropsMutations.length !== 0){
      const propMutation = state.hemodynamicPropsMutations[0]
      if(isTiming(Object.keys(propMutation)[0])(time_)){
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
    if(dataInFrame.length > 0){
      return {data:dataInFrame, time:timeInFrame}
    }else{
      return payload
    }
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
    activateCallbacks(mainCallback)
    return ()=>deactivateCallbacks(mainCallback)
  }, [speed, state.hemodynamicPropsMutations])

  return (
        <Switch
          checked={speed!=0}
          onChange={()=>{
            if(speed!=0){
              Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
              activeCallbacks.current.clear()
              rafIdRef.current.clear()
              setSpeed(0)
            }else{
              setSpeed(0.2)
            }
          }}/>
  )
}

export default Engine