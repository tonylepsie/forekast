import React from 'react';
import params from './params';
import h from '../helpers';

class DaysForekast extends React.Component {

  constructor (props) {
    super(props);
    this.renderDay = this.renderDay.bind(this);
  }

  renderDay(day, index) {
    var canvasSize = 35;
    var maxDays = 10;
    if (index === 0 || index > maxDays) return;

    return(
      <li key={'day-'+index}>
        <div className="day">{h.capsFirstLetter(day.dateTime.format('dddd'))}</div>
        <img src={params.iconPath+day.icon+".svg"} alt={h.transformIconName(day.icon)} className="icon" />
        <div className="temp">
          <span className="temp-max">{this.props.displayTemp(day.temperatureMax)}°</span><span className="temp-min">{this.props.displayTemp(day.temperatureMin)}°</span>
        </div>
      </li>
    )
  }

  render() {
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
}

export default DaysForekast;
