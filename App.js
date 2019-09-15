import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Simulator from './src/pages/Simulator'
import Landing from './src/pages/Landing'
import ReactGA from 'react-ga';

export default (props) => {
  useEffect(() => {
    ReactGA.initialize('UA-146532131-1');
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, []);
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/simulator" component={Simulator} />
    </Router>
  )
}
