const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');


(async function() {
  const url = 'mongodb://localhost:27017/TodoApp';
  const dbName = 'TodoApp';
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db(dbName);

    // db.collection('users').deleteMany({Name:/Ashutosh/}).then((data)=>{
    //     console.log(data);
    // });
    // db.collection('users').deleteOne({Name:/Ashutosh/}).then((data)=>{
    //     console.log(data);
    // });
    db.collection('users').findOneAndDelete({Name:/Ashutosh/}).then((data)=>{
        console.log(data);
    });
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();