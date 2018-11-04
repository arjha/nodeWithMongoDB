//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

(async function() {
  const url = 'mongodb://localhost:27017/TodoApp';
  const dbName = 'TodoApp';
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    db.collection('users').insertMany([{
        Name:'Ashutosh Ranjan Jha_1',
        Age:26,
        Location:'Kolkata'
    },{
        Name:'Akhilesh Ranjan Jha_2',
        Age:16,
        Location:'Madhubani'  
    }],(err,result)=>{
        if(err){
            return console.log('Unable to insert data');
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();