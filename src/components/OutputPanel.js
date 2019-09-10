import React,{useEffect, useState,useRef} from 'react';
import {FlexibleXYPlot, LineSeries,XAxis,YAxis} from 'react-vis';
import { useTrackedState } from 'reactive-react-redux';


export default (props) => {
  const state = useTrackedState();
  const cv_props = state.hemodynamicProps
  useEffect(() => {
    const {data,time,logger} = state.hemodynamicSeries
  }, [state.hemodynamicSeries])
  
}
