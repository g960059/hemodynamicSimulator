import {UPDATE_PROPS,LOAD_PROPS,RESET_PROPS} from '../actions'


export default (state={}, action) =>{
  switch(action.type){
    case UPDATE_PROPS:
      return {...state, ...action.newHemodynamicProps} 
    case RESET_PROPS:
      return {}
    case LOAD_PROPS:
      return {}
    default:
      // console.log('HemodyanmaicProps Default Called')
      return state
  }
}
