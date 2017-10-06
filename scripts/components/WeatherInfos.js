import React from 'react';
import params from './params';

class WeatherInfos extends React.Component{

  render() {
    var isLoading = this.props.isLoading;
    if (!isLoading) {
      var data = this.props.weatherData;
      return (
        <section className="weather-infos">

            <h2>
              Aujourd'hui
              <span className="today-max">{this.props.displayTemp(data.daily.data[0].temperatureMax)}°</span> <span className="separator">→</span>
              <span className="today-min">{this.props.displayTemp(data.daily.data[0].temperatureMin)}°</span>
            </h2>

            <div className="group">
              <div>Température :</div><div>{this.props.displayTemp(data.currently.temperature)}<sup>°</sup><span className="Unit">{this.props.tempUnit}</span></div>
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
  
}

export default WeatherInfos;
