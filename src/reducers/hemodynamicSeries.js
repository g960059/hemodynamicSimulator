import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES} from '../actions'

import rk from '../utils/RungeKutta/Rk4'
import pv_func from '../utils/pvFunc'

// state ={
  // data:[1200,0,0,0,0,0,0,0,0,0], 
  // time: 10,
// }

export default (state=[], action) =>{
  // console.log(action.type)
  switch(action.type){
    case UPDATE_SERIES:
      return {data: action.data, time: action.time }
    // case CALC_SERIES:
    //   let ind = state.futures.length-1
    //   const time_ = state.futures[ind].time + action.dt
    //   const data_ = rk(pv_func,action.hemodynamicProps)(state.futures[ind].data,time_,action.dt)
    //   console.log({data: state.data, time: state.time, futures:[...state.futures, {data:data_, time: time_}]})
    //   return {data: state.data, time: state.time, futures:[...state.futures, {data:data_, time: time_}]}
    case RESET_SERIES:
      return {data:[],time:0}
    case LOAD_SERIES:
      return {data:[],time:0}
    default:
      console.log('HemodynamicSeries Default called!')
      return state
  }
}
