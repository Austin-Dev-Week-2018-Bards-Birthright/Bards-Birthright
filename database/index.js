const MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_URL;

const dbName = 'bardsbirthright';


module.exports.insertTranscriptJobs = (transcriptJob, cb) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection('transcripts');

    collection.insertOne(transcriptJob, (err, result) => {
      if (err) {
        client.close();
        cb(err);
      } else {
        client.close();
        cb(null, result);
      }
    });
  });
};

module.exports.retrieveTranscriptJobs = (cb) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection('transcripts');

    collection.find({}).toArray( (err, transcriptJobs) => {
      if (err) {
        client.close();
        console.log('error retrieving transcriptJobs from DB: ', err);
      } else {
        client.close();
        cb(null, transcriptJobs);
      }
    });
  });
};

module.exports.retrieveSingleTranscriptJob = (transcriptJobId, cb) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection('transcripts');

    collection.find({ id: transcriptJobId }).toArray( (err, transcriptJobs) => {
      if (err) {
        client.close();
        console.log('error retrieving transcriptJobs from DB: ', err);
      } else {
        client.close();
        cb(null, transcriptJobs);
      }
    });
  });
};
