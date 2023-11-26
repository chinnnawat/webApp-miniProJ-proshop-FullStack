import mongoose from "mongoose";
import bcryp from "bcryptjs"
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    },
},{
    timestamps:true
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcryp.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) { 
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcryp.genSalt(10);
    this.password = await bcryp.hash(this.password, salt)
})

const User = mongoose.model("User",userSchema);
export default User