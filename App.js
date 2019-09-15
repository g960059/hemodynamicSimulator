import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Simulator from './src/pages/Simulator'
import Landing from './src/pages/Landing'

export default (props) => {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/simulator" component={Simulator} />
    </Router>
  )
}
