import mongoose from"mongoose";
const userSchema=new mongoose.Schema({
    firstName:{
    type:String,
    required:true,
    },
    lastName:{
        type:String,
    required:true,
    },
  email:{
    type:String,   
    reqired:true,
    unique:true

  },
  password:{
    type:String,
    required:true,
    // minlength:8,
    // select:false,
  }

});
// export const User=mongoose.model("User",userSchema);
const User = mongoose.model("User", userSchema);
export default User;
