import React from 'react';
import ReactDOM from 'react-dom';
import Skycons from 'react-skycons';
import DarkSkyApi from 'dark-sky-api';
import axios from 'axios';
import h from './helpers';

DarkSkyApi.apiKey = '4800f3aa10abd73d632df6561bf097b1';

DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'fr'; // default 'en'


// a bouger ailleurs
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


const directionsFr = {
  "N": "Nord",
  "S": "Sud",
  "E": "Est",
  "W": "Ouest",
  "NE": "Nord ouest",
  "NW": "Nord est",
  "SE": "Sud est",
  "SW": "Sud ouest",
};



var Forekast = React.createClass({
  getInitialState : function () {
    return {
      isLoading: true,
      tempUnit: 'C',
      weatherDailyData: {},
      weatherWeeklyData : {},
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

  registerDailyData: function(weatherData) {

    this.state.weatherData = weatherData;
    this.state.isLoading = false;
    this.state.currentIcon = weatherData.icon;

    this.setState({
      isLoading: this.state.isLoading,
      weatherDailyData: this.state.weatherData
    });
  },

  registerweeklyData: function(weatherData) {
    /*
    this.state.weatherData = weatherData;
    this.state.isLoading = false;
    this.state.currentIcon = weatherData.daily.icon;

    this.setState({
      isLoading: this.state.isLoading,
      weatherData: this.state.weatherData
    });
    */
  },

  selectUnit: function(unit) {
    console.log(unit);
    console.log(this.state.tempUnit);
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
        result => this.registerDailyData(result)
      );

    /*DarkSkyApi.loadForecast(position)
      .then(
        result => this.registerWeeklyData(result)
      );
      */

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
          <WeatherInfos weatherData={this.state.weatherData} tempUnit={this.state.tempUnit} isLoading={this.state.isLoading} />
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

    let isLoading = this.props.isLoading;
    if (isLoading) {
      return (
        <div className="forekast">
          <div className="forekastLoader">
            <img src="build/images/813.gif" />
          </div>
        </div>
      )
    } else return null;
  }
})

var UnitToggle = React.createClass({


  componentWillMount: function() {

  },
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

var Footer = React.createClass({
  render: function() {
    let isLoading = this.props.isLoading;
    if (!isLoading) {
      return (
      <footer>
        <a href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
      </footer>
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
      console.log(this.props.weatherData);
      return (
        <section className="weather-now">

            <h1 className="weather-now__city">{city}</h1>
            <div className="weather-now__summary">{data.summary}</div>

            <div className="weather-now__icon-wrapper">
              <Skycons color='white' icon={transformIconName(data.icon)} autoplay={true} width="150" height="150" style={{height: 'auto'}, {width: 'auto'}}  />
            </div>
            <div className="weather-now__wrapper">
              <div className="weather-now__temperature">{Math.round(data.temperature)}<sup>°</sup><span className="Unit">{this.props.tempUnit}</span></div>
            </div>

            <div className="weather-now__summary-long">
              Pluie faible débutant dans l’après-midi, se prolongeant jusque dans la soirée.
            </div>

        </section>
      )
    }
    else return null;
  }
})

var HoursForekast = React.createClass({

  render: function() {
    var isLoading = this.props.isLoading;
    if (!isLoading) {

      return (
        <section className="weather-by-hours">
          <h2>
            A venir
          </h2>
        </section>
      );
    } else return null;
  }
})


var DaysForekast = React.createClass({

  render: function() {
    var isLoading = this.props.isLoading;

    var canvasSize = 35;

    if (!isLoading) {

      return (
        <section className="weather-by-days">
          <h2>
            Les 10 prochains jours
          </h2>

          <div className="weather-by-days_list">
            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="CLEAR_DAY" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Mardi</span>
            </div>

            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="RAIN" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Mercredi</span>

            </div>

            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="CLEAR_NIGHT" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Jeudi</span>
            </div>

            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="CLEAR_DAY" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Vendredi</span>
            </div>

            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="CLEAR_NIGHT" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Samedi</span>
            </div>

            <div className="weather-by-days_day">
              <div><Skycons color='white' icon="RAIN" autoplay={false} width={canvasSize} height={canvasSize} style={{height: 'auto'}, {width: 'auto'}}  /></div>
              <span>Dimanche</span>
            </div>

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
      var data = this.props.weatherData
      console.log(this.props.weatherData);
      return (
        <section className="weather-infos">

            <h2>
              Aujourd'hui
              <span className="today-max">16°</span> <span className="separator">→</span>
              <span className="today-min">9°</span>
            </h2>

            <div>Température :</div><div>{data.temperature}<sup>°</sup><span className="Unit">{this.props.tempUnit}</span></div>
            <div>Indice Uv :</div><div>{data.uvIndex}</div>

            <div>Résumé :</div><div>{data.summary}</div>
            <div>Risque de pluie:</div><div>{data.precipProbability*100} %</div>

            <div>Direction du vent :</div><div><span className="wind-direction" data-direction={data.windDirection} >{directionsFr[data.windDirection]}</span></div>
            <div>Vitesse du vent :</div><div>{data.windSpeed} km/h</div>

            <div>Pression :</div><div>{Math.round(data.pressure)} hPa</div>
            <div>Visibilité :</div><div>{data.visibility} km</div>

            <div>Température :</div><div>{data.temperature}<sup>°</sup><span className="Unit">{this.props.tempUnit}</span></div>
            <div>Indice Uv :</div><div>{data.uvIndex}</div>

            <div>Résumé :</div><div>{data.summary}</div>
            <div>Risque de pluie:</div><div>{data.precipProbability*100} %</div>

            <div>Direction du vent :</div><div><span className="wind-direction" data-direction={data.windDirection} >{directionsFr[data.windDirection]}</span></div>
            <div>Vitesse du vent :</div><div>{data.windSpeed} km/h</div>

            <div>Pression :</div><div>{Math.round(data.pressure)} hPa</div>
            <div>Visibilité :</div><div>{data.visibility} km</div>

        </section>
      )
    }
    else return null;
  }
})

function transformIconName (icon) {
  console.log(icon);
  return icon.toUpperCase().replaceAll('-','_');
}




ReactDOM.render(React.createElement(Forekast), document.querySelector('#main'));
