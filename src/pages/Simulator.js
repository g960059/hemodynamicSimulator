import React, {useState,useEffect} from 'react';
import { makeStyles,createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {Grid, Box, Typography, Checkbox,Hidden, AppBar, Toolbar, CssBaseline, Divider, Link, Button, Fade, FormLabel, FormControl, FormGroup, FormControlLabel} from '@material-ui/core'
import {Add} from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/styles';

import reducer from '../reducers'
import PropsController from '../components/PropsController'

import Engine from '../components/Engine'
import OutputPanel from '../components/OutputPanel'
import TimeSeriesBox from '../components/TimeSeriesBox/TimeSeriesBox'
import PVBox from '../components/PVBox/PVBox'

import { createStore } from 'redux';
import { Provider} from 'reactive-react-redux';


let theme = createMuiTheme({
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
theme = responsiveFontSizes(theme);
theme.shadows[1] = '0px 1px 5px 1px rgba(0,0,0,0.1)'

const useStyles= makeStyles(theme =>({
  toolbar: {
    height: `calc(${theme.mixins.toolbar.minHeight}px)`
  },
  content: {
    flexGrow: 1
  },
  sideContainer: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    },
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.default,
    // borderRight: '1px solid #e6e6e9'
  },
  mainContainer: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    },
    overflowY: 'scroll',
  },
  title: {
    flexGrow: 1,
  },
  addBox: {
    textTransform:'inherit', 
    color:'#bdbdbd', 
  },
  titleStyle:{
    fontFamily: ' Meiryo',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3)
  },
  gridOrder1:{
    [theme.breakpoints.down('xs')]: {
      order: 1,
    },
  },
  gridOrder2:{
    [theme.breakpoints.down('xs')]: {
      order: 2,
    },
  },
  gridOrder3:{
    [theme.breakpoints.down('xs')]: {
      order: 3,
    },
  }
}))

const store = createStore(reducer)

const Simulator =() =>{
  const classes = useStyles()
  const matches = useMediaQuery(theme.breakpoints.up('sm'),{noSsr: true});
  const [newItems, setNewItems] = useState({'LA': false,'LV': false,'RA': false,'RV': false,'Imv': false ,'Iasp': false ,'Itv': false ,'Iapp': false ,'AoP': false ,'PAP': false ,'Plv': false ,'Pla': false ,'Prv': false ,'Pra': false});
  const {LA, LV, RA, RV, Imv, Iasp, Itv, Iapp, AoP, PAP, Plv, Pla, Prv, Pra} = newItems

  const [plotBoxes, setPlotBoxes] = useState([]);
  const [plotPVBoxes, setPlotPVBoxes] = useState([]);

  const [visible, setVisible] = useState(false);

  const handleChangeItem = name => e => {
    setNewItems(prev => ({...prev, [name]:e.target.checked}))
  }
  const handleChangeItemExclusive = name => e => {
    setNewItems(prev => {
      const newState  = {...prev}
      Object.keys(prev).forEach(k=>{newState[k]=false})
      return {...newState, [name]:e.target.checked}
    })
  }
  const removePlotBox = (index, isPV=false)=> e => {
    if(isPV){
      setPlotPVBoxes(prev=>{
        const newBoxes = [...prev]
        newBoxes[index]= null; 
        return newBoxes
      })
    }else{
      setPlotBoxes(prev=>{
        const newBoxes = [...prev]
        newBoxes[index]= null; 
        return newBoxes
      })
    }
  }
  const addPlotBox = e =>{
    const initialKeys = []
    Object.keys(newItems).forEach(k =>{if(newItems[k]){initialKeys.push(k)}})
    if(initialKeys.length==0){setVisible(false); return}
    if(['LA','LV','RA','RV'].some(x=>x==initialKeys[0])){
      const ind = plotPVBoxes.length
      setPlotPVBoxes(prev=>[...prev, <PVBox chamber={initialKeys[0]} remove={removePlotBox(ind,true)}/>])
    }else{
      const ind = plotBoxes.length
      setPlotBoxes(prev=>[...prev,<TimeSeriesBox initialKeys={initialKeys} remove={removePlotBox(ind,false)}/>])
    }
    setNewItems({'LA': false,'LV': false,'RA': false,'RV': false,'Imv': false ,'Iasp': false ,'Itv': false ,'Iapp': false ,'AoP': false ,'PAP': false ,'Plv': false ,'Pla': false ,'Prv': false ,'Pra': false})
    setVisible(false)
  }
  useEffect(() => {
    if(matches){
      setPlotPVBoxes([<PVBox chamber={'LA'} remove={removePlotBox(0,true)}/>,<PVBox chamber={'LV'} remove={removePlotBox(1,true)}/>])
      setPlotBoxes([<TimeSeriesBox initialKeys={['AoP','Pla','Plv']} remove={removePlotBox(0,false)}/>])
    }else{
      setPlotPVBoxes([<PVBox chamber={'LV'} remove={removePlotBox(0,true)}/>])
      setPlotBoxes([<TimeSeriesBox initialKeys={['AoP','Plv']} remove={removePlotBox(0,false)}/>])      
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Box display='flex' position='relative'>
          <CssBaseline/>
          <AppBar position='fixed' elevation={0} color ={matches ? "inherit": 'primary'} style={{borderBottom:"1px solid #e0e0e0"}}>
            <Toolbar disableGutters={true} variant="dense">
              <Grid container>
                <Hidden xsDown>
                  <Grid item sm={3}>
                    <Box display="flex" justifyContent="flex-end" alignItems="center" height={1}>
                      <Box flexGrow={1} display="flex" height={1} justifyContent="center" alignItems="center" mr={1}>
                        <Link variant="h6" href="/" color ="inherit" underline='none' className={classes.titleStyle}>Cardiomator</Link>
                      </Box>
                      <Box width='1px' height={1}>
                        <Divider orientation="vertical" />
                      </Box>
                    </Box>
                  </Grid>
                </Hidden>
                <Grid item xs={12} sm={9}>
                  <Box display='flex' justifyContent="flex-start" alignItems="center">
                    <Box display={{ xs: 'flex', sm: 'none' }} justifyContent="flex-start" alignItems="center" mr={1} flexGrow={1}>
                        <Link variant="h6" href="/" color ="inherit" underline='none' className={classes.titleStyle}>Cardiomator</Link>
                    </Box>
                    <Box color={matches ? 'grey.600':'white'} px={4}>
                      <Engine/>
                    </Box>     
                  </Box>
                  
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Box className={classes.content} bgcolor="background.paper">
            <div className={classes.toolbar}/>
            <Grid container>
              <Grid item xs={12} sm={3}  className={classes.gridOrder3}> 
                <Box className={classes.sideContainer} >             
                  <PropsController/>
                </Box>
              </Grid>
              <Grid item xs={12} sm={7}  className={classes.gridOrder2}>
                <Box className={classes.mainContainer}>
                  <Grid container>
                    { plotPVBoxes.map(el => el) }
                    { plotBoxes.map(el => el) }
                    <Grid item xs={12}>
                      <Box mx={5} my={3} display={visible? 'none': 'flex'}>
                        <Button fullWidth variant='outlined' className={classes.addBox} onClick={()=>{setVisible(prev=>!prev)}} style={{border:'none'}}>
                          <Box py={2} alignItems="center" >
                            <Add fontSize='large' style={{marginRight:'8px'}}/>
                            <Typography variant='h6'>New Plotting Area</Typography>    
                          </Box>                            
                        </Button>
                      </Box>
                      <Fade in={visible} display={visible? 'block': 'none'}>
                        <Box m={2} borderRadius="borderRadius" border={1} color='grey.800' style={{borderColor:'#e0e0e0'}} >
                          <Grid container>
                            <Grid item xs={6} sm={4}>
                              <Box my={2} display='flex' justifyContent="center">
                                <FormControl disabled = {[Imv, Iasp, Itv, Iapp, AoP, PAP, Plv, Pla, Prv, Pra].some(x=>x)}>
                                  <FormLabel>PV Loop</FormLabel>
                                  <FormGroup>
                                    <FormControlLabel 
                                      control= {<Checkbox color='primary' checked={LA} onChange={handleChangeItemExclusive('LA')}/>}
                                      label = 'Left Atrium'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={LV} onChange={handleChangeItemExclusive('LV')}/>}
                                      label = 'Left Ventricle'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={RA} onChange={handleChangeItemExclusive('RA')}/>}
                                      label = 'Right Atrium'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={RV} onChange={handleChangeItemExclusive('RV')}/>}
                                      label = 'Right Ventricle'
                                    />                                        
                                  </FormGroup>
                                </FormControl>
                              </Box>
                              <Hidden smUp>
                                <Box my={2} display='flex' justifyContent="center" pl={1}>
                                  <FormControl disabled ={[LA, LV, RA, RV, AoP, PAP, Plv, Pla, Prv, Pra].some(x=>x)}>                              
                                    <FormLabel>Flow</FormLabel>
                                    <FormGroup>
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Imv} onChange={handleChangeItem('Imv')}/>}
                                        label = 'Mitral Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Iasp} onChange={handleChangeItem('Iasp')}/>}
                                        label = 'Aortic Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Itv} onChange={handleChangeItem('Itv')}/>}
                                        label = 'Tricuspid Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Iapp} onChange={handleChangeItem('Iapp')}/>}
                                        label = 'Pulmonary Valve'
                                      />                                        
                                    </FormGroup>
                                  </FormControl>
                                </Box>                                
                              </Hidden>                              
                            </Grid>
                            <Hidden xsDown>
                              <Grid item sm={4}>
                                <Box my={2} mx={1} display='flex' justifyContent="center">
                                  <FormControl disabled ={[LA, LV, RA, RV, AoP, PAP, Plv, Pla, Prv, Pra].some(x=>x)}>                              
                                    <FormLabel>Flow</FormLabel>
                                    <FormGroup>
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Imv} onChange={handleChangeItem('Imv')}/>}
                                        label = 'Mitral Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Iasp} onChange={handleChangeItem('Iasp')}/>}
                                        label = 'Aortic Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Itv} onChange={handleChangeItem('Itv')}/>}
                                        label = 'Tricuspid Valve'
                                      />
                                      <FormControlLabel
                                        control= {<Checkbox color='primary' checked={Iapp} onChange={handleChangeItem('Iapp')}/>}
                                        label = 'Pulmonary Valve'
                                      />                                        
                                    </FormGroup>
                                  </FormControl>
                                </Box>
                              </Grid>
                            </Hidden>
                            <Grid item xs={6} sm={4}>
                              <Box my={2} display='flex' justifyContent="center">
                                <FormControl disabled={[LA, LV, RA, RV, Imv, Iasp, Itv, Iapp].some(x=>x)}>
                                  <FormLabel>Pressure</FormLabel>
                                  <FormGroup>
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={AoP} onChange={handleChangeItem('AoP')}/>}
                                      label = 'Aorta'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={PAP} onChange={handleChangeItem('PAP')}/>}
                                      label = 'Pulmonary'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={Plv} onChange={handleChangeItem('Plv')}/>}
                                      label = 'Left Ventricle'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={Pla} onChange={handleChangeItem('Pla')}/>}
                                      label = 'Left Atrium'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={Prv} onChange={handleChangeItem('Prv')}/>}
                                      label = 'Right Ventricle'
                                    />
                                    <FormControlLabel
                                      control= {<Checkbox color='primary' checked={Pra} onChange={handleChangeItem('Pra')}/>}
                                      label = 'Right Atrium'
                                    />                                        
                                  </FormGroup>
                                </FormControl>
                              </Box>
                            </Grid>
                          </Grid>
                          <Divider/>
                          <Box display='flex' justifyContent="flex-end" alignItems="center" m={1}>
                            <Button color='primary' variant='text' onClick={()=>{setVisible(prev=>!prev)}}>cancel</Button>
                            <Button color='primary' variant='text' onClick={addPlotBox}>ok</Button>                                    
                          </Box>
                        </Box>
                      </Fade>
                    </Grid>                    
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} sm={2} className={classes.gridOrder1}>
                <Box className={classes.sideContainer}  color='grey.600' >
                  <Box pt={1} height={1} bgcolor='background.paper' style={{marginLeft:'3px'}}>
                    <OutputPanel/>
                    <Hidden smUp>
                      <Divider light variant='middle'></Divider>
                    </Hidden>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Provider>
    </ThemeProvider>
  )
}

export default Simulator




  // const state = store.getState()
  // const dispatch = store.dispatch

  // const [speed, setSpeed] = useState(0.2);
  
  // const rafIdRef = useRef(new Set())
  // const activeCallbacks = useRef(new Set())
  // const endLoopFunc = useRef(null)
  
  // const isTiming = (hemodynamicProp) => {
  //   const cvProps = state.hemodynamicProps
  //   const maybeChamber =  hemodynamicProp.slice(0,2)
  //   const chamber = ['LV','LA','RA','RV'].includes(maybeChamber) ?  maybeChamber : 'LV'
  //   const [Tmax_,tau_,AV_delay_]  = ['Tmax', 'tau', 'AV_delay'].map(x=>chamber+'_'+x)
  //   const [Tmax,tau,AV_delay, HR] = [cvProps[Tmax_], cvProps[tau_], cvProps[AV_delay_], cvProps['HR']]
  //   const Timing = mutationTimings[hemodynamicProp]
  //   return t =>{
  //     switch (Timing){
  //       case 'EndDiastolic':
  //         return e(t-AV_delay,Tmax,tau,HR) < 0.001
  //       case 'EndSystolic':
  //         return e(t-AV_delay,Tmax,tau,HR) > 0.97
  //       default:
  //         return true
  //     }
  //   }
  // }

  // const mainCallback = (timestamp,prevTimestamp, payload) => {
  //   let {data, time} = payload
  //   if(data.length === 0){
  //     cancelAnimationFrame(rafId)
  //     deactivateCallbacks(mainCallback)
  //   }
  //   let data_ = data[data.length-1]
  //   let time_ = time[time.length-1]
  //   let delta = (timestamp -  prevTimestamp) * speed 
  //   const dataInFrame = []
  //   const timeInFrame = []
  //   while (delta > 0 ){
  //     let dt = delta >= 2 ? 2 : delta
  //     data_ = rk(pv_func,state.hemodynamicProps)(data_,time_,dt)
  //     time_ += dt
  //     delta -= dt
  //     dataInFrame.push(data_)
  //     timeInFrame.push(time_)
  //   }
  //   if(dataInFrame.length > 0){
  //     dispatch({
  //       type: UPDATE_SERIES,
  //       data: dataInFrame,
  //       time: timeInFrame
  //     })
  //   }
  //   if(state.hemodynamicPropsMutations.length !== 0){
  //     const propMutation = state.hemodynamicPropsMutations[0]
  //     if(isTiming(Object.keys(propMutation)[0])(time_)){
  //       dispatch({
  //           type: UPDATE_PROPS,
  //           propsUpdated: propMutation,
  //       })
  //       dispatch({
  //           type: ShIFT_PROP_MUTATION
  //       })
  //       // deactivateCallbacks(mainCallback)      
  //     }
  //   }
  //   if(dataInFrame.length > 0){
  //     return {data:dataInFrame, time:timeInFrame}
  //   }else{
  //     return payload
  //   }
  // }

  // const activateCallbacks = callback =>{
  //   const isLoopNotStarted = activeCallbacks.current.size === 0
  //   console.log('isLoopNotStarted: ',isLoopNotStarted)
  //   activeCallbacks.current.add(callback)
  //   if(isLoopNotStarted){
  //     let payload =state.hemodynamicSeries
  //     console.log('payload in activateCallbacks: ',payload)
  //     let prevTimestamp = performance.now()
  //     let rafId = null
  //     const loop = timestamp =>{
  //       activeCallbacks.current.forEach(f => {
  //         payload = f(timestamp,prevTimestamp,payload)}
  //       )
  //       prevTimestamp = timestamp
  //       rafIdRef.current.delete(rafId)
  //       if(speed !=0){
  //         rafId = requestAnimationFrame(loop)
  //       }
  //       rafIdRef.current.add(rafId)
  //     }
  //     loop()
  //     endLoopFunc.current =  () => {
  //       if(rafId != null){
  //         cancelAnimationFrame(rafId)
  //       }
  //     }
  //   }
  // }
  // const deactivateCallbacks = callback => {
  //   activeCallbacks.current.delete(callback)
  //   console.log('rest activate callbacks: ', activeCallbacks.current.size)
  //   if(activeCallbacks.current ===0 && endLoopFunc.current != null ){
  //     endLoopFunc.current()
  //     endLoopFunc.current = null
  //   }
  //   console.log('all raf is about to be canceled....: ',Array.from(rafIdRef.current) )
  //   Array.from(rafIdRef.current).map(id=>cancelAnimationFrame(id))
  //   rafIdRef.current.clear()
  // }

  // useLayoutEffect(()=>{
  //   activateCallbacks(mainCallback)
  //   return ()=>deactivateCallbacks(mainCallback)
  // }, [speed])


  // const initial_data = [553.7481008424338,126.20311020412922,311.9197946890578,115.43028920790883,144.94757387269436,52.746795685900445,130.9167938422945,41.513788938769075,7.027296746079915,15.54645597073036]
  // const initial_time = 3103.4394
  // const initialState = {
  //   hemodynamicSeries:{
  //     data: [initial_data],
  //     time: [initial_time]
  //   }, 
  //   hemodynamicProps: DefaultPrperty,
  //   hemodynamicPropsMutations: []
  // }

    // <p>{[...rafIdRef.current].reduce((a,b)=>a+' '+b,'')}</p>
    // <p>{ activeCallbacks.current.size }</p>
                  
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


// { 
//   Object.keys(PVpropTypes).map((key,index) => {
//   if(!PVpropTypes[key].selected){
//     return null
//   }else{
//     return (
//     <Grid item xs={6} key={key} className={classes.withBoxShadow}>
//       <Box className={classes.halfBox} px ={2} pt={2} pb={-1} position='relative' style={{margin:'2px'}}>
//         <Box lineHeight={0} color="text.secondary"  position='absolute' zIndex={3} left={70} top={3}><Typography variant ='overline'>{PVpropTypes[key].name}</Typography></Box>
//         <Box color="text.secondary" position='absolute' zIndex={3} right={10} top={5} >
//           <Clear fontSize='small' aria-controls="simple-menu" aria-haspopup= {true}  style={{cursor: 'pointer'}}
//               onClick={()=>{setPVpropTypes(PVpropTypes=>{
//                 const newPVPropTypes = {...PVpropTypes}
//                 newPVPropTypes[key].selected = false
//                 return newPVPropTypes
//               })}}
//           />
//         </Box>
//         <PVBuilder chamber={key}/>
//       </Box>
//     </Grid>
//     )}
//   }
// )} 

//   {/* <Add fontSize='large' aria-controls="simple-menu" aria-haspopup= {true} onClick={e=>setAnchorEl(e.currentTarget)}
//         style={{cursor: 'pointer'}} 
//     />
//   <Menu
//     id="simple-menu"
//     anchorEl={anchorEl}
//     open={Boolean(anchorEl)}
//     onClose={()=>setAnchorEl(null)}
//   >
//     <ListSubheader>PV Loop</ListSubheader>
//     {Object.keys(PVpropTypes).map(key =>{
//       const clickHandler = e=>{
//         e.preventDefault();
//         setPVpropTypes(PVpropTypes=>{
//           const newPVPropTypes = {...PVpropTypes}
//           newPVPropTypes[key].selected = !PVpropTypes[key].selected 
//           return newPVPropTypes
//         })
//       }
//       return (
//         <MenuItem key={key} onClick={clickHandler}>
//           <Checkbox checked ={PVpropTypes[key].selected} color='primary'></Checkbox>
//           <ListItemText>{PVpropTypes[key].name}</ListItemText>
//         </MenuItem>
//         )
//     })}
//     <Divider/>
//     <ListSubheader>Flow</ListSubheader>
//     {Object.keys(propTypes).slice(0,4).map(key =>{
//       const clickHandler = e=>{
//         e.preventDefault();
//         setPropTypes(propTypes=>{
//           const newPropTypes = {...propTypes}
//           newPropTypes[key].selected = !propTypes[key].selected 
//           return newPropTypes
//         })
//       }
//       return (
//         <MenuItem key={key} onClick={clickHandler}>
//           <Checkbox checked ={propTypes[key].selected} color='primary'></Checkbox>
//           <ListItemText>{propTypes[key].name}</ListItemText>
//         </MenuItem>
//         )
//     })} 
//     <Divider/>
//     <ListSubheader>Pressure</ListSubheader>
//     {Object.keys(propTypes).slice(4).map(key =>{
//       const clickHandler = e=>{
//         e.preventDefault();
//         setPropTypes(propTypes=>{
//           const newPropTypes = {...propTypes}
//           newPropTypes[key].selected = !propTypes[key].selected 
//           return newPropTypes
//         })
//       }
//       return (
//         <MenuItem key={key} onClick={clickHandler}>
//           <Checkbox checked ={propTypes[key].selected} color='primary'></Checkbox>
//           <ListItemText>{propTypes[key].name}</ListItemText>
//         </MenuItem>
//         )
//     })}                         
//   </Menu>
//  */}