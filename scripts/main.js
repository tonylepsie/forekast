import React from 'react';
import ReactDOM from 'react-dom';

//import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//var History = ReactRouter.History;
//var createBrowserHistory = require('history/lib/createBrowserHistory');


import Skycons from 'react-skycons';


var Forekast = React.createClass({
  getInitialState : function () {
    return {
      cities: {}
    }
  },

  render : function() {

    return (
      <div className="forekast">
        <div className="forekastLoader">
          <Skycons color='white' icon='RAIN' autoplay={true}/>
        </div>
      </div>
    )
  }
})



var CityList = React.createClass({
  render : function() {
    return (
      <div>
      </div>
    )
  }
})



ReactDOM.render(React.createElement(Forekast), document.querySelector('#main'));
