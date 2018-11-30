var mongoose=require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        require:true,
        trim:true,
        minlenght:1
    }
});

module.exports={User};