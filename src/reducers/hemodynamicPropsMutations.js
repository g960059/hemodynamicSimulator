import {PUSH_PROP_MUTATION,ShIFT_PROP_MUTATION} from '../actions'


export default (state={}, action) =>{
  switch(action.type){
    case PUSH_PROP_MUTATION:
      console.log('PUSH_PROP_MUTATION: ',[...state, action.propMutation] )
      return [...state, action.propMutation]
    case ShIFT_PROP_MUTATION:
      return [...state].slice(1)
    default:
      // console.log('HemodyanmaicProps Default Called')
      return state
  }
}
