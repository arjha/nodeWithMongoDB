const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlenght: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlenght: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log(hash)
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});
userSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();

    return _.pick(userObj, ['_id', 'email']);
}
userSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });

}
userSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

var User = mongoose.model('User', userSchema);

module.exports = { User };