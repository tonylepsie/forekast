import React from 'react';
import params from './params';
import h from '../helpers';

class HoursForekast extends React.Component {

  constructor (props) {
    super(props);
    this.renderHour = this.renderHour.bind(this);
  }

  renderHour(hourData, index) {
    var maxHours = 20;

    var hour = new Date();
    hour.setTime(hourData.time*1000);

    if (index === 0 || index > maxHours) return;

    return(
      <li key={'day-'+index}>
        <div className="hour">{h.hoursClean(hour.getHours())}</div>
        <img src={params.iconPath+hourData.icon+".svg"}  alt={h.transformIconName(hourData.icon)} />

        <div className="temp">{this.props.displayTemp(hourData.temperature)}°</div>
      </li>
    )
  }

  render() {
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

}

export default HoursForekast;
