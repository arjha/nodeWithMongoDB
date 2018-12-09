const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = "5c0d347aa35dec0b2945177b";
if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
}

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findByIdAndDelete({
    _id:id
}).then((result)=>{
    console.log(result);
});