import React from 'react';
import Chart from 'react-apexcharts'

export default (props) => {
  const [series, options] =  props.data
  const [v1,v2] = series.slice(-2) 
  let cap = [v1,v2]
  if(series.length > 2){
    const d =  Math.sqrt((v1[0]-v1[1])**2+(v2[0]-v2[1])**2)
    cap = [[v2[0]-(v2[0]-v1[0])/d,v2[1]-(v2[1]-v1[1])/d],[v2[0], v2[1]]]
  }
  
  return (
    <Chart 
    series={[
      {type:'line', data: cap},
      {type:'line', data: series}
    ]} 
    options={
      {
        xaxis:{
          type:'numeric',
          min: 0,
          tickAmount:4
        }, 
        yaxis:{
          type:'numeric',
          tickAmount:4,
          decimalsInFloat:0, 
        },
        stroke: {
          width:[8,2],
          lineCap: 'round',
        },
        fill: {
          opacity: [1,0.6],
        },
        animations:{
          easing: 'linear',
          animateGradually: {
            enabled: false
          },
          dynamicAnimation: {
            enabled: false
          }
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          show: false
        },
        chart: {
          toolbar: {
            show: false
          }
        },
        ...options
      }
    } />
  )
}



