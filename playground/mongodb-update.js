const { MongoClient, ObjectID } = require('mongodb');
const assert = require('assert');


(async function () {
    const url = 'mongodb://localhost:27017/TodoApp';
    const dbName = 'TodoApp';
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        await client.connect();
        const db = client.db(dbName);

        db.collection('users').findOneAndUpdate({
            _id: new ObjectID('5bd0af4011ae14043ecbdc40')
        },{
            $unset:{
                age:''
            }
        },{
            returnOriginal:false
        }).then((result)=>{
            console.log(result);
        });
    } catch (err) {
        console.log(err.stack);
    }

    client.close();
})();