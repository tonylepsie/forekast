let helpers =  {
  convertTemperature: function(destTemp, temp) {
    switch (destTemp) {
      case 'C':
        break;
      case 'F':
        break;
    }
  },
  transformIconName: function(icon) {
    return this.replaceAll(icon.toUpperCase(),'-','_');
  },
  celciusToFarenheit: function(temp) {
    return temp;
  },
  capsFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  replaceAll(target, search, replacement) {
      return target.replace(new RegExp(search, 'g'), replacement);
  },
  hoursClean(hour) {
    if (hour < 10) hour = '0'+hour;
    return hour+' h';
  }
}

export default helpers;
