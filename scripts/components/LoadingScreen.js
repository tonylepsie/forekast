import React from 'react';

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

export default LoadingScreen;
