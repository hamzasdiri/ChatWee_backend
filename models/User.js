const mongoose = require('mongoose');
const {isEmail} = require('validator');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        validate:[isEmail],
        lowercase:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
        min:6,
    },
    profilePicture:{
        type:String,
        default:"./uploads/profil/random-user.png"
    },
    coverPicture:{
        type:String,
        default:"./uploads/profil/random-user.png"
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    }
},
{timestamps:true}
);

//Mongoose schemas support a timestamps option.
// If you set timestamps: true,
// Mongoose will add two properties of type Date to your schema:
//createdAt: a date representing when this document was created
//updatedAt: a date representing when this document was last updated

//play function before save 
/*UserSchema.pre("save",async function(next){
    const salt =await bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password,salt);
    next();
})*/
module.exports = mongoose.model("User",UserSchema);