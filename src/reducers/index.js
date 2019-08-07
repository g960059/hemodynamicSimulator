import {combineReducers} from 'redux'
import hemodynamicSeries from './hemodynamicSeries'
import hemodynamicProps from './hemodynamicProps'
import hemodynamicPropsMutations from './hemodynamicPropsMutations'

export default combineReducers(
  {
    hemodynamicSeries,
    hemodynamicProps,
    hemodynamicPropsMutations
  }
)