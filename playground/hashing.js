const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');

let pass='ashu123';

bcrypt.genSalt(10,(err,salt)=>{
    console.log('salt',salt)
    bcrypt.hash(pass,salt,(err,hash)=>{
        console.log(hash);
    })
});

let hashedVal='$2a$10$pqZyi/Oqf9N1nsT7tdknOef8A6kMsqHN3BFMKjadoDYlp6NhbB2g.';
bcrypt.compare(pass,hashedVal,(err,res)=>{
    console.log(res)
})

// let data={
//     id:10
// };
// var token=jwt.sign(data,'123abc');
// console.log(token)
// var decoded=jwt.verify(token,'123abc');
// console.log('decoded',decoded)

// let msg = 'number 3';
// let hash = SHA256(msg).toString();

// console.log(`Hash---${hash}`);

// let data = {
//     id: 4
// };
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somekey').toString()
// }

// let resultHash = SHA256(JSON.stringify(token.data) + 'somekey').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not modified');
// } else {
//     console.log('ALERT!!! Data was changed');
// }