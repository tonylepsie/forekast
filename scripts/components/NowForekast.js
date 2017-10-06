import React from 'react';
import params from './params';
import h from '../helpers';

var NowForekast = React.createClass({

  render : function() {

    var isLoading = this.props.isLoading;
    if (!isLoading) {
      var data = this.props.weatherData;
      var city = this.props.city;

      return (
        <section className="weather-now">

            <h1 className="weather-now__city">{city}</h1>
            <div className="weather-now__summary">{data.currently.summary}</div>

            <div className="weather-now__icon-wrapper">
              <img src={params.iconPath+data.currently.icon+".svg"} alt={h.transformIconName(data.currently.icon)} />
            </div>
            <div className="weather-now__wrapper">
              <div className="weather-now__temperature">{this.props.displayTemp(data.currently.temperature)}<sup>°</sup></div>
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

export default NowForekast;
