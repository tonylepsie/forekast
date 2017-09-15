import React from 'react';
import ReactDOM from 'react-dom';
import Skycons from 'react-skycons';
import DarkSkyApi from 'dark-sky-api';
import axios from 'axios';


DarkSkyApi.apiKey = '4800f3aa10abd73d632df6561bf097b1';

DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'fr'; // default 'en'


// a bouger ailleurs
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



var Forekast = React.createClass({
  getInitialState : function () {
    return {
      isLoading: true,
      tempUnit: 'C',
      weatherData: {},
      city: '',
      currentIcon: '',
      geo: {
        lat: '',
        lon: ''
      }
    }
  },

  componentWillMount: function() {

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, options);
    } else {
      alert('no geo');
    }

  },

  apiCall: function() {

  },

  displayForekast: function(weatherData) {

    this.state.weatherData = weatherData;
    this.state.isLoading = false;
    this.state.currentIcon = weatherData.icon;

    this.setState({
      isLoading: this.state.isLoading,
      weatherData: this.state.weatherData
    });
  },

  setCity: function(city) {
    console.log(city);
    this.state.city = city;
    this.setState({
      city : this.state.city,
      currentIcon: this.state.currentIcon
    });
  },

  getLocality: function() {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.state.geo.lat+","+this.state.geo.lon;
    console.log(url);
    var that = this;
    axios.get(url)
      .then(function (response) {
        that.setCity(response.data.results[0].address_components[2].long_name);
      })
      .catch(function (error) {
        console.log(error);
      });

  },

  geoSuccess: function(args) {

    this.state.geo.lat = args.coords.latitude;
    this.state.geo.lon = args.coords.longitude;

    this.setState({
      geo : {
        lat: this.state.geo.lat,
        lon: this.state.geo.lon
      }
    });

    const position = {
      latitude: args.coords.latitude,
      longitude: args.coords.longitude
    };

    this.getLocality();

    DarkSkyApi.loadCurrent(position)
      .then(
        result => this.displayForekast(result)
      );

  },
  geoError: function(args) {
    console.log(args);
  },

  render : function() {

    return (
      <div>
        <LoadingScreen isLoading={this.state.isLoading} />
        <NowForekast weatherData={this.state.weatherData} isLoading={this.state.isLoading} city={this.state.city} />
        <WeatherInfos weatherData={this.state.weatherData} isLoading={this.state.isLoading} />

      </div>
    )
  }
})

var LoadingScreen = React.createClass({
  render : function() {

    let isLoading = this.props.isLoading;
    if (isLoading) {
      return (
        <div className="forekast">
          <div className="forekastLoader">
          <i>~ loading forecast ~</i>
          </div>
        </div>
      )
    } else return(<div></div>);
  }
})



var NowForekast = React.createClass({
  render : function() {

    var isLoading = this.props.isLoading;
    if (!isLoading) {
      let data = this.props.weatherData
      let city = this.props.city;
      console.log(this.props.weatherData);
      return (
        <section className="weather-now">

            <h1 className="weather-now__city">{city}</h1>

            <div className="weather-now__icon-wrapper">
              <Skycons color='white' icon={transformIconName(data.icon)} autoplay={true}  />
            </div>
            <div className="weather-now__wrapper">
              <div className="weather-now__temperature">{Math.round(data.temperature)}<sup>°</sup></div>
              <div className="weather-now__summary">{data.summary}</div>
            </div>
        </section>
      )
    }
    else return (
      <div></div>
    );
  }
})


var WeatherInfos = React.createClass({
  render : function() {

    var isLoading = this.props.isLoading;
    if (!isLoading) {
      var data = this.props.weatherData
      console.log(this.props.weatherData);
      return (
        <section className="weather-infos">
          <ul>
            <li>temp : {data.temperature}</li>
            <li>icon : {data.icon}</li>
            <li>visibility : {data.visibility}</li>
            <li>windDirection : {data.windDirection}</li>
            <li>summaryyyyyyyy : {data.summary}</li>
          </ul>

        </section>
      )
    }
    else return (
      <div></div>
    );
  }
})

function transformIconName (icon) {
  console.log(icon);
  return icon.toUpperCase().replaceAll('-','_');
}




ReactDOM.render(React.createElement(Forekast), document.querySelector('#main'));
