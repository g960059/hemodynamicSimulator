import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES} from '../actions'

import rk from '../utils/RungeKutta/Rk4'
import pv_func from '../utils/pvFunc'

// state ={
  // data:[1200,0,0,0,0,0,0,0,0,0], 
  // time: 10,
// }

const initial_data = [553.7481008424338,126.20311020412922,311.9197946890578,115.43028920790883,144.94757387269436,52.746795685900445,130.9167938422945,41.513788938769075,7.027296746079915,15.54645597073036]
const initial_time = 3103.4394
const initialState = {
    data: [initial_data],
    time: [initial_time]
  }

export default (state=initialState, action) =>{
  // console.log(action.type)
  switch(action.type){
    case UPDATE_SERIES:
      // console.log("[UPDATE_SERIES] data: ", action.data, 'time: ', action.time)
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
      // console.log('HemodynamicSeries Default called!')
      return state
  }
}
