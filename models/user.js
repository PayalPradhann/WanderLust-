// aquire mongoose
const mongoose = require("mongoose");
// schema creation
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email :{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);// it automatically saves our user-name,password and add salting and hashing in it ..

module.exports = mongoose.model("User",userSchema);
