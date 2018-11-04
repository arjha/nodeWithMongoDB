//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

// const exec = require('child_process').exec;
// const myVar=exec('sh ./startMongo.sh',
//         (error, stdout, stderr) => {
//             console.log(`${stdout}`);
//             console.log(`${stderr}`);
//             if (error !== null) {
//                 console.log(`exec error: ${error}`);
//             }
//         });

(async function() {
  const url = 'mongodb://localhost:27017/TodoApp';
  const dbName = 'TodoApp';
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    // db.collection('users').find({
    //   '_id': new ObjectID('5bd0aeea5096dc043dda94f6')
    // }).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs,undefined,2));
    // });
    db.collection('users').find({
      'Name':/Ashutosh/
    }).count().then((cnt)=>{
      console.log('users count--'+cnt);
    });
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();