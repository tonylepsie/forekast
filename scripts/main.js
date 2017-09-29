import React from 'react';
import ReactDOM from 'react-dom';
import DarkSkyApi from 'dark-sky-api';
import axios from 'axios';
import moment from 'moment';
require('moment/locale/fr');
import h from './helpers';

DarkSkyApi.apiKey = '4800f3aa10abd73d632df6561bf097b1';
DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'fr'; // default 'en'

moment.locale('fr');

const params = {
  lang : 'fr',
  directionsFr: {
    "N": "Nord",
    "S": "Sud",
    "E": "Est",
    "W": "Ouest",
    "NE": "Nord ouest",
    "NW": "Nord est",
    "SE": "Sud est",
    "SW": "Sud ouest",
  },
  iconPath: 'build/images/icons/'
}



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
  /*
  registerWeeklyData: function(weatherWeeklyData) {

    this.state.weatherWeeklyData = weatherWeeklyData;

    console.log(weatherWeeklyData);
    this.setState({
      isLoading: this.state.isLoading,
      weatherWeeklyData: this.state.weatherWeeklyData
    });
  },
  */
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
  render : function() {

    return (
      <div className={'forekast__wrapper '+this.state.currentIcon}>

        <div className="forekast">
          <LoadingScreen isLoading={this.state.isLoading} />
          <UnitToggle tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} selectUnit={this.selectUnit} />
          <NowForekast weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} city={this.state.city} />
          <WeatherInfos weatherData={this.state.weatherData}  tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} />
          <HoursForekast weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading}  />

          <DaysForekast weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} city={this.state.city} />
          <Footer isLoading={this.state.isLoading} />
        </div>

      </div>
    )
  }
})

var LoadingScreen = React.createClass({
  render : function() {

    var isLoading = this.props.isLoading;
    if (isLoading) {
      return (
          <div className="forekastLoader">
            <img src="build/images/loading.gif" />
          </div>
      )
    } else return null;
  }
})

var UnitToggle = React.createClass({
  isUnitSelected: function(unit) {
    if (unit === this.state.currentUnit) {
      return 'selected';
    }
    else return;
  },

  displayUnit: function(unit) {
    return (
      <a href="#" className={unit === this.props.tempUnit ? 'selected' : ''} onClick={this.props.selectUnit.bind(null, unit)}>{unit}</a>
    )
  },
  render : function() {
    let isLoading = this.props.isLoading;
    if (!isLoading) {
      return (
        <div className="unit-toggle">
          {this.displayUnit('C')} <span>|</span>
          {this.displayUnit('F')}
        </div>
      )
    } else return null;
  }
})

var NowForekast = React.createClass({

  render : function() {

    var isLoading = this.props.isLoading;
    if (!isLoading) {
      let data = this.props.weatherData;
      let city = this.props.city;

      return (
        <section className="weather-now">

            <h1 className="weather-now__city">{city}</h1>
            <div className="weather-now__summary">{data.currently.summary}</div>

            <div className="weather-now__icon-wrapper">
              <img src={params.iconPath+data.currently.icon+".svg"} alt={h.transformIconName(data.currently.icon)} />
            </div>
            <div className="weather-now__wrapper">
              <div className="weather-now__temperature">{Math.round(data.currently.temperature)}<sup>°</sup></div>
            </div>

            <div className="summary">
              {data.daily.data[0].summary}
            </div>

        </section>
      )
    }
    else return null;
  }
})

var HoursForekast = React.createClass({

  renderHour: function(hourData, index) {
    var maxHours = 20;

    var hour = new Date();
    hour.setTime(hourData.time*1000);

    if (index === 0 || index > maxHours) return;

    return(
      <li key={'day-'+index}>
        <div className="hour">{h.hoursClean(hour.getHours())}</div>
        <img src={params.iconPath+hourData.icon+".svg"}  alt={h.transformIconName(hourData.icon)} />

        <div className="temp">{Math.round(hourData.temperature)}°</div>
      </li>
    )
  },

  render: function() {
    var isLoading = this.props.isLoading;
    var hourlyData = this.props.weatherData.hourly;
    if (!isLoading) {

      return (
        <section className="weather-by-hours">
          <h2>
            Prévisions à court terme
          </h2>
          <div className="weather-by-hours__list">

            <ul>
              {hourlyData.data.map(this.renderHour)}
            </ul>
          </div>
        </section>
      );
    } else return null;
  }
})


var DaysForekast = React.createClass({
  renderDay: function (day, index) {
    var canvasSize = 35;
    var maxDays = 10;
    if (index === 0 || index > maxDays) return;
    return(
      <li key={'day-'+index}>
        <div className="day">{h.capsFirstLetter(day.dateTime.format('dddd'))}</div>
        <img src={params.iconPath+day.icon+".svg"} alt={h.transformIconName(day.icon)} className="icon" />
        <div className="temp">
          <span className="temp-max">{Math.round(day.temperatureMax)}°</span><span className="temp-min">{Math.round(day.temperatureMin)}°</span>
        </div>
      </li>
    )
  },

  render: function() {

    let weeklyData = this.props.weatherData.daily;
    let isLoading = this.props.isLoading;

    if (!isLoading) {
      return (
        <section className="weather-by-days">
          <h2>
            Prévisions à moyen terme
          </h2>

          <div className="summary">
            {weeklyData.summary}
          </div>
          <div className="weather-by-days_list">
            <ul>
              {weeklyData.data.map(this.renderDay)}
            </ul>
          </div>
        </section>
      );
    } else return null;
  }
})


var WeatherInfos = React.createClass({
  render : function() {

    var isLoading = this.props.isLoading;
    if (!isLoading) {
      var data = this.props.weatherData;
      return (
        <section className="weather-infos">

            <h2>
              Aujourd'hui
              <span className="today-max">{Math.round(data.daily.data[0].temperatureMax)}°</span> <span className="separator">→</span>
              <span className="today-min">{Math.round(data.daily.data[0].temperatureMin)}°</span>
            </h2>

            <div className="group">
              <div>Température :</div><div>{Math.round(data.currently.temperature)}<sup>°</sup><span className="Unit">{this.props.tempUnit}</span></div>
              <div>Indice UV :</div><div>{data.currently.uvIndex}</div>
            </div>

            <div className="group">
              <div>Résumé :</div><div>{data.currently.summary}</div>
              <div>Risque de pluie:</div><div>{Math.round(data.currently.precipProbability*100)} %</div>
            </div>

            <div className="group">
              <div>Direction du vent :</div><div><span className="wind-direction" data-direction={data.currently.windDirection} >{params.directionsFr[data.currently.windDirection]}</span></div>
              <div>Vitesse du vent :</div><div>{data.currently.windSpeed} km/h</div>
            </div>

            <div className="group">
              <div>Pression :</div><div>{Math.round(data.currently.pressure)} hPa</div>
              <div>Visibilité :</div><div>{data.currently.visibility} km</div>
            </div>

        </section>
      )
    }
    else return null;
  }
})

var Footer = React.createClass({
  render: function() {
    let isLoading = this.props.isLoading;
    if (!isLoading) {
      return (
      <footer>
        <a href="https://darksky.net/poweredby/" target="_blank">Powered by Dark Sky</a> - Icons by <a href="http://www.alessioatzeni.com/meteocons/" target="_blank">Alessio Atzeni</a>
      </footer>
      )
    } else return null;
  }
})

ReactDOM.render(React.createElement(Forekast), document.querySelector('#main'));
