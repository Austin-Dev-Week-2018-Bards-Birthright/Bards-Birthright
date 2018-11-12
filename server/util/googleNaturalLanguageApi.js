require('dotenv').config();
const request = require('request');
const language = require('@google-cloud/language');
const wiki = require('./wikipedia.js')

const client = new language.LanguageServiceClient();
let text = 'Hello, world!';
let document = {
  content: text,
  type: 'PLAIN_TEXT',
};

module.exports.getSentiments = (concatTranscript) => {
  console.log(concatTranscript);
  if (concatTranscript) {
    document.content = concatTranscript;
  }
  console.log(document.content);
  client
  .analyzeSentiment({document: document})
  .then((results) => {
    const sentences = results[0].sentences;
    sentences.forEach((e, i) => {
      console.log(`Text: ${e.text.content}`);
      console.log(`Sentiment score: ${e.sentiment.score}`);
      console.log(`Sentiment magnitude: ${e.sentiment.magnitude}`);
    })
  })
  .catch(err => {
    console.error('Error:', err);
    console.log('Error: ', err);
  })
}

module.exports.getEntities = (concatTranscript, callback, jobs, cb2) => {
  console.log('in getEntities');
  console.log(callback);
  console.log(cb2);
  console.log('\n\n\n');
  console.log(concatTranscript);
  if (concatTranscript) {
    document.content = concatTranscript;
  }
  console.log(document.content);
  client
  .analyzeEntities({document: document})
  .then(results => {
    const entities = results[0].entities;

    console.log('Entities:');
    let symptomsArray = [];
    entities.forEach(entity => {
      // console.log(entity.name);
      // console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
      wiki.titleLookup(entity.name, (answer)=> {
        console.log(entity);
        console.log(entity.name);
        console.log('name: ', entity.name, 'answer in google: ', answer);
        if (answer === 'symptom') {
          symptomsArray.push(entity.name)
          callback(symptomsArray, jobs, cb2);
        }
        
        // console.log(symptomsArray);
      })
      
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

