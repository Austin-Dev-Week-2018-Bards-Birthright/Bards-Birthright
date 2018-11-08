const request = require('request');

module.exports.titleLookup = (title, cb) => {
  const queryString = `
    https://en.wikipedia.org/w/api.php?action=query&prop=description&prop=cirrusdoc&format=json&formatversion=2&titles=${title}
  `
  const arrayToObject = (array) =>
  array.reduce((obj, item, idx, src) => {
    obj[src[idx].split(':')[1]] = src[idx].split(':')[1];
    return obj
  }, {})
  let type = null;
  request.get(queryString, (error, response, body) => {
    if (error) throw error;
    const templateArray = JSON.parse(body).query.pages[0].cirrusdoc[0].source.template;
    const templates = arrayToObject(templateArray.slice(0, 11));
    if (templates['Infobox drug']) {
      // console.log('drug');
      type = 'drug';
    } else if (templates['Infobox symptoms'] || templates['Infobox medical condition'] || templates['Infobox medical condition (new)']) {
      // console.log('symptom');
      type = 'symptom';
    }
    cb('title is type: ', type);
  })
  
}
