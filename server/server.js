const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
var port=process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});
app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email
    })
    user.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET /todos/:Id

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    console.log('requested id', id);

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id not found in collection');
    } else {
        Todo.findById(id).then((todos) => {
            if (!todos) {
                res.status(404).send('Invalid id');
            } else {
                res.send({todos});
            }

        }).catch((e) => res.status(400).send('Some error occoured'));
    }
});

//Delete

app.delete('/todos/:id',(req,res)=>{
    let id=req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id not found in collection');
    } else {
        Todo.findByIdAndDelete(id).then((todos) => {
            if (!todos) {
                res.status(404).send('Invalid id');
            } else {
                res.send({todos});
            }

        }).catch((e) => res.status(400).send('Some error occoured'));
    }
});

app.listen(port, () => {
    console.log(`app is started at port ${port}`);
});


module.exports = { app };