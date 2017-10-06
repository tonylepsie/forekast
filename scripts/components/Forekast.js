import React from 'react';
import DarkSkyApi from 'dark-sky-api';
import axios from 'axios';
import moment from 'moment';
require('moment/locale/fr');
import h from '../helpers';
import params from './params';

import LoadingScreen from './LoadingScreen';
import UnitToggle from './UnitToggle';
import NowForekast from './NowForekast';
import HoursForekast from './HoursForekast';
import DaysForekast from './DaysForekast';
import WeatherInfos from './WeatherInfos';
import Footer from './Footer';

DarkSkyApi.apiKey = '4800f3aa10abd73d632df6561bf097b1';
DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'fr'; // default 'en'

moment.locale('fr');


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

  registerData: function(weatherData) {
    console.log(weatherData);

    this.state.weatherData = weatherData;
    this.state.currentIcon = weatherData.currently.icon;
    this.state.isLoading = false;
    this.setState({
      isLoading: this.state.isLoading,
      weatherData: this.state.weatherData,
      currentIcon: this.state.currentIcon
    });
  },

  selectUnit: function(unit) {
    if (unit !== this.state.tempUnit) {
      this.state.tempUnit = unit;
      this.setState({
        tempUnit: this.state.tempUnit
      });
      return;
    }
    else return;
  },

  setCity: function(city) {
    this.state.city = city;
    this.setState({
      city : this.state.city,
      currentIcon: this.state.currentIcon
    });
  },

  getLocality: function() {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.state.geo.lat+","+this.state.geo.lon;
    var that = this;
    axios.get(url)
      .then(function (response) {
        that.setCity(response.data.results[0].address_components[2].long_name);
      })
      .catch(function (error) {
        console.log(error);
        // todo : displayError(error);
      });

  },

  geoSuccess: function(args) {
    const position = {
      latitude: args.coords.latitude,
      longitude: args.coords.longitude
    };
    this.state.geo.lat = args.coords.latitude;
    this.state.geo.lon = args.coords.longitude;

    this.setState({
      geo : {
        lat: this.state.geo.lat,
        lon: this.state.geo.lon
      }
    }, this.getLocality);


    DarkSkyApi.loadItAll('minutely,flags', position)
      .then(
        result => this.registerData(result)
      );
  },
  geoError: function(args) {
    console.log(args);
  },
  displayTemp: function(temp) {
    if (this.state.tempUnit === 'C') {
      temp = Math.round(temp);
    }
    else {
      temp =  Math.round((temp * 9/5) +32);
    }
    return temp;
  },

  render : function() {

    return (
      <div className={'forekast__wrapper '+this.state.currentIcon}>

        <div className="forekast">
          <LoadingScreen isLoading={this.state.isLoading} />
          <UnitToggle tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} selectUnit={this.selectUnit} />
          <NowForekast displayTemp={this.displayTemp} weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} city={this.state.city} />
          <WeatherInfos displayTemp={this.displayTemp} weatherData={this.state.weatherData}  tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} />
          <HoursForekast displayTemp={this.displayTemp} weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading}  />
          <DaysForekast displayTemp={this.displayTemp} weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} city={this.state.city} />
          <Footer isLoading={this.state.isLoading} />
        </div>

      </div>
    )
  }
})

export default Forekast;
