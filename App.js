import React, {useState,useEffect,useReducer, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SimpleLine from './src/components/SimpleLine'
import rk,{sample_func} from './src/utils/RungeKutta/Rk4'
import pv_func, {u_P} from './src/utils/pvFunc'
import Paper from '@material-ui/core/Paper'
// import Box from '@material-ui/core/Box'
import Layout from './src/components/Layout'
import Drawer from './src/components/Drawer'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch';
// import CssBaseline from '@material-ui/core/CssBaseline'
import DefaultPrperty from './src/utils/DefaultProperty'
// import ModelPropertyContext from './ModelProperty/ModelPropertyContext'
import calcPV, {PV_LV} from './src/components/PVplot'
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import reducer from './src/reducers'
import AppContext from './src/contexts/AppContexts'
import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES} from './src/actions'

import PVBuilder from './src/components/PVBuilder'

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
  // const [CVProps, setCVProps] = useState(DefaultPrperty);

  const initial_data = [533.793, 134.896, 313.649, 105.057, 135.348, 70.897, 112.566, 70.501, 7.512, 15.781]
  const initialState = {
    hemodynamicSeries:{
      data: [initial_data],
      time: [0]
    }, 
    hemodynamicProps: DefaultPrperty
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  // const x0 = [533.793, 134.896, 313.649, 105.057, 135.348, 70.897, 112.566, 70.501, 7.512, 15.781]
  // const [series, setSeries] = useState([x0]);
  // const [times, setTimes] = useState([0]);
  // const [intervalTime, setIntervalTime] = useState(20);
  const [speed, setSpeed] = useState(0.2);
  const rafIdRef = useRef(null)
  // const dt = 2
  
  useEffect(()=>{
    let rafId = null
    let prevTimestamp = performance.now()
    let {data, time} = state.hemodynamicSeries
    let data_ = data[data.length-1]
    let time_ = time[time.length-1]
    console.log('useEffect is called!!')
    console.log(speed)
    if(speed === 0 ){
      console.log('speed is 0!')
      return
    };
    const loop = timestamp => {
      let delta = (timestamp -  prevTimestamp) * speed
      // console.log('time_:', time_, 'data_: ',data_)
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
      dispatch({
        type: UPDATE_SERIES,
        data: dataInFrame,
        time: timeInFrame
      })
      // console.log('time: ', timeInFrame, 'data: ',dataInFrame)
      prevTimestamp = timestamp
      rafIdRef.current = requestAnimationFrame(loop)
    }
    loop()
  
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [state.hemodynamicProps, speed])

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{state,dispatch}}>
        <Layout title='PV loops' >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper>
                <Switch
                    checked={speed!=0}
                    onChange={()=>{
                      if(speed!=0){
                        cancelAnimationFrame(rafIdRef.current);
                        rafIdRef.current = null
                        setSpeed(0)
                      }else{
                        setSpeed(0.5)
                      }
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
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
