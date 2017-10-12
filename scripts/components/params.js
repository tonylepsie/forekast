const params = {
  lang : 'fr',
  directionsFr: {
    "N": "Nord",
    "S": "Sud",
    "E": "Est",
    "W": "Ouest",
    "NE": "Nord ouest",
    "NW": "Nord est",
    "SE": "Sud est",
    "SW": "Sud ouest"
  },
  geoOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0 
  },
  iconPath: 'build/images/icons/'
}

export default params;
