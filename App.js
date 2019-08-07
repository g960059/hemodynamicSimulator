import React, {useState,useEffect,useReducer, useRef,useLayoutEffect} from 'react';
import { makeStyles,createMuiTheme } from '@material-ui/core/styles';
import rk  from './src/utils/RungeKutta/Rk4'
import pv_func, {e} from './src/utils/pvFunc'
import {Paper,Grid,Switch} from '@material-ui/core'
import Layout from './src/components/Layout'
import DefaultPrperty from './src/settings/DefaultProperty'
import { ThemeProvider } from '@material-ui/styles';

import reducer from './src/reducers'
import AppContext from './src/contexts/AppContexts'
import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES, UPDATE_PROPS, ShIFT_PROP_MUTATION} from './src/actions'

import PVBuilder from './src/components/PVBuilder'
import PropsController from './src/components/PropsController'

import mutationTimings from './src/settings/mutationTimings'

const theme = createMuiTheme({
  mixins: {
    toolbar: {
      minHeight: 42,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 36
      },
      '@media (min-width:600px)':{
        minHeight: 48
      }
    }
  },
});

const useStyles= makeStyles(theme =>({
  paper: {
    padding: theme.spacing(2),
  },
  controllBar: {
    height: `calc(95vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: 'scroll',
    border: 'solid 1px gray'
  }
}))

const App =() =>{
  const classes = useStyles()
  const initial_data = [553.7481008424338,126.20311020412922,311.9197946890578,115.43028920790883,144.94757387269436,52.746795685900445,130.9167938422945,41.513788938769075,7.027296746079915,15.54645597073036]
  const initial_time = 3103.4394
  const initialState = {
    hemodynamicSeries:{
      data: [initial_data],
      time: [initial_time]
    }, 
    hemodynamicProps: DefaultPrperty,
    hemodynamicPropsMutations: []
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const [speed, setSpeed] = useState(0.2);
  
  const rafIdRef = useRef(new Set())
  const activeCallbacks = useRef(new Set())
  const endLoopFunc = useRef(null)
  
  // [{'LV_Ees': 3.1}] → End Diastolic
  // ['EndSystolic]
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
          return e(t-AV_delay,Tmax,tau,HR) > 0.97
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
    console.log('INSIDE main callback payload: ',  payload)
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
    console.log({data:dataInFrame, time:timeInFrame})
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
  }, [state.hemodynamicPropsMutations, speed])


  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{state,dispatch}}>
        <Layout title='PV loops' >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper>
                  <p>{[...rafIdRef.current].reduce((a,b)=>a+' '+b,'')}</p>
                  <p>{ activeCallbacks.current.size }</p>
                  
                <Switch
                    checked={speed!=0}
                    onChange={()=>{
                      if(speed!=0){
                        Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
                        activeCallbacks.current.clear()
                        setSpeed(0)
                      }else{
                        setSpeed(0.2)
                      }
                    }}
                  />
                  <p>{activeCallbacks.current.length}</p>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <PropsController/>
              </Grid>
              <Grid item xs={9}>
                <Paper>
                  <PVBuilder chamber='LV'/>
                </Paper>
              </Grid> 
            </Grid>
        </Layout>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default App


    // let propMutations = [...state.hemodynamicPropsMutations]
    // let propMutation =  propMutations.shift() || null
    // let propMutationKey = propMutation !== null ? Object.keys(propMutation)[0] : null
    // console.log('state.hemodynamicPropsMutations: ', state.hemodynamicPropsMutations)

    // if(speed === 0 ){
    //   return
    // };


      // for(raf of rafIdRef.current.values()){
      //   cancelAnimationFrame(raf)
      // }
      // rafIdRef.current.clear()
      // cancelAnimationFrame(rafIdRef.current)
      // rafIdRef.current = null
    



// useEffect(() => {
//   activateCallback(callback);
//   return () => deactivateCallback(callback);
// });
// const activeCallbacks = new Set()
// const cancelLoop= null
// const activateCallback = callback =>{
//   const isPrevCallback = activeCallbacks.seize > 0
//   activeCallbacks.add(callback) 
//   if(isPrevCallback){
//     let rafId = null
//     const loop = timestamp =>{
//       activeCallbacks.forEach(f => f(timestamp));
//       rafId = requestAnimationFrame(loop)
//     }
//     loop()
//     cancelLoop = () => {
//       if(rafId!=null){
//         cancelAnimationFrame(rafId)
//       }
//     }
//   }
// }
// const deactivateCallbacks = callback =>{
//   activeCallbacks.delete(callback)
//   if (activeCallbacks.size == 0 && cancelLoop != null){
//     cancelLoop()
//     cancelLoop = null
//   }
// }


  // const x0 = [533.793, 134.896, 313.649, 105.057, 135.348, 70.897, 112.566, 70.501, 7.512, 15.781]
  // const [series, setSeries] = useState([x0]);
  // const [times, setTimes] = useState([0]);
  // const [intervalTime, setIntervalTime] = useState(20);

    // const dt = 2

  // useEffect(()=>{
  //   console.log('state',state)
  //   console.log('CALC_SERIES',CALC_SERIES)
  //   for(let i=0; i<5; i++){
  //     dispatch({
  //       type: CALC_SERIES,
  //       hemodynamicProps: state.hemodynamicProps,
  //       dt
  //     })
  //   }
  // },[])
  // useEffect(() => {
  //   // let x = series[series.length-1]
  //   // let t = times[times.length-1]
  //   const interval = setInterval(()=>{
  //     if(intervalTime !== null){
  //       dispatch({
  //         type: 
  //       })
  //     }
  //     for(let i=0; i<5; i++){
  //       x = rk(pv_func,CVProps)(x,t,dt)
  //       t = t+dt
  //     }
  //     setTimes(ts =>[...ts,t+dt])
  //     setSeries(series => [...series,x])
  //   }, intervalTime)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [intervalTime, CVProps]); 




    {/* <ThemeProvider theme={theme}>
      <ModelPropertyContext.Provider value={{CVProps, setCVProps}}>
        <Layout title='PV loops' drawer={<Drawer/>}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <button onClick={()=>{intervalTime == 100 ? setIntervalTime(100000): setIntervalTime(100)}}>toggle</button>  
                 <SimpleLine series = {[{'data':PV_Loop('LV')(times,series)}]}/>  
                 <Chart series={[{'data':PV_Loop('LV')(times,series)}]} options={{xaxis :{type:'numeric',tickAmount:4}, yaxis:{type:'numeric',tickAmount:4,decimalsInFloat:0}}} /> 
               </Paper>
            </Grid> 
             <Grid item xs={12}>
              <Paper>
                <SimpleLine data = {calcPV('LV',CVProps)(times,series)}/>
              </Paper>
            </Grid> 
             <Grid item xs={12}>
              <Paper>
                <PV_LV time={times[times.length-1]} data={series[series.length-1]} cv_props={CVProps}/>
                {
                  (times[times.length-1]%1000 > 980 || times[times.length-1]%1000 < 20 ) ? console.log(times[times.length-1], series[series.length-1]) : null
                }
              </Paper>
            </Grid> 
             <Grid item xs={6}>
              <Paper>
                <SimpleLine data = {calcPV('RV')(times,series)}/>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <SimpleLine data = {calcPV('LA')(times,series)}/>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <SimpleLine data = {calcPV('RA')(times,series)}/>
              </Paper>
            </Grid>           
          </Grid>
        </Layout>
      </ModelPropertyContext.Provider>
    </ThemeProvider>  */}


  // const [CVProps, setCVProps] = useState(DefaultPrperty);


