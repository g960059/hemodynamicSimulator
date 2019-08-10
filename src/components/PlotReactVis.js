import React from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries} from 'react-vis';


export default (props) => {
  const  data = [
    [0, 8],
    [1, 5],
    [2, 4],
    [3, 9],
    [4, 1],
    [5, 7],
    [6, 6],
    [7, 3],
    [8, 2],
    [9, 0]
  ];
  return (
    <XYPlot height={300} width={300}> 
      <LineSeries data={data} />
    </XYPlot>
  )
}