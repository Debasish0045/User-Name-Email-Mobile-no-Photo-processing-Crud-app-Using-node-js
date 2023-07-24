const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },

    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    age:{
        type:String,
        require:true
    },
    photo:{
        type:String,
        require:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now
    }
});

module.exports=mongoose.model("User", userSchema);