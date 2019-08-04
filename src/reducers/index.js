import {combineReducers} from 'redux'
import hemodynamicSeries from './hemodynamicSeries'
import hemodynamicProps from './hemodynamicProps'

export default combineReducers(
  {
    hemodynamicSeries,
    hemodynamicProps
  }
)