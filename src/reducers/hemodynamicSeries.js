import {UPDATE_SERIES,RESET_SERIES,LOAD_SERIES,CALC_SERIES} from '../actions'

import rk from '../utils/RungeKutta/Rk4'
import pv_func from '../utils/pvFunc'

// state ={
  // data:[1200,0,0,0,0,0,0,0,0,0], 
  // time: 10,
// }

const initial_data = [547.8023811212952, 125.29247043455904, 327.3148549511764, 118.96936622914811, 145.92142650139675, 49.463089479002896, 127.49227638555105, 34.55375220239585, 6.854163282131312, 16.336219413346292]
const initial_time = 5.239700000004154
const initialState = {
    data: initial_data,
    time: initial_time,
    logger:[]
  }
export default (state=initialState, action) =>{
  // console.log(action.type)
  switch(action.type){
    case UPDATE_SERIES:
      // console.log("[UPDATE_SERIES] data: ", action.data, 'time: ', action.time)
      return {data: action.data, time: action.time, logger:action.logger }
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
