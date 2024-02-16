const { MongoClient, GridFSBucket } = require('mongodb');

const initGFS = async () => {
  const mongoURI = 'mongodb://127.0.0.1:27017/Demoo';
  const client = await MongoClient.connect(mongoURI);
  const db = client.db();
  
  const gfs = new GridFSBucket(db, { bucketName: 'uploads' });

  return gfs;
};

module.exports = initGFS;


