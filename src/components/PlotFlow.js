import React,{useEffect, useContext,useState,useRef} from 'react';
import AppContext from '../contexts/AppContexts'
import {get_column} from '../utils/utils'
import {u_P} from '../utils/pvFunc'

import '../../node_modules/react-vis/dist/style.css';
import {FlexibleXYPlot,XYPlot, LineSeries,MarkSeries, XAxis,YAxis, LineSeriesCanvas} from 'react-vis';
import { red } from '@material-ui/core/colors';

export default (props) => {
  const {state,_} = useContext(AppContext);
  const [trajectory, setTrajectory] = useState([]);
  const cvProps = useRef()
  const calcFlow = useRef()
  

  useEffect(() => {
    cvProps.current = state.hemodynamicProps
    const chamber_volume_mapping = {"LV":4, "LA":5, "RV":6, "RA":7}
    switch(props.name){
      case 'MVF':
        calcFlow.current = (time,data)=>{
          const pla = u_P(get_column(data, chamber_volume_mapping['LA']),time,cvProps.current.LA_Ees,cvProps.current.LA_V0,cvProps.current.LA_alpha, cvProps.current.LA_beta, cvProps.current.LA_Tmax, cvProps.current.LA_tau, cvProps.current.LA_AV_delay, cvProps.current.HR)
          const plv = u_P(get_column(data, chamber_volume_mapping['LV']),time,cvProps.current.LV_Ees,cvProps.current.LV_V0,cvProps.current.LV_alpha, cvProps.current.LV_beta, cvProps.current.LV_Tmax, cvProps.current.LV_tau, cvProps.current.LV_AV_delay, cvProps.current.HR)
          const res = []
          for(let i=0; i<pla.length; i++){
            if(pla[i]-plv[i]<0){
              res.push({ x:time[i], y: 0})
            }else{
              res.push({ x:time[i], y: (pla[i]-plv[i])/cvProps.current.Rmv})
            }
          }
          return res
        }
    }
  }, [state.hemodynamicProps]);

  useEffect(() => {
    const {data,time} = state.hemodynamicSeries
    setTrajectory(trajectory =>{
      let newTrajectory = trajectory.concat(calcFlow.current(time,data))
      const len = newTrajectory.length
      if (len >1000){
        return newTrajectory.slice(len-1000+1,1000)
      }
      return newTrajectory
    })
  }, [state.hemodynamicSeries]);

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

  return (
    <FlexibleXYPlot > 
      <XAxis/>
      <YAxis/>
      <LineSeries data={trajectory}/>    
      {/* {trajectory.length > 2 ?  <MarkSeries data={[{...trajectory[trajectory.length-1], size: 3},{...trajectory[0], size: 10, opacity:0},{...trajectory[0], size: 0, opacity:0}]}/>: null} */}
    </FlexibleXYPlot>
  )
}