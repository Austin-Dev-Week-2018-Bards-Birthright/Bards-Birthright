const request = require('request');

module.exports.titleLookup = (title) => {
  const queryString = `
    https://en.wikipedia.org/w/api.php?action=query&prop=description&prop=cirrusdoc&format=json&formatversion=2&titles=${title}
  `
  request.get(queryString, (error, response, body) => {
    if (error) throw error;
    const templateArray = JSON.parse(body).query.pages[0].cirrusdoc[0].source.template
    let type;
    // for (let i = 0; i < templateArray.length; i++) {
    //   if(templateArray[i].split(':')[1] === 'Infobox drug') {
    //     return 'drug';
    //   }
    // }
    // return templateArray;
    console.log(templateArray);
    // console.log(JSON.parse(response.body).query.pages[0].cirrusdoc[0].source.template);
    console.log('\n\n\n');
    // console.log(body);
  })
}