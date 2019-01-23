const _ = require('lodash');
const express = require('express');
const spdy = require('spdy');
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { config } = require('./envConfig/envConfig');
const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const options = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.crt')
}

const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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
    let body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
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

spdy
    .createServer(options, app)
    .listen(port, (error) => {
        if (error) {
            console.error(error)
            return process.exit(1)
        } else {
            console.log(`app is started at port ${port}`);
        }
    });


module.exports = { app };