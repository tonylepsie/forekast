var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router  = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');


var Forekast = React.createClass({
  getInitialState : function () {
    return {
      cities: {}
    }
  },
  loadCities: function() {
    this.setState({
      fishes : require('./samples/cities')
    });
  },
  addCity: function() {
    return;
  },
  render : function() {
    return (
      <div className="forekast">
        <h1>Forekast</h1>

        <CityList />
      </div>
    )
  }
})


var addCityForm = React.createClass({

  render: function() {
    return (
      <div>ok bro</div>
    )
  }

})



var CityList = React.createClass({
  render : function() {
    return (
      <div>
        <h2>CityName</h2>
      </div>
    )
  }
})




var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={Forekast}/>
    <Route path="/add-city" component={addCityForm}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
