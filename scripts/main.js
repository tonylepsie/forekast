import React from 'react';
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router  = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');


import Skycons from 'react-skycons';


var Forekast = React.createClass({
  getInitialState : function () {
    return {
      cities: {}
    }
  },
  loadCities: function() {
    this.setState({
      cities : require('../samples/cities')
    });
  },
  addCity: function() {
    return;
  },
  render : function() {

    //test = new Skycons({"color": "red"});
    return (
      <div className="forekast">
        <h1>Forekast !</h1>
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


var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={Forekast}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
