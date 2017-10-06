import React from 'react';

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

export default UnitToggle;
