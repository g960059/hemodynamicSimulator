import {UPDATE_PROPS,LOAD_PROPS,RESET_PROPS} from '../actions'
import DefaultPrperty from '../settings/DefaultProperty'


export default (state=DefaultPrperty, action) =>{
  switch(action.type){
    case UPDATE_PROPS:
      console.log('UPDATE_PROPS: ', action.propsUpdated)
      console.log('New State: ', {...state, ...action.propsUpdated})
      return {...state, ...action.propsUpdated} 
    case RESET_PROPS:
      return {}
    case LOAD_PROPS:
      return {}
    default:
      // console.log('HemodyanmaicProps Default Called')
      return state
  }
}
