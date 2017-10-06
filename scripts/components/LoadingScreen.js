import React from 'react';

class LoadingScreen extends React.Component{

  render() {

    var isLoading = this.props.isLoading;
    if (isLoading) {
      return (
          <div className="forekastLoader">
            <img src="build/images/loading.gif" />
          </div>
      )
    } else return null;
  }
  
}

export default LoadingScreen;
