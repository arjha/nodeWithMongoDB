const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 111
}];
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    Todo.find({ text }).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e) => done(e));
                }
            });
    })

    it('Should not insert invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch((e) => done(e));
                }
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:Id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('Should return 404 non object id', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('Should delete a todo doc', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    Todo.findById(hexId).then((data) => {
                        expect(data).toBeFalsy();
                        done();
                    }).catch((e) => done(e));
                }
            })
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('Should return 404 non object id', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let reqBody = {
            completed: true,
            text: 'Updated by patch'
        }
        request(app)
            .patch(`/todos/${hexId}`)
            .send(reqBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(reqBody.text);
                expect(res.body.todos.completed).toBe(true);
                expect(typeof res.body.todos.completedAt).toBe('string');
            })
            .end(done);
    });

    it('Should clear completed at data when todo is not completed', (done) => {

        let hexId = todos[1]._id.toHexString();
        let reqBody = {
            completed: false,
            text: 'Updated by patch2'
        }
        request(app)
            .patch(`/todos/${hexId}`)
            .send(reqBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(reqBody.text);
                expect(res.body.todos.completed).toBe(false);
                expect(typeof res.body.todos.completedAt).toBe('object');
            })
            .end(done);
    });
});