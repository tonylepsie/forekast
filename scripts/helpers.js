let helpers =  {
  rando : function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  slugify : function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },
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
  capsFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  replaceAll(target, search, replacement) {
      return target.replace(new RegExp(search, 'g'), replacement);
  }
}

export default helpers;
