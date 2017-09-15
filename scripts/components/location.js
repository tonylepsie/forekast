



class location (

  constructor() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  function success(pos) {
    var crd = pos.coords;

    console.log('Votre position actuelle est :');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`Plus ou moins ${crd.accuracy} mètres.`);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }



)


/*
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Votre position actuelle est :');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`Plus ou moins ${crd.accuracy} mètres.`);
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};


*/
