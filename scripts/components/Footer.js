import React from 'react';
import ReactDOM from 'react-dom';

class Footer extends React.Component{

  render() {
    let isLoading = this.props.isLoading;
    if (!isLoading) {
      return (
      <footer>
        © Anthony Ksiezniak {(new Date()).getFullYear()} - <a href="https://darksky.net/poweredby/" target="_blank">Powered by Dark Sky</a> - Icons by <a href="http://www.alessioatzeni.com/meteocons/" target="_blank">Alessio Atzeni</a>
      </footer>
      )
    } else return null;
  }

}

export default Footer;
