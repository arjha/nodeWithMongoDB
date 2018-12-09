const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { config } = require('./config/config');
const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//POST todos
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

//POST users
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
                res.send({ todos });
            }

        }).catch((e) => res.status(400).send('Some error occoured'));
    }
});

//Delete /todos/:Id

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id not found in collection');
    } else {
        Todo.findByIdAndDelete(id).then((todos) => {
            if (!todos) {
                res.status(404).send('Invalid id');
            } else {
                res.send({ todos });
            }

        }).catch((e) => res.status(400).send('Some error occoured'));
    }
});

//Patch /todos/:Id

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id not found in collection');
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = +new Date();
    } else {
        body.completed = false;
        body.completedAt = '';
    }

    Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then((todos) => {
        if (!todos) {
            res.send(400).send('Document can not be updated');
        } else {
            res.send({ todos });
        }

    }).catch((e) => {
        res.send(500).send(e)
    }
    );
});

app.listen(port, () => {
    console.log(`app is started at port ${port}`);
});


module.exports = { app };